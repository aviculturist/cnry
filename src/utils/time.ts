import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(duration);

export function toRelativeTime(ts: number): string {
  return dayjs(ts).fromNow();
}

export function toDate(ts: number): string {
  return dayjs(ts).format('ll');
}

export function humanizeDuration(ts: number): string {
  return dayjs.duration(ts).humanize();
}
