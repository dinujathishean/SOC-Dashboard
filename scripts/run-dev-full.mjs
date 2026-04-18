/**
 * Runs Vite + API in parallel (avoids Windows/cmd issues with nested npm + concurrently).
 */
import { spawn } from "node:child_process";
import process from "node:process";

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

function runDevFull() {
  let exiting = false;

  const spawnNpm = (args, label) => {
    const child = spawn(npmCmd, args, {
      cwd: process.cwd(),
      stdio: "inherit",
      env: process.env,
      shell: false,
    });
    child.on("error", (err) => {
      console.error(`[${label}]`, err);
      shutdown(1);
    });
    return child;
  };

  const web = spawnNpm(["run", "dev"], "web");
  const api = spawnNpm(["run", "dev", "--prefix", "server"], "api");

  const shutdown = (code) => {
    if (exiting) return;
    exiting = true;
    try {
      web.kill(isWin ? undefined : "SIGTERM");
    } catch {
      /* ignore */
    }
    try {
      api.kill(isWin ? undefined : "SIGTERM");
    } catch {
      /* ignore */
    }
    process.exit(typeof code === "number" ? code : 0);
  };

  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));

  const onChildExit = (which) => (code, signal) => {
    if (exiting) return;
    if (signal) {
      shutdown(0);
      return;
    }
    if (code !== 0 && code !== null) {
      console.error(`[${which}] exited with code ${code}`);
    }
    shutdown(code ?? 0);
  };

  web.on("exit", onChildExit("web"));
  api.on("exit", onChildExit("api"));
}

runDevFull();
