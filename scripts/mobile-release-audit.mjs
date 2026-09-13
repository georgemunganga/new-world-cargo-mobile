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
    const child = spawn(command, args, { stdio: "inherit", shell: process.platform === "win32" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`)));
  });
}

function packageManagerCommand(scriptName) {
  if (process.env.npm_execpath) return [process.execPath, [process.env.npm_execpath, scriptName]];
  return ["corepack", ["pnpm", scriptName]];
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
assert(eas.build?.preview?.env?.EXPO_PUBLIC_API_MODE === "mock", "Preview build must use mock API mode.");
assert(eas.build?.staging?.env?.EXPO_PUBLIC_API_MODE === "hybrid", "Staging build must use hybrid API mode.");
assert(eas.build?.production?.env?.EXPO_PUBLIC_API_MODE === "laravel", "Production build must use Laravel API mode.");

const [qualityCommand, qualityArgs] = packageManagerCommand("quality");
await run(qualityCommand, qualityArgs);

console.log("Mobile release audit passed.");
