import {
  browserRuntimeInfo,
  getMainPage,
  launchChaoxingContext,
  looksLoggedIn,
  pageText,
  saveJson,
  saveMarkdown,
  waitForLogin
} from "./browser-utils.mjs";

const HOME_URL = "https://i.chaoxing.com/";
const timeoutMs = Number(process.env.CHAOXING_LOGIN_TIMEOUT_MS ?? 10 * 60 * 1000);

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function dedupeCourses(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = `${item.title}|${item.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

const context = await launchChaoxingContext();
const page = await getMainPage(context);

console.log("Browser runtime:", JSON.stringify(browserRuntimeInfo(), null, 2));
await page.goto(HOME_URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.waitForTimeout(3000);

if (!(await looksLoggedIn(page))) {
  console.log("Chaoxing is asking for login. Please log in manually in the opened browser window.");
  const loggedIn = await waitForLogin(page, timeoutMs);
  if (!loggedIn) {
    const text = await pageText(page);
    await saveJson("course-scan-login-blocked.json", {
      url: page.url(),
      checkedAt: new Date().toISOString(),
      browser: browserRuntimeInfo(),
      pageTextPreview: text.slice(0, 1000)
    });
    console.log("Login was not confirmed before timeout. Re-run npm.cmd run chaoxing:login after signing in.");
    await context.close();
    process.exit(2);
  }
}

await page.goto("https://i.chaoxing.com/base", { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.waitForTimeout(5000);

const anchors = [];
for (const frame of page.frames()) {
  const frameUrl = frame.url();
  const frameAnchors = await frame
    .locator("a")
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        text: node.innerText || node.textContent || "",
        title: node.getAttribute("title") || "",
        href: node.href || node.getAttribute("href") || "",
        aria: node.getAttribute("aria-label") || ""
      }))
    )
    .catch(() => []);

  for (const item of frameAnchors) {
    anchors.push({ ...item, frameUrl });
  }
}

const courseCandidates = anchors
  .map((item) => ({
    title: normalizeText(item.title || item.text || item.aria),
    href: item.href
  }))
  .filter((item) => item.title && item.href)
  .filter((item) => {
    const haystack = `${item.title} ${item.href}`;
    return /课程|course|clazz|mooc|learn|knowledge|interaction|visit/i.test(haystack);
  });

const courses = dedupeCourses(courseCandidates);

const jsonTarget = await saveJson("courses.json", {
  scannedAt: new Date().toISOString(),
  pageUrl: page.url(),
  frameCount: page.frames().length,
  anchorCount: anchors.length,
  courseCount: courses.length,
  courses
});

await saveJson("anchors-debug.json", {
  scannedAt: new Date().toISOString(),
  pageUrl: page.url(),
  anchors: anchors.map((item) => ({
    title: normalizeText(item.title || item.text || item.aria),
    href: item.href,
    frameUrl: item.frameUrl
  }))
});

const md = [
  "# Chaoxing Course Scan",
  "",
  `- Scanned at: ${new Date().toISOString()}`,
  `- Page: ${page.url()}`,
  `- Candidate course links: ${courses.length}`,
  "",
  "| # | Course / Link text | URL |",
  "|---|---|---|",
  ...courses.map((course, index) => `| ${index + 1} | ${course.title.replace(/\|/g, "\\|")} | ${course.href} |`)
].join("\n");

const mdTarget = await saveMarkdown("courses.md", md);

console.log(`Course scan saved: ${jsonTarget}`);
console.log(`Course scan markdown saved: ${mdTarget}`);
console.log(`Candidate course links: ${courses.length}`);

await context.close();
