import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const platformTools = path.join(root, ".tools", "platform-tools");
const toolsRoot = path.join(root, ".tools");
const args = process.argv.slice(2);
const useApi = args.includes("--api");
const cleanArgs = args.filter((arg) => arg !== "--api");
const port = cleanArgs.includes("--port") ? undefined : (useApi ? "8082" : "8081");
const pathKey = Object.keys(process.env).find((key) => key.toLowerCase() === "path") ?? "PATH";

const env = {
  ...process.env,
  ANDROID_HOME: process.env.ANDROID_HOME || toolsRoot,
  ANDROID_SDK_ROOT: process.env.ANDROID_SDK_ROOT || toolsRoot,
  EXPO_USE_METRO_WORKSPACE_ROOT: "1",
  ...(useApi
    ? {
        EXPO_PUBLIC_API_MODE: "laravel",
        EXPO_PUBLIC_API_BASE_URL: "https://api.newworldcargo.com/api/v1/",
        EXPO_PUBLIC_ADMIN_API_BASE_URL: "https://admin.newworldcargo.com/api/v1/",
        EXPO_PUBLIC_PUBLIC_TRACKING_BASE_URL: "https://api.newworldcargo.com/api/v1/",
        EXPO_PUBLIC_DEBUG_API: "1",
      }
    : {}),
};
env[pathKey] = `${platformTools}${path.delimiter}${process.env[pathKey] ?? ""}`;
if (pathKey !== "PATH") delete env.PATH;

const expoArgs = ["exec", "expo", "start", "--android", "--lan", ...cleanArgs];
if (port) expoArgs.push("--port", port);
const command = process.platform === "win32" ? "cmd.exe" : "pnpm";
const commandArgs = process.platform === "win32"
  ? ["/d", "/s", "/c", ["pnpm", ...expoArgs].join(" ")]
  : expoArgs;

const child = spawn(command, commandArgs, {
  cwd: root,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
