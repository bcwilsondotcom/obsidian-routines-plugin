import * as fs from "fs";
import * as path from "path";

import esbuild from "esbuild";
import { fileURLToPath } from "url";
import process from "process";
import svelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD.
If you want to view the source, please visit the GitHub repository of this plugin.
*/
`;

function copyAssetsPlugin() {
  return {
    name: "copy-assets",
    setup(build) {
      build.onEnd(() => {
        const rootDir = __dirname;
        const distDir = path.join(rootDir, "dist");

        // Copy manifest.json
        fs.copyFileSync(
          path.join(rootDir, "manifest.json"),
          path.join(distDir, "manifest.json")
        );

        console.log("Copied manifest.json to dist/");
      });
    },
  };
}

const prod = process.argv.includes("production");
console.log(`[esbuild] Production mode: ${prod}`);

await esbuild.build({
  entryPoints: ["src/main.ts"],
  outfile: "dist/main.js",
  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  target: "es2018",
  logLevel: "info",

  // Turn off source maps
  sourcemap: false,

  minify: prod,
  banner: {
    js: banner,
  },
  plugins: [
    svelte({
      compilerOptions: { css: true },
      preprocess: sveltePreprocess(),
    }),
    copyAssetsPlugin(),
  ],
  conditions: [prod ? "production" : "development"],
});

console.log("[esbuild] Build complete, no .map files generated!");