import { useRouter } from 'next/router';

export const useQuery = () => {
  const router = useRouter();
  const id = router.asPath.split(/\?/)[1]?.split(/=/)[1];
  return typeof id === 'string' ? id : '';
};
