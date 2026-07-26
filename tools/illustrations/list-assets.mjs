import { assertValidCatalog } from "./catalog-lib.mjs";

const allowedOptions = new Set([
  "theme",
  "emotion",
  "situation",
  "tag",
  "placement",
  "json",
]);

function parseOptions(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new Error(`不明な引数です: ${token}`);
    const [rawName, inlineValue] = token.slice(2).split("=", 2);
    if (!allowedOptions.has(rawName)) throw new Error(`不明なオプションです: --${rawName}`);
    if (rawName === "json") {
      options.json = true;
      continue;
    }
    const value = inlineValue ?? argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`--${rawName} の値が必要です`);
    options[rawName] = value;
    if (inlineValue === undefined) index += 1;
  }
  return options;
}

function includes(values, query) {
  if (!query) return true;
  const normalized = query.toLocaleLowerCase("ja");
  return values.some((value) => value.toLocaleLowerCase("ja").includes(normalized));
}

try {
  const options = parseOptions(process.argv.slice(2));
  const { assets } = assertValidCatalog();
  const matches = assets
    .filter((asset) => asset.status === "approved")
    .filter((asset) => includes(asset.themes, options.theme))
    .filter((asset) => includes(asset.emotions, options.emotion))
    .filter((asset) => includes(asset.situations, options.situation))
    .filter((asset) => includes(asset.tags, options.tag))
    .filter((asset) => includes(asset.recommendedPlacements, options.placement));

  if (options.json) {
    console.log(JSON.stringify(matches, null, 2));
  } else if (matches.length === 0) {
    console.log("条件に合う承認済みイラストはありません。画像なしにするか、不足素材を提案してください。");
  } else {
    for (const asset of matches) {
      console.log(`${asset.id}\t${asset.title}`);
      console.log(`  file: ${asset.file}`);
      console.log(`  themes: ${asset.themes.join(", ")}`);
      console.log(`  emotions: ${asset.emotions.join(", ")}`);
      console.log(`  situations: ${asset.situations.join(", ")}`);
      console.log(`  tags: ${asset.tags.join(", ")}`);
      console.log(`  placements: ${asset.recommendedPlacements.join(", ")}`);
      console.log(`  alt: ${asset.alt}`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
