import React, { createContext, useEffect, useState } from "react";
import i18next from "i18next";
import { StorageService } from "@/services/storageService";
import { useTranslation } from "react-i18next";

const USER_LANGUAGE = 'USER_LANGUAGE';

interface TranslationContextProps {
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
}

export const TranslationContext = createContext<TranslationContextProps>({
  currentLanguage: 'pt',
  changeLanguage: () => {},
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language ?? 'pt');

  const changeLanguage = async (lng: string) => {
    setCurrentLanguage(lng);
    i18next.changeLanguage(lng);
    await StorageService.setItem(USER_LANGUAGE, lng);
  };

  useEffect(() => {
    const getUserLanguage = async () => {
      const userLanguage = await StorageService.getItem(USER_LANGUAGE);
      if (userLanguage) {
        setCurrentLanguage(userLanguage);
        i18next.changeLanguage(userLanguage);
      }
    };
    getUserLanguage();
  }, []);

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useLocale = () => {
  const { currentLanguage, changeLanguage } = React.useContext(TranslationContext);
  const { t } = useTranslation();
  return {
    t,
    currentLanguage,
    changeLanguage
  };
};
