/**
 * Soft DoS guards only — not UX caps.
 * Express body limit is 100kb, so these stay well under that.
 * Full scraped titles/descriptions are stored; UI truncates for display.
 */
export const CONTENT_LIMITS = {
  title: 5_000,
  desc: 80_000,
  link: 4_096,
  previewImage: 4_096,
  tag: 40,
  maxTags: 20,
} as const;

export function trimText(value: string | undefined | null): string {
  return (value || "").trim();
}
