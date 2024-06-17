import {I18n} from 'i18n-js';
import {useState} from 'react';
import {useColorScheme} from 'react-native';
import {translations} from '../translations';
import {darkTheme, defaultTheme} from '../theme';
import {MD3Theme as PaperTheme} from 'react-native-paper/lib/typescript/types';
import {Theme as NavigationTheme} from '@react-navigation/native';

const i18n = new I18n(translations);

export type LanguageLocale = {
  languageTag: string;
  isRTL: boolean;
};

export const fallbackLanguageLocale: LanguageLocale = {
  languageTag: 'en',
  isRTL: false,
};

export type AppSettings = {
  languageLocale: LanguageLocale | null;
  t: (key: string, config?: any) => string;
  colorScheme: string;
  currentTheme: PaperTheme & NavigationTheme;
};

export const useAppSettings = (): AppSettings => {
  const [languageLocale, setLanguageLocale] = useState<LanguageLocale | null>(
    null,
  );
  const [listening, setListening] = useState(false);
  const colorScheme = useColorScheme();

  return {
    languageLocale,
    t: (key: string, config?: any) => i18n.t(key, config),
    colorScheme: colorScheme ?? 'light',
    currentTheme: colorScheme === 'light' ? defaultTheme : darkTheme,
  };
};
