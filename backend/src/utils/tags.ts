import { Tag } from "../models/Tag";

export async function resolveTagIds(tagTitles: string[] = []): Promise<string[]> {
  const normalized = [
    ...new Set(
      tagTitles
        .map((tag) => tag.toLowerCase().trim())
        .filter((tag) => tag.length > 0 && tag.length <= 40)
    ),
  ].slice(0, 20);

  if (normalized.length === 0) return [];

  const ops = normalized.map((title) =>
    Tag.findOneAndUpdate(
      { title },
      { $setOnInsert: { title } },
      { upsert: true, new: true }
    )
  );

  const tags = await Promise.all(ops);
  return tags.filter(Boolean).map((tag) => String(tag!._id));
}
