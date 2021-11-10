import { DefaultTheme } from 'styled-components';

const scTheme: DefaultTheme = {
  borderRadius: '5px',
  colors: {
    main: 'cyan',
    secondary: 'magenta',
  },
};

export const lightTheme: DefaultTheme = {
  backgroundColor: '#FFFFFF',
  contained: 'green',
  colors: {
    main: '#512DA8',
    text: '#121212',
    error: '#D32F2F',
  },
};

export const darkTheme: DefaultTheme = {
  backgroundColor: '#121212',
  colors: {
    main: '#B39DDB',
    text: '#FFFFFF',
    error: '#EF9A9A',
  },
};

export { scTheme };
