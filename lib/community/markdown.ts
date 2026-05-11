// Minimal, conservative server-side markdown → HTML.
// Subset: paragraphs, line breaks, **bold**, *italic*, `code`, ```fenced```,
// > blockquote, - / 1. lists, [text](https://...), and autolinks.
//
// Output is HTML-escaped first, then a small set of tags is injected. There is
// no raw-HTML passthrough, so this is safe to use with dangerouslySetInnerHTML.

const ALLOWED_LINK = /^https?:\/\//i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(src: string): string {
  let s = escapeHtml(src);

  // Inline code first so other rules can't poison its content.
  s = s.replace(/`([^`\n]+?)`/g, (_m, code) => `<code>${code}</code>`);

  // Links: [text](url) — url must be http(s) after decoding our escape.
  s = s.replace(
    /\[([^\]\n]+)\]\(([^)\s]+)\)/g,
    (_m, text: string, rawUrl: string) => {
      const url = rawUrl.replace(/&amp;/g, "&");
      if (!ALLOWED_LINK.test(url)) return _m;
      const safeUrl = escapeHtml(url);
      return `<a href="${safeUrl}" target="_blank" rel="noopener nofollow ugc">${text}</a>`;
    },
  );

  // Bold then italic. Order matters because ** must beat *.
  s = s.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+?)\*/g, "$1<em>$2</em>");

  return s;
}

type Block =
  | { kind: "p"; text: string }
  | { kind: "blockquote"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "pre"; code: string };

function tokenize(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1; // consume closing fence
      blocks.push({ kind: "pre", code: buf.join("\n") });
      continue;
    }

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ kind: "blockquote", text: buf.join("\n") });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^```/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i += 1;
    }
    blocks.push({ kind: "p", text: buf.join("\n") });
  }

  return blocks;
}

export function renderMarkdown(src: string): string {
  return tokenize(src)
    .map((b) => {
      switch (b.kind) {
        case "p":
          return `<p>${renderInline(b.text).replace(/\n/g, "<br />")}</p>`;
        case "blockquote":
          return `<blockquote>${renderInline(b.text).replace(/\n/g, "<br />")}</blockquote>`;
        case "ul":
          return `<ul>${b.items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</ul>`;
        case "ol":
          return `<ol>${b.items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</ol>`;
        case "pre":
          return `<pre><code>${escapeHtml(b.code)}</code></pre>`;
      }
    })
    .join("\n");
}

export function plainTextExcerpt(src: string, max = 240): string {
  const flat = src
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, max - 1).trimEnd() + "…";
}
