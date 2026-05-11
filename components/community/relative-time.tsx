import { formatDistanceToNowStrict } from "date-fns";

type Props = {
  date: string;
  className?: string;
};

export function RelativeTime({ date, className }: Props) {
  const d = new Date(date);
  const label = `${formatDistanceToNowStrict(d)} ago`;
  return (
    <time dateTime={date} title={d.toLocaleString()} className={className}>
      {label}
    </time>
  );
}
