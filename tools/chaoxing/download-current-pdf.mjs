import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { browserRuntimeInfo, saveJson } from "./browser-utils.mjs";

const port = Number(process.env.CHAOXING_DEBUG_PORT ?? 9222);
const modeArgIndex = process.argv.indexOf("--mode");
const outputArgIndex = process.argv.indexOf("--output");
const downloadMode = process.env.CHAOXING_DOWNLOAD_MODE || (modeArgIndex >= 0 ? process.argv[modeArgIndex + 1] : "") || "pdf";
const outputFromArg = outputArgIndex >= 0 ? process.argv[outputArgIndex + 1] : "";
const outputFromEnv = process.env.CHAOXING_OUTPUT_DIR || "";

if (!outputFromEnv && !outputFromArg) {
  console.error("Missing output folder. Ask the user where to save course materials, then pass --output \"<course-materials-folder>\" or set CHAOXING_OUTPUT_DIR.");
  process.exit(1);
}

const targetDownloadDir = path.resolve(outputFromEnv || outputFromArg);

function safeFileName(value) {
  return String(value || "chaoxing-resource")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, " ")
    .trim();
}

function parseObjectId(value) {
  const text = String(value || "");
  return text.match(/objectid=([a-zA-Z0-9]+)/i)?.[1] || text.match(/file_([a-zA-Z0-9]+)/i)?.[1] || "";
}

function inferExtFromUrl(value) {
  const pathname = new URL(value).pathname;
  const ext = path.extname(pathname);
  return ext && ext.length <= 8 ? ext : "";
}

function fileBaseName(filename) {
  const safe = safeFileName(filename || "chaoxing-resource");
  const ext = path.extname(safe);
  return ext ? safe.slice(0, -ext.length) : safe;
}

function isDocumentStatus(status) {
  const filename = String(status.filename || status.name || "").toLowerCase();
  return Boolean(status.pdf) || /\.(pdf|pptx?|docx?|xlsx?)$/.test(filename);
}

function isMediaStatus(status) {
  const filename = String(status.filename || status.name || "").toLowerCase();
  return Boolean(status.http || status.mp3) || /\.(mp4|mov|m4a|mp3|wav|flac|aac)$/.test(filename);
}

function pickFileChoices(status) {
  const filename = String(status.filename || status.name || "");
  const lower = filename.toLowerCase();
  const officeExts = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"];
  const choices = [];

  const add = (kind, url, filenameOverride = filename) => {
    if (!url) return;
    const normalizedUrl = String(url).replace(/^http:\/\//i, "https://");
    if (choices.some((choice) => choice.kind === kind && choice.url === normalizedUrl)) return;
    choices.push({ kind, url: normalizedUrl, filename: filenameOverride });
  };

  if (["pdf", "both", "all"].includes(downloadMode) && status.pdf) {
    add("pdf", status.pdf, `${fileBaseName(filename)}.pdf`);
  }

  if (["source", "both", "all"].includes(downloadMode) && officeExts.some((ext) => lower.includes(ext)) && status.download) {
    add("office-source", status.download, filename);
  }

  if (["media", "all"].includes(downloadMode)) {
    if (status.http && isMediaStatus(status)) add("media", status.http, filename);
    if (!status.http && status.download && isMediaStatus(status)) add("media", status.download, filename);
  }

  return choices;
}

function contentDispositionFilename(header) {
  if (!header) return "";
  const utf8 = header.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (utf8) return decodeURIComponent(utf8);
  const plain = header.match(/filename="?([^";]+)"?/i)?.[1];
  return plain || "";
}

async function pickStudyPage(context) {
  const pages = context.pages();
  return pages.find((page) => /studentstudy/i.test(page.url())) ?? pages.find((page) => /chaoxing/i.test(page.url())) ?? pages.at(-1);
}

