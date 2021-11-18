import { useRouter } from 'next/router';

// TODO: the lng and id param don't currently work well in combination
// https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
const isNumeric = (num: any) =>
  (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) &&
  !isNaN(num as number);

export const useIdQuery = () => {
  const router = useRouter();
  const param = router.asPath.split(/\?/)[1]?.split(/=/)[0];
  const value = router.asPath.split(/\?/)[1]?.split(/=/)[1];
  return typeof value === 'string' && param === 'id' && isNumeric(value)
    ? Number(value)
    : undefined;
};

export const useSearchQuery = () => {
  const router = useRouter();
  const param = router.asPath.split(/\?/)[1]?.split(/=/)[0];
  const value = router.asPath.split(/\?/)[1]?.split(/=/)[1];
  return typeof value === 'string' && param === 'q' ? value : undefined;
};
