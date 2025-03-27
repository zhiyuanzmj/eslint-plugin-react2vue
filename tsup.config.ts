import process from "node:process";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/*.ts", "!./**.d.ts"],
  clean: true,
  format: ["esm"],
  watch: !!process.env.DEV,
  dts: !process.env.DEV,
  cjsInterop: true,
  splitting: true,
  external: ["vue"],
  define: {
    __DEV__: "true",
  },
});