async function collectResourceCandidates(page) {
  const candidates = [];

  for (const [frameIndex, frame] of page.frames().entries()) {
    const frameCandidates = await frame
      .evaluate(() => {
        function objectIdFrom(text) {
          const value = String(text || "");
          return value.match(/objectid=([a-zA-Z0-9]+)/i)?.[1] || value.match(/file_([a-zA-Z0-9]+)/i)?.[1] || "";
        }

        function textNear(node) {
          const parent = node.closest(".ans-attach-ct, .ans-job-icon, .ans-attach-online") || node.parentElement;
          return (parent?.innerText || node.getAttribute("name") || node.getAttribute("title") || "").replace(/\s+/g, " ").trim();
        }

        const result = [];
        for (const node of document.querySelectorAll("iframe, embed, object")) {
          const src = node.getAttribute("src") || node.getAttribute("data") || "";
          const objectid = node.getAttribute("objectid") || node.getAttribute("objectId") || objectIdFrom(src);
          if (!objectid) continue;

          let dataName = "";
          const dataAttr = node.getAttribute("data");
          if (dataAttr && dataAttr.trim().startsWith("{")) {
            try {
              dataName = JSON.parse(dataAttr).name || "";
            } catch {
              dataName = "";
            }
          }

          result.push({
            objectid,
            name: dataName || node.getAttribute("name") || node.getAttribute("title") || textNear(node),
            src,
            className: node.className || "",
            id: node.id || "",
            tag: node.tagName
          });
        }
        return result;
      })
      .catch(() => []);

    for (const item of frameCandidates) {
      candidates.push({
        ...item,
        frameIndex,
        frameUrl: frame.url(),
        source: "dom"
      });
    }

    const fromFrameUrl = parseObjectId(frame.url());
    if (fromFrameUrl) {
      candidates.push({
        objectid: fromFrameUrl,
        name: "",
        src: frame.url(),
        className: "",
        id: "",
        tag: "FRAME_URL",
        frameIndex,
        frameUrl: frame.url(),
        source: "frame-url"
      });
    }
  }

  const seen = new Set();
  return candidates.filter((item) => {
    const key = item.objectid;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchStatusInBrowser(page, objectid) {
  return page.evaluate(async (id) => {
    const url = `${location.protocol}//mooc1.chaoxing.com/ananas/status/${id}?flag=normal`;
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        accept: "application/json,text/plain,*/*"
      }
    });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return {
      ok: response.ok,
      statusCode: response.status,
      url,
      textPreview: text.slice(0, 1000),
      json
    };
  }, objectid);
}

