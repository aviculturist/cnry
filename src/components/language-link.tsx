import * as React from 'react';
// can't use next/app router until i18n SSG is supported
//import Link from 'next/link';
import { Link as ReactRouterDomLink, LinkProps } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { darken } from '@mui/material/styles';
//import { DefaultTheme } from '@mui/system';

const StyledLink = styled(ReactRouterDomLink)(
  ({ theme }: { theme: any }) => `
  color: ${theme.palette.primary.main};
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
  :hover {
    color: ${darken(theme.palette.primary.main, 0.2)};
  }
`
);

const LanguageLink = (props: LinkProps) => {
  return <StyledLink {...props} />;
};
export default LanguageLink;

// const StyledLink = styled(Link)`
//   text-decoration: none;
//   color: ${props => props.theme.colors.main};
//   &:focus,
//   &:hover,
//   &:visited,
//   &:link,
//   &:active {
//     text-decoration: none;
//   }
// `;
// ${props => props.inputColor
// function StyledLink(props) {
//   const theme = useTheme();
//   const StyledLink = styled(Link)`
//     text-decoration: none;
//     color: ${theme.palette.primary.main};
//     &:focus,
//     &:hover,
//     &:visited,
//     &:link,
//     &:active {
//       text-decoration: none;
//     }
//   `;
//   return <StyledLink {...props} />;
// }
// export default StyledLink;
// const StyledLink = styled(Link)`
//     text-decoration: none;
//     color: {theme.primary};
//     &:focus, &:hover, &:visited, &:link, &:active {
//         text-decoration: none;
//     }
// `;
// export default (props) => <StyledLink {...props} />;
