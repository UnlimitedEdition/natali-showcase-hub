import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import srTranslations from '@/locales/sr';
import deTranslations from '@/locales/de';
import enTranslations from '@/locales/en';

export type Language = 'sr' | 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Record<string, string>;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation files for fallback
const localTranslations = {
  sr: srTranslations,
  de: deTranslations,
  en: enTranslations
};

// Function to flatten nested objects
const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
  const flattened: Record<string, string> = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
    } else {
      flattened[prefix + key] = obj[key];
    }
  }
  
  return flattened;
};

// Function to detect language based on location/browser
const detectLanguage = (): Language => {
  // Check localStorage first
  const saved = localStorage.getItem('Natalia-show-language') as Language;
  if (saved && ['sr', 'de', 'en'].includes(saved)) {
    return saved;
  }

  // Detect from browser/location (simplified - in production would use geolocation)
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('sr') || browserLang.startsWith('rs')) return 'sr';
  if (browserLang.startsWith('en')) return 'en';
  
  // Default to German since it's primarily for German market
  return 'de';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(detectLanguage());
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('Natalia-show-language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Load translations from database
  useEffect(() => {
    const loadTranslations = async () => {
      console.log('DEBUG: Loading translations for language:', language);
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('key, value')
          .eq('language_code', language);

        console.log('DEBUG: Supabase response - data length:', data ? data.length : 0, 'error:', error);

        if (error) throw error;

        const translationMap: Record<string, string> = {};
        data.forEach(item => {
          translationMap[item.key] = item.value;
        });

        console.log('DEBUG: Translation map created with', Object.keys(translationMap).length, 'entries');
        setTranslations(translationMap);
      } catch (error) {
        console.error('DEBUG: Error loading translations from database:', error);
        console.log('DEBUG: Falling back to local translations for', language);
        // Fallback to local translations
        const flattened = flattenObject(localTranslations[language]);
        console.log('DEBUG: Local fallback has', Object.keys(flattened).length, 'entries');
        setTranslations(flattened);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('translations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'translations',
          filter: `language_code=eq.${language}`
        },
        (payload) => {
          setTranslations(prev => ({
            ...prev,
            [payload.new.key]: payload.new.value
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'translations',
          filter: `language_code=eq.${language}`
        },
        (payload) => {
          setTranslations(prev => ({
            ...prev,
            [payload.new.key]: payload.new.value
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'translations',
          filter: `language_code=eq.${language}`
        },
        (payload) => {
          setTranslations(prev => {
            const newTranslations = { ...prev };
            delete newTranslations[payload.old.key];
            return newTranslations;
          });
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [language]);

  const t = (key: string): string => {
    const value = translations[key] || key;
    if (value === key) {
      console.log('DEBUG: Translation fallback to key:', key, 'for language:', language);
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};