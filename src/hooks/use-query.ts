import { useRouter } from 'next/router';

// TODO: the lng and id param don't currently work well in combination

export const useQuery = () => {
  const router = useRouter();
  const param = router.asPath.split(/\?/)[1]?.split(/=/)[0];
  const value = router.asPath.split(/\?/)[1]?.split(/=/)[1];
  return typeof value === 'string' && param === 'id' ? value : '';
};
