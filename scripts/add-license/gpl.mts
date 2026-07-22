// DrFed: A web-based platform for developing and debugging ActivityPub apps
// Copyright (C) 2026 DrFed team
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const GPL_TXT_PATH = join(dirname(fileURLToPath(import.meta.url)), "gpl.txt");
const GPL = (await readFile(GPL_TXT_PATH, { encoding: "utf-8" }))
  .trimEnd()
  .split("\n");
const JS_GPL = GPL.map((line) => (line === "" ? "//" : `// ${line}`)).join(
  "\n",
);
const CSS_GPL = ["/*", ...GPL, "*/"].join("\n");
const GPL_BY_EXT = {
  ts: JS_GPL,
  tsx: JS_GPL,
  mts: JS_GPL,
  cts: JS_GPL,
  js: JS_GPL,
  jsx: JS_GPL,
  mjs: JS_GPL,
  cjs: JS_GPL,
  css: CSS_GPL,
};

export default GPL_BY_EXT;
