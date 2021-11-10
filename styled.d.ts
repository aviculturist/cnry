// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius?: string;
    contained?: string;
    backgroundColor?: string;
    colors: {
      main: string;
      secondary?: string;
      text?: string;
      error?: string;
    };
  }
}
