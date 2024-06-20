import { useTheme } from "react-native-paper";

export const useThemeBasedConstants = () => {
  const theme = useTheme();

  const colorMap: Record<string, string> = {
    need: theme.colors.error,
    want: theme.colors.tertiary,
    save: theme.colors.primary,
  };

  const colorTextMap : Record<string, string> = {
    need: theme.colors.onErrorContainer,
    want: theme.colors.onTertiaryContainer,
    save: theme.colors.onPrimaryContainer,
  };

  const iconMap : Record<string, string> = {
    need: 'alert-circle',
    want: 'cart',
    save: 'piggy-bank',
  }

  const budgetMap: Record<string, string> = {
    need: 'Needs',
    want: 'Wants',
    save: 'Savings',
  };

  return { colorMap, colorTextMap, iconMap, budgetMap };
};
