import React, { ReactNode } from 'react';
import { IS_SSR } from 'jotai-query-toolkit';

const SafeSuspense = ({
  children,
  fallback,
  onlyOnClient,
}: {
  children?: ReactNode;
  onlyOnClient?: boolean;
  fallback: NonNullable<ReactNode> | null;
}) => {
  if (IS_SSR && onlyOnClient) return <>{children}</>;
  if (IS_SSR) return <>{fallback}</>;
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};

export default SafeSuspense;
