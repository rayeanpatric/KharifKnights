import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { enTranslations } from '@/localization/en';
import { taTranslations } from '@/localization/ta';

// DEBUG: Log the imported objects immediately
console.log('Imported enTranslations:', enTranslations);
console.log('Imported taTranslations:', taTranslations);

// Define a recursive type for nested translation objects
type Translations = {
  [key: string]: string | Translations;
};

type LanguageContextType = {
  currentLanguage: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;
  t: (key: string, variables?: Record<string, string | number>) => string; // Allow optional variables
};

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: (key: string) => key, // Return key by default if no provider
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ta'>(() => {
    // Check if there's a saved language preference on initial mount
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'ta') ? savedLanguage : 'en';
  });

  const setLanguage = (lang: 'en' | 'ta') => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    // Set lang attribute on HTML element
    document.documentElement.setAttribute('lang', lang);
    // Dispatch an event that components can listen for (optional, context should handle re-renders)
    window.dispatchEvent(new Event('language-changed'));
  };

  // Helper function to get nested keys, e.g., "features.moisture"
  const getNestedTranslation = (obj: Translations, path: string): string => {
    const keys = path.split('.');
    let current: string | Translations = obj; // Use a separate variable for traversal

    for (const key of keys) {
      if (typeof current === 'object' && current !== null && current[key] !== undefined) {
        current = current[key]; // Move deeper into the object
      } else {
        console.warn(`Translation missing or invalid path for key: ${path}`);
        return path; // Return the key path if translation not found or path is invalid
      }
    }

    // After the loop, check if the final value is a string
    if (typeof current === 'string') {
      return current;
    } else {
      // The path led to an object, not a string translation
      console.warn(`Translation path did not resolve to a string for key: ${path}`);
      return path;
    }
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const translations: Translations = currentLanguage === 'en' ? enTranslations : taTranslations;
    // DEBUG: Log the selected language and the translations object being used
    // console.log(`Current Language: ${currentLanguage}`);
    // console.log(`Looking for key: ${key}`);
    // console.log('Using translations object:', translations);
    let translation = getNestedTranslation(translations, key);

    // Perform variable interpolation if variables are provided
    if (variables) {
      Object.keys(variables).forEach((varKey) => {
        const regex = new RegExp(`\\{${varKey}\\}`, 'g');
        translation = translation.replace(regex, String(variables[varKey]));
      });
    }

    return translation;
  };

  // Initialize language attribute on document on mount and when language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);

  // Optional: Listen for language change events if needed for specific side effects
  // useEffect(() => {
  //   const handleLanguageChange = () => {
  //     console.log("Language changed event detected:", currentLanguage);
  //   };
  //   window.addEventListener('language-changed', handleLanguageChange);
  //   return () => {
  //     window.removeEventListener('language-changed', handleLanguageChange);
  //   };
  // }, [currentLanguage]); // Re-run if currentLanguage changes

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
