import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Create a dark theme instance.
const darkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
  },
});

// Create a light theme instance.
const lightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
  },
});

export { darkTheme, lightTheme };
