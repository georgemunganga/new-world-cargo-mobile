import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    __DEV__: "false",
  },
  test: {
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});
