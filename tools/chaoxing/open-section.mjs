import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";
import {
  browserLaunchArgs,
  browserRuntimeInfo,
  findBrowserExecutable,
  outputDir,
  pageText,
  repoRoot,
  saveJson,
  waitForLogin
} from "./browser-utils.mjs";

const courseKeyword = process.argv[2];
const sectionKeyword = process.argv[3];
const port = Number(process.env.CHAOXING_DEBUG_PORT ?? 9222);

if (!courseKeyword || !sectionKeyword) {
  console.error("Usage: npm run chaoxing:open-section -- <course keyword> <section keyword>");
  process.exit(1);
}

function normalize(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function loadCourseUrl(keyword) {
  const coursesPath = path.join(outputDir, "courses.json");
  if (!fs.existsSync(coursesPath)) {
    throw new Error("Missing automation/chaoxing/outputs/courses.json. Run npm run chaoxing:courses first.");
  }

  const data = JSON.parse(fs.readFileSync(coursesPath, "utf8"));
  const match = data.courses.find((course) => normalize(course.title).includes(keyword));
  if (!match) {
    throw new Error(`No course matched keyword: ${keyword}`);
  }
  return match;
}

async function waitForCdp() {
  const endpoint = `http://127.0.0.1:${port}/json/version`;
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30_000) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) return endpoint;
    } catch {
      // Browser is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Browser did not expose CDP on port ${port}.`);
}

function startBrowser() {
  const browserPath = findBrowserExecutable();
  const args = browserLaunchArgs({ remoteDebuggingPort: port, includeUserDataDir: true });

  const child = spawn(browserPath, args, {
    cwd: repoRoot,
    detached: true,
    stdio: "ignore"
  });
  child.unref();
}

async function firstPage(context) {
  let pages = context.pages();
  if (pages.length === 0) {
    const page = await context.newPage();
    pages = [page];
  }
  return pages[pages.length - 1];
}

async function clickTextInFrames(page, labels) {
  for (const frame of page.frames()) {
    for (const label of labels) {
      const locator = frame.getByText(label, { exact: false }).first();
      try {
        if ((await locator.count()) > 0 && (await locator.isVisible({ timeout: 1500 }))) {
          await locator.click({ timeout: 5000 });
          return { clicked: label, frameUrl: frame.url() };
        }
      } catch {
        // Try the next frame/label.
      }
    }
  }
  return null;
}

async function collectTextPreview(page) {
  const frames = [];
  for (const frame of page.frames()) {
    const text = await frame.locator("body").innerText({ timeout: 3000 }).catch(() => "");
    frames.push({
      url: frame.url(),
      textPreview: normalize(text).slice(0, 2000)
    });
  }
  return frames;
}

const course = loadCourseUrl(courseKeyword);

console.log("Browser runtime:", JSON.stringify(browserRuntimeInfo(), null, 2));
startBrowser();
await waitForCdp();

const browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
const context = browser.contexts()[0] ?? (await browser.newContext());
const page = await firstPage(context);

console.log(`Opening course: ${course.title}`);
await page.goto(course.href, { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.waitForTimeout(4000);

if (/passport|login|sso|auth/i.test(page.url())) {
  console.log("Chaoxing is asking for login. Please log in manually in the opened browser window.");
  const loggedIn = await waitForLogin(page, Number(process.env.CHAOXING_LOGIN_TIMEOUT_MS ?? 10 * 60 * 1000));
  if (!loggedIn) {
    await saveJson("open-section-login-blocked.json", {
      course,
      currentUrl: page.url(),
      checkedAt: new Date().toISOString(),
      browser: browserRuntimeInfo(),
      frames: await collectTextPreview(page)
    });
    process.exit(2);
  }
  await page.goto(course.href, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(4000);
}

const chapterClick = await clickTextInFrames(page, ["章节", "目录", "学习内容", "课程内容"]);
if (chapterClick) {
  console.log(`Clicked course navigation: ${chapterClick.clicked}`);
  await page.waitForTimeout(3000);
}

const sectionClick = await clickTextInFrames(page, [sectionKeyword]);
if (sectionClick) {
  console.log(`Clicked section: ${sectionClick.clicked}`);
  await page.waitForTimeout(3000);
}

const debugPath = await saveJson("open-section-debug.json", {
  course,
  requestedSection: sectionKeyword,
  currentUrl: page.url(),
  chapterClick,
  sectionClick,
  checkedAt: new Date().toISOString(),
  frames: await collectTextPreview(page)
});

console.log(`Debug saved: ${debugPath}`);
console.log(`Current URL: ${page.url()}`);
