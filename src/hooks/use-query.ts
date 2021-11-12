import { useRouter } from 'next/router';

export const useQuery = () => {
  const router = useRouter();
  const param = router.asPath.split(/\?/)[1]?.split(/=/)[0];
  const value = router.asPath.split(/\?/)[1]?.split(/=/)[1];
  return typeof value === 'string' && param === 'id' ? value : '';
};
