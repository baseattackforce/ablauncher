// Usage: node build-data-url.mjs [url]
// Writes data-url.txt: standalone.html condensed into one data: URL.
// With a url argument the link is baked into the fragment, so opening the
// result launches it immediately.
import { readFileSync, writeFileSync } from "node:fs";

let html = readFileSync(new URL("./standalone.html", import.meta.url), "utf8");
html = html
  .replace(/^\s*\/\/.*$/gm, "")                  // whole-line comments only; "https://" must survive
  .replace(/^\s+/gm, "")
  .replace(/\n+/g, "\n")
  .trim();

let out = "data:text/html;charset=utf-8," + encodeURIComponent(html)
  .replace(/%20/g, " ")                        // spaces are legal in the URL bar
  .replace(/%3D/g, "=").replace(/%2F/g, "/").replace(/%3A/g, ":")
  .replace(/%3B/g, ";").replace(/%2C/g, ",").replace(/%22/g, '"')
  .replace(/%0A/g, "");
const link = process.argv[2];
if (link) out += "#" + encodeURIComponent(link);
writeFileSync(new URL("./data-url.txt", import.meta.url), out);
console.log(out.length + " characters");
