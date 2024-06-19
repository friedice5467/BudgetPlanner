import { useTheme } from "react-native-paper";

export const useThemeBasedConstants = () => {
  const theme = useTheme();

  const colorMap: Record<string, string> = {
    need: theme.colors.error,
    want: theme.colors.tertiary,
    save: theme.colors.primary,
  };

  const budgetMap: Record<string, string> = {
    need: 'Needs',
    want: 'Wants',
    save: 'Savings',
  };

  return { colorMap, budgetMap };
};
