import { assertValidCatalog } from "./catalog-lib.mjs";

try {
  const result = assertValidCatalog();
  const approved = result.assets.filter((asset) => asset.status === "approved").length;
  const deprecated = result.assets.filter((asset) => asset.status === "deprecated").length;
  console.log(
    `イラスト台帳: 正常（approved ${approved}件、deprecated ${deprecated}件、公開画像 ${result.publicImages.length}件）`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
