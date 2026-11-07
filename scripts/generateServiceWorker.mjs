import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.resolve(projectRoot, process.argv[2] ?? "dist");
const templatePath = path.join(projectRoot, "scripts", "pwa-sw.template.js");

async function walk(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry);
    const details = await stat(absolute);
    if (details.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
}

const files = (await walk(outputDirectory))
  .filter((file) => !file.endsWith("sw.js") && !file.endsWith(".map"))
  .sort();
const urls = files.map((file) => `/${path.relative(outputDirectory, file).split(path.sep).join("/")}`);
const fingerprint = createHash("sha256");
for (const file of files) {
  fingerprint.update(path.relative(outputDirectory, file));
  fingerprint.update(await readFile(file));
}
const cacheName = `flashmedic-precache-${fingerprint.digest("hex").slice(0, 12)}`;
const template = await readFile(templatePath, "utf8");
const worker = template
  .replace("__PRECACHE_NAME__", cacheName)
  .replace("__RUNTIME_NAME__", `${cacheName}-runtime`)
  .replace("__PRECACHE_URLS__", JSON.stringify(urls, null, 2));
await writeFile(path.join(outputDirectory, "sw.js"), worker, "utf8");
console.log(`Generated ${cacheName} with ${urls.length} precached files.`);
