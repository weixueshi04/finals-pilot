import {
  browserRuntimeInfo,
  getMainPage,
  launchChaoxingContext,
  looksLoggedIn,
  saveJson,
  waitForLogin
} from "./browser-utils.mjs";

const LOGIN_URL = "https://i.chaoxing.com/";
const timeoutMs = Number(process.env.CHAOXING_LOGIN_TIMEOUT_MS ?? 10 * 60 * 1000);

const context = await launchChaoxingContext();
const page = await getMainPage(context);

console.log("Browser runtime:", JSON.stringify(browserRuntimeInfo(), null, 2));
console.log("Opening Chaoxing login page...");
await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.waitForTimeout(3000);

let loggedIn = await looksLoggedIn(page);
if (loggedIn) {
  console.log("Existing Chaoxing login appears ready. No manual login is needed.");
} else {
  console.log("Please log in manually in the opened browser window.");
  console.log(`Waiting up to ${Math.round(timeoutMs / 1000)} seconds for a logged-in page...`);
  loggedIn = await waitForLogin(page, timeoutMs);
}

const result = {
  loggedIn,
  url: page.url(),
  checkedAt: new Date().toISOString(),
  browser: browserRuntimeInfo()
};

const target = await saveJson("login-state.json", result);
console.log(`Login state saved: ${target}`);

if (loggedIn) {
  console.log("Chaoxing login appears ready. You can now run: npm.cmd run chaoxing:courses");
} else {
  console.log("Login was not confirmed before timeout. Re-run npm.cmd run chaoxing:login after signing in.");
}

await context.close();
process.exit(loggedIn ? 0 : 2);
