import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

export async function load(url, context, nextLoad) {
  if (!url.endsWith(".yml") && !url.endsWith(".yaml")) {
    return nextLoad(url, context);
  }

  const source = await fs.readFile(fileURLToPath(url), "utf8");
  const parsed = yaml.parse(source);

  return {
    format: "module",
    shortCircuit: true,
    source: `export default ${JSON.stringify(parsed)};`,
  };
}