import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import pt from '@/utils/locales/pt.json';

const getLanguage = () => {
  const locales = getLocales();
  return locales[0]?.languageCode ?? 'pt';
};

const initializeI18Next = () => {
  i18n.use(initReactI18next).init({
    debug: false,
    lng: getLanguage(),
    fallbackLng: 'pt',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      pt: {
        translation: pt,
      }
    }
  });
};

export default initializeI18Next;
