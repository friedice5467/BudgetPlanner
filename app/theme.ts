import {
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

// Common colors
const primaryColor = '#5fad56'; 
const secondaryColor = '#2D3047';  
const tertiaryColor = '#FFDDC1';  
const errorColor = '#FE4A49';  

// Light Theme Colors
const lightBackgroundColor = '#F7FFF7';  
const lightSurfaceColor = '#FFDDC1';  

// Dark Theme Colors
const darkBackgroundColor = '#1C1C1E';  
const darkSurfaceColor = '#38393A';  

// Dark Theme
export const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    background: darkBackgroundColor,
    surface: darkSurfaceColor,
    error: errorColor,
  },
};

// Default Theme
export const defaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    background: lightBackgroundColor,
    surface: lightSurfaceColor,
    error: errorColor,
  },
};



// export default {
//   ...DefaultTheme,
//   dark: false,
//   roundness: 3,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#009688',
//     accent: '#fff',
//     background: '#fff',
//   },
// };
