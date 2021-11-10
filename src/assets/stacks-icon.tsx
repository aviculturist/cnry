import * as React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { createSvgIcon } from '@mui/material/utils';

const StacksIcon = (props: any) => {
  return (
    <SvgIcon width="24" height="24" viewBox="-24 -24 144 144" viewport="0 0 24 24" {...props}>
      <path
        id="logoMark"
        fill={document.body.className == 'dark' ? '#FFF' : '#000'}
        d="M90.3747,99.59l-21.13-32.014h30.344V55.4976H0V67.59H30.3341L9.2142,99.59H24.9708L49.7945,61.9784,74.6181,99.59ZM99.5889,43.775v-12.2H69.8612L90.7007,0H74.9442l-25.15,38.1051L24.6447,0H8.8882L29.7544,31.6033H0V43.775Z"
      />
    </SvgIcon>
  );
}
export default StacksIcon;
