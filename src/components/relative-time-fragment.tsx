import * as React from 'react';
import { toRelativeTime } from '@utils/time';

const RelativeTimeFragment = ({ timestamp }: { timestamp: number | undefined }) => {
  if (timestamp === undefined) {
    return <React.Fragment />;
  } else {
    return <React.Fragment>{toRelativeTime(timestamp * 1000)}</React.Fragment>;
  }
};
export default RelativeTimeFragment;
