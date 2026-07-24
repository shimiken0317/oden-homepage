const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return LOCAL_SITE_URL;
  }

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return LOCAL_SITE_URL;
    }

    return url.origin;
  } catch {
    return LOCAL_SITE_URL;
  }
}