async function cookiesForUrl(context, url) {
  const cookies = await context.cookies(url).catch(() => []);
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

function uniquePath(dir, filename) {
  const parsed = path.parse(filename);
  let target = path.join(dir, filename);
  let index = 2;
  while (fs.existsSync(target)) {
    target = path.join(dir, `${parsed.name} (${index})${parsed.ext}`);
    index += 1;
  }
  return target;
}

function subdirForKind(kind) {
  if (kind === "pdf") return "01_pdf_for_ai";
  if (kind === "office-source" || kind === "download") return "02_source_files";
  if (kind === "media") return "03_video_audio";
  return "04_other";
}

async function appendManifest(entry) {
  const manifestDir = path.join(targetDownloadDir, "manifest");
  fs.mkdirSync(manifestDir, { recursive: true });
  const jsonPath = path.join(manifestDir, "materials-manifest.json");
  const mdPath = path.join(manifestDir, "materials-manifest.md");
  const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : [];
  existing.push(entry);
  fs.writeFileSync(jsonPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");

  const rows = existing.map(
    (item, index) =>
      `| ${index + 1} | ${item.filename.replace(/\|/g, "\\|")} | ${item.kind} | ${item.bytes} | ${item.objectid} | ${item.relativePath.replace(/\|/g, "\\|")} |`
  );
  fs.writeFileSync(
    mdPath,
    [
      "# Chaoxing Materials Manifest",
      "",
      "| # | Filename | Kind | Bytes | Object ID | Relative path |",
      "|---|---|---:|---:|---|---|",
      ...rows,
      ""
    ].join("\n"),
    "utf8"
  );
}

async function downloadFile(context, page, choice, objectid) {
  const kindDir = path.join(targetDownloadDir, subdirForKind(choice.kind));
  fs.mkdirSync(kindDir, { recursive: true });

  const headers = {
    referer: page.url(),
    "user-agent": await page.evaluate(() => navigator.userAgent).catch(() => "Mozilla/5.0"),
    accept: "*/*"
  };

  const cookie = await cookiesForUrl(context, choice.url);
  if (cookie) headers.cookie = cookie;

  const response = await fetch(choice.url, { headers, redirect: "follow" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while downloading ${choice.url}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const dispositionName = contentDispositionFilename(response.headers.get("content-disposition"));
  let finalName = safeFileName(choice.filename || dispositionName);
  if (!path.extname(finalName)) {
    const urlExt = inferExtFromUrl(response.url);
    finalName += urlExt || (contentType.includes("pdf") ? ".pdf" : ".bin");
  }

  const target = uniquePath(kindDir, finalName);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (choice.kind === "pdf" && buffer.slice(0, 4).toString("utf8") !== "%PDF") {
    throw new Error(`Downloaded content is not a PDF (${buffer.length} bytes).`);
  }
  fs.writeFileSync(target, buffer);

  const record = {
    target,
    filename: path.basename(target),
    kind: choice.kind,
    objectid,
    bytes: buffer.length,
    contentType,
    finalUrl: response.url,
    downloadedAt: new Date().toISOString()
  };
  await appendManifest({
    filename: record.filename,
    kind: record.kind,
    objectid,
    bytes: record.bytes,
    relativePath: path.relative(targetDownloadDir, record.target),
    sourcePageRecorded: Boolean(page.url()),
    downloadedAt: record.downloadedAt
  });
  return record;
}

async function main() {
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
  const context = browser.contexts()[0];
  if (!context) throw new Error("No browser context is available. Open a Chaoxing section first.");

  const page = await pickStudyPage(context);
  if (!page) throw new Error("No Chaoxing study page is available.");

  const candidates = await collectResourceCandidates(page);
  const statuses = [];

  for (const candidate of candidates) {
    const status = await fetchStatusInBrowser(page, candidate.objectid).catch((error) => ({
      ok: false,
      error: error.message,
      json: null
    }));
    statuses.push({ candidate, status });
  }

  const downloadable = statuses
    .map((item) => {
      const json = item.status.json || {};
      return {
        ...item,
        fileChoices: item.status.ok && json.status === "success" ? pickFileChoices(json) : [],
        isDocument: isDocumentStatus(json),
        filename: json.filename || json.name || item.candidate.name || `${item.candidate.objectid}.bin`
      };
    })
    .filter((item) => item.fileChoices.length > 0);

  const picked =
    downloadable.find((item) => downloadMode !== "media" && item.isDocument) ||
    downloadable.find((item) => downloadMode === "media" && isMediaStatus(item.status.json || {})) ||
    downloadable[0];

  const downloads = [];
  let failure = null;

  if (picked) {
    for (const choice of picked.fileChoices) {
      try {
        downloads.push(await downloadFile(context, page, choice, picked.candidate.objectid));
      } catch (error) {
        failure = error.message;
      }
    }
  } else {
    failure = "No downloadable resource found from Chaoxing status endpoints.";
  }

  const result = {
    ok: downloads.length > 0,
    pageUrl: page.url(),
    checkedAt: new Date().toISOString(),
    downloadMode,
    outputDir: targetDownloadDir,
    browser: browserRuntimeInfo(),
    downloadEngine: "node-fetch-with-browser-cookies",
    candidateCount: candidates.length,
    candidates,
    statuses,
    picked: picked
      ? {
          objectid: picked.candidate.objectid,
          filename: picked.filename,
          choices: picked.fileChoices,
          statusUrl: picked.status.url
        }
      : null,
    downloads,
    failure
  };

  console.log(JSON.stringify(result, null, 2));
  await saveJson("download-pdf-result.json", result);
  process.exit(result.ok ? 0 : 2);
}

await main();
