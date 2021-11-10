import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);

export function toRelativeTime(ts: number): string {
  return dayjs(ts).fromNow();
}

export function toDate(ts: number): string {
  return dayjs(ts).format('LL');
}
