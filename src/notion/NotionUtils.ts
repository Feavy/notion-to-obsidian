import {NotionIcon, NotionImageFile, NotionRichText} from "./NotionTypes";

function text(block: NotionRichText): string {
  let text = block.plain_text;
  if (block.type === "equation")
    text = block.equation.expression;

  if (block.annotations.bold)
    text = `**${text}**`;
  if (block.annotations.italic)
    text = `*${text}*`;
  if (block.annotations.code)
    text = `\`${text}\``;
  if (block.annotations.strikethrough)
    text = `~~${text}~~`;
  if (block.type === "equation")
    text = `$${text}$`;
  if (block.href)
    text = `[${text}](${block.href})`;

  return text;
}

export function uuid(id: string) {
  return id.substring(0, 8) + "-" + id.substring(8, 12) + "-" + id.substring(12, 16) + "-" + id.substring(16, 20) + "-" + id.substring(20, 32);
}

export function escape(title: string) {
  return title.replaceAll(/[*"/\\:|?<>]/g, "").trim();
}

export function texts(blocks: NotionRichText[], indent = ""): string {
  return `${indent}${blocks.map(text).join("")}`;
}

function plaintext(block: NotionRichText): string {
  return block.plain_text;
}

export function plaintexts(blocks: NotionRichText[], indent = ""): string {
  return `${indent}${blocks.map(plaintext).join("")}`;
}

export function imageUrl(image: NotionImageFile) {
  if (!image) return null;
  return image.type === "external" ? image.external.url : image.file.url;
}

export function icon(icon: NotionIcon) {
  if (!icon) return null;
  return icon.type === "emoji" ? icon.emoji : imageUrl({...icon, caption: null});
}