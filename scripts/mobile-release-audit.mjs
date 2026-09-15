import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const requiredFiles = [
  "app.config.ts",
  "eas.json",
  "docs/mobile-release-checklist.md",
  "assets/images/icon.png",
  "assets/images/android-icon-foreground.png",
  "assets/images/favicon.png",
  "assets/images/new-world-cargo-logo-light.png",
  "assets/images/new-world-cargo-logo.png",
];

const forbiddenAssetNames = [
  "assets/images/react-logo.png",
  "assets/images/react-logo@2x.png",
  "assets/images/react-logo@3x.png",
  "assets/images/partial-react-logo.png",
  "assets/images/splash-icon.png",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`)));
  });
}

function packageManagerCommand(scriptName) {
  if (process.env.npm_execpath) {
    if (/\.(?:cjs|mjs|js)$/i.test(process.env.npm_execpath)) {
      return [process.execPath, [process.env.npm_execpath, "run", scriptName]];
    }
    return [process.env.npm_execpath, ["run", scriptName]];
  }
  if (process.platform === "win32") return ["cmd.exe", ["/d", "/s", "/c", "pnpm", "run", scriptName]];
  return ["corepack", ["pnpm", "run", scriptName]];
}

for (const file of requiredFiles) assert(fileExists(file), `Missing required release file: ${file}`);
for (const file of forbiddenAssetNames) assert(!fileExists(file), `Template asset should not ship: ${file}`);

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
assert(pkg.scripts?.quality === "node scripts/mobile-quality.mjs", "Missing pnpm quality release gate.");
assert(pkg.scripts?.["build:preview:android"] === "eas build --profile preview --platform android", "Missing preview Android build script.");
assert(pkg.scripts?.["build:staging:android"] === "eas build --profile staging --platform android", "Missing staging Android build script.");
assert(pkg.scripts?.["build:production:android"] === "eas build --profile production --platform android", "Missing production Android build script.");
assert(pkg.scripts?.["build:production:ios"] === "eas build --profile production --platform ios", "Missing production iOS build script.");

const eas = JSON.parse(fs.readFileSync(path.join(root, "eas.json"), "utf8"));
for (const profileName of ["preview", "staging", "production"]) {
  const env = eas.build?.[profileName]?.env;
  assert(env?.EXPO_PUBLIC_API_MODE === "laravel", `${profileName} build must use Laravel API mode.`);
  assert(env?.EXPO_PUBLIC_API_BASE_URL === "https://api.newworldcargo.com/api/v1/", `${profileName} must use the public API v1 base URL.`);
  assert(env?.EXPO_PUBLIC_PUBLIC_TRACKING_BASE_URL === "https://api.newworldcargo.com/api/v1/", `${profileName} must use the public tracking API v1 base URL.`);
  assert(env?.EXPO_PUBLIC_ADMIN_API_BASE_URL === "https://admin.newworldcargo.com/api/v1/", `${profileName} must use the admin API v1 base URL.`);
  assert(env?.EXPO_PUBLIC_MAPS_PROVIDER === "native", `${profileName} build must use native maps.`);
  assert(env?.EXPO_PUBLIC_PAYMENTS_PROVIDER === "laravel", `${profileName} build must use Laravel payments.`);
}

const [qualityCommand, qualityArgs] = packageManagerCommand("quality");
await run(qualityCommand, qualityArgs);

console.log("Mobile release audit passed.");

