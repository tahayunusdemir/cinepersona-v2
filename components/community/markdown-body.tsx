import { renderMarkdown } from "@/lib/community/markdown";
import { cn } from "@/lib/utils";

type Props = {
  source: string;
  className?: string;
};

export function MarkdownBody({ source, className }: Props) {
  const html = renderMarkdown(source);
  return (
    <div
      className={cn(
        "prose-sm max-w-none text-sm leading-relaxed text-foreground",
        "[&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline",
        "[&_p]:my-2 first:[&_p]:mt-0 last:[&_p]:mb-0",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs",
        "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
