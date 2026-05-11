import {
  GhostIcon,
  HeartIcon,
  MessageSquareIcon,
  NewspaperIcon,
  RocketIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon,
  SwordsIcon,
  TvIcon,
  VideoIcon,
  Wand2Icon,
  type LucideIcon,
} from "lucide-react";

export const boardIcons: Record<string, LucideIcon> = {
  "action-adventure": SwordsIcon,
  animation: SparklesIcon,
  "crime-mystery": SearchIcon,
  documentaries: VideoIcon,
  fantasy: Wand2Icon,
  horror: GhostIcon,
  "film-news": NewspaperIcon,
  romance: HeartIcon,
  "sci-fi": RocketIcon,
  superheroes: ShieldIcon,
  "tv-discussion": TvIcon,
  meta: MessageSquareIcon,
};

export function boardIcon(slug: string): LucideIcon {
  return boardIcons[slug] ?? MessageSquareIcon;
}
