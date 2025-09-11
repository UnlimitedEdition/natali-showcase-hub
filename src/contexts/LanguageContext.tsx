import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'sr' | 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation files
const translations = {
  sr: {
    // Navigation
    'nav.home': 'Početna',
    'nav.podcast': 'Podcast',
    'nav.kitchen': 'Kuhinja',
    'nav.stories': 'Priče',
    'nav.contact': 'Kontakt',
    'nav.admin': 'Admin',
    'nav.login': 'Prijava',
    'nav.logout': 'Odjava',
    
    // Common
    'common.loading': 'Učitava...',
    'common.save': 'Sačuvaj',
    'common.cancel': 'Otkaži',
    'common.delete': 'Obriši',
    'common.edit': 'Uredi',
    'common.upload': 'Otpremi',
    'common.close': 'Zatvori',
    'common.yes': 'Da',
    'common.no': 'Ne',
    
    // Home
    'home.hero.title': 'Dobrodošli na Natali Show',
    'home.hero.subtitle': 'Prefinjen podcast o životu, kuvanju i pričama koje inspirišu',
    'home.newsletter.title': 'Pretplatite se na naš newsletter',
    'home.newsletter.placeholder': 'Unesite vašu email adresu',
    'home.newsletter.button': 'Pretplati se',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.content': 'Upravljanje sadržajem',
    'admin.episodes': 'Epizode',
    'admin.users': 'Korisnici',
    'admin.settings': 'Podešavanja',
    'admin.upload.title': 'Otpremi medijum',
    'admin.upload.image': 'Slika',
    'admin.upload.video': 'Video URL',
    'admin.upload.youtube': 'YouTube URL',
    
    // GDPR
    'gdpr.title': 'Kolačići i privatnost',
    'gdpr.message': 'Koristimo kolačiće da poboljšamo vaše iskustvo na našem sajtu.',
    'gdpr.accept': 'Prihvati sve',
    'gdpr.settings': 'Podešavanja',
    'gdpr.necessary': 'Neophodni kolačići',
    'gdpr.analytics': 'Analitički kolačići',
    'gdpr.marketing': 'Marketing kolačići',
    
    // Privacy Policy
    'privacy.title': 'Politika privatnosti',
    'privacy.lastUpdated': 'Poslednje ažuriranje',
    'terms.title': 'Uslovi korišćenja',
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.podcast': 'Podcast',
    'nav.kitchen': 'Küche',
    'nav.stories': 'Geschichten',
    'nav.contact': 'Kontakt',
    'nav.admin': 'Admin',
    'nav.login': 'Anmelden',
    'nav.logout': 'Abmelden',
    
    // Common
    'common.loading': 'Wird geladen...',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.upload': 'Hochladen',
    'common.close': 'Schließen',
    'common.yes': 'Ja',
    'common.no': 'Nein',
    
    // Home
    'home.hero.title': 'Willkommen bei der Natali Show',
    'home.hero.subtitle': 'Ein eleganter Podcast über Leben, Kochen und inspirierende Geschichten',
    'home.newsletter.title': 'Abonnieren Sie unseren Newsletter',
    'home.newsletter.placeholder': 'Geben Sie Ihre E-Mail-Adresse ein',
    'home.newsletter.button': 'Abonnieren',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.content': 'Inhaltsverwaltung',
    'admin.episodes': 'Episoden',
    'admin.users': 'Benutzer',
    'admin.settings': 'Einstellungen',
    'admin.upload.title': 'Medien hochladen',
    'admin.upload.image': 'Bild',
    'admin.upload.video': 'Video URL',
    'admin.upload.youtube': 'YouTube URL',
    
    // GDPR
    'gdpr.title': 'Cookies und Datenschutz',
    'gdpr.message': 'Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern.',
    'gdpr.accept': 'Alle akzeptieren',
    'gdpr.settings': 'Einstellungen',
    'gdpr.necessary': 'Notwendige Cookies',
    'gdpr.analytics': 'Analytische Cookies',
    'gdpr.marketing': 'Marketing-Cookies',
    
    // Privacy Policy
    'privacy.title': 'Datenschutzrichtlinie',
    'privacy.lastUpdated': 'Zuletzt aktualisiert',
    'terms.title': 'Nutzungsbedingungen',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.podcast': 'Podcast',
    'nav.kitchen': 'Kitchen',
    'nav.stories': 'Stories',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.upload': 'Upload',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Home
    'home.hero.title': 'Welcome to Natali Show',
    'home.hero.subtitle': 'An elegant podcast about life, cooking and inspiring stories',
    'home.newsletter.title': 'Subscribe to our newsletter',
    'home.newsletter.placeholder': 'Enter your email address',
    'home.newsletter.button': 'Subscribe',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.content': 'Content Management',
    'admin.episodes': 'Episodes',
    'admin.users': 'Users',
    'admin.settings': 'Settings',
    'admin.upload.title': 'Upload Media',
    'admin.upload.image': 'Image',
    'admin.upload.video': 'Video URL',
    'admin.upload.youtube': 'YouTube URL',
    
    // GDPR
    'gdpr.title': 'Cookies and Privacy',
    'gdpr.message': 'We use cookies to enhance your experience on our website.',
    'gdpr.accept': 'Accept All',
    'gdpr.settings': 'Settings',
    'gdpr.necessary': 'Necessary Cookies',
    'gdpr.analytics': 'Analytics Cookies',
    'gdpr.marketing': 'Marketing Cookies',
    
    // Privacy Policy
    'privacy.title': 'Privacy Policy',
    'privacy.lastUpdated': 'Last updated',
    'terms.title': 'Terms of Service',
  }
};

// Function to detect language based on location/browser
const detectLanguage = (): Language => {
  // Check localStorage first
  const saved = localStorage.getItem('natali-show-language') as Language;
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
  const [language, setLanguage] = useState<Language>(detectLanguage);

  useEffect(() => {
    localStorage.setItem('natali-show-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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