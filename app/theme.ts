import {
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

// Base colors
const primaryColor = '#4CAF50';  // A crisp green, good for actions
const secondaryColor = '#304FFE';  // A deep indigo, great for highlighting
const tertiaryColor = '#FFC107';  // A bright amber for accents
const errorColor = '#F44336';  // A bright red, suitable for errors

// Light Theme Colors
const lightBackgroundColor = '#FFFFFF';  // Pure white for a clean look
const lightSurfaceColor = '#F4F7FA';

// Dark Theme Colors
const darkBackgroundColor = '#121212';  // Very dark grey, almost black for deep dark mode
const darkSurfaceColor = '#242424';  // A slightly lighter grey than background for depth

// Dark Theme
export const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: primaryColor,
    accent: secondaryColor, // Renamed to match convention
    background: darkBackgroundColor,
    surface: darkSurfaceColor,
    error: errorColor,
    text: '#FFFFFF', // Ensuring text is always readable
    onBackground: '#E0E0E0', // Slightly off-white for less harsh contrast
    onSurface: '#E0E0E0', // Similar to onBackground for consistency
    notification: tertiaryColor, // For notifications, using tertiary color
  },
};

// Default (Light) Theme
export const defaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: primaryColor,
    accent: secondaryColor,
    background: lightBackgroundColor,
    surface: lightSurfaceColor,
    error: errorColor,
    text: '#333333', // Dark grey for soft contrast
    onBackground: '#666666', // Medium grey for icons and secondary text
    onSurface: '#666666',
    notification: tertiaryColor,
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
