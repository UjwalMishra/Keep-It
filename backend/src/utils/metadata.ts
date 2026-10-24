import * as cheerio from "cheerio";
import { trimText } from "../constants/contentLimits";
import { isSafePublicUrl } from "./urlSafety";

export type PageMetadata = {
  title: string;
  description: string;
  image: string;
};

const USER_AGENT =
  "Mozilla/5.0 (compatible; KeepItBot/1.0; +https://keep-it-omega.vercel.app)";

const FETCH_TIMEOUT_MS = 8_000;
const MAX_HTML_BYTES = 1_500_000;

function absolutizeUrl(base: string, maybeRelative: string | undefined): string {
  if (!maybeRelative) return "";
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return "";
  }
}

function pickMeta($: cheerio.CheerioAPI, selectors: string[]): string {
  for (const selector of selectors) {
    const value = $(selector).attr("content")?.trim();
    if (value) return value;
  }
  return "";
}

function fallbackTitleFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Web article";
  }
}

/**
 * Lightweight HTML metadata scrape — works on Vercel serverless
 * (unlike Puppeteer, which cannot launch Chrome there).
 */
export async function fetchPageMetadata(
  rawUrl: string
): Promise<PageMetadata | null> {
  const safeUrl = await isSafePublicUrl(rawUrl);
  if (!safeUrl) return null;

  try {
    const response = await fetch(safeUrl, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml")
    ) {
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const html = buffer.subarray(0, MAX_HTML_BYTES).toString("utf8");
    const $ = cheerio.load(html);

    const rawTitle =
      pickMeta($, ['meta[property="og:title"]', 'meta[name="twitter:title"]']) ||
      $("title").first().text().trim() ||
      fallbackTitleFromUrl(safeUrl);

    const rawDescription =
      pickMeta($, [
        'meta[property="og:description"]',
        'meta[name="description"]',
        'meta[name="twitter:description"]',
      ]) || "";

    const rawImage = absolutizeUrl(
      safeUrl,
      pickMeta($, [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
        'meta[itemprop="image"]',
      ])
    );

    return {
      title: trimText(rawTitle),
      description: trimText(rawDescription),
      image: trimText(rawImage),
    };
  } catch (err) {
    console.warn(`Metadata fetch failed for ${rawUrl}:`, err);
    return null;
  }
}
