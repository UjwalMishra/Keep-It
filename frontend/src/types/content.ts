export type ContentType =
  | "youtube"
  | "x"
  | "instagram"
  | "notes"
  | "web articles";

export type ContentFilter = "All" | ContentType;

export type ContentTag = {
  _id?: string;
  title: string;
};

export type ContentItem = {
  _id: string;
  title?: string;
  link?: string;
  type: ContentType;
  desc?: string;
  tags?: ContentTag[];
  previewImage?: string;
  userId?: string | { username?: string };
  createdAt?: string;
  updatedAt?: string;
};

export type ContentPayload = {
  type: ContentType;
  title?: string;
  link?: string;
  desc?: string;
  tags?: string[];
};
