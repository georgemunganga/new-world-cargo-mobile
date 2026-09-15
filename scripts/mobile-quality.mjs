import { spawn } from "node:child_process";

const commands = [
  ["check"],
  ["test"],
];

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

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}

for (const [scriptName] of commands) {
  const [command, args] = packageManagerCommand(scriptName);
  await run(command, args);
}
