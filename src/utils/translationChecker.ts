import { supabase } from '@/integrations/supabase/client';
import srTranslations from '@/locales/sr';
import deTranslations from '@/locales/de';
import enTranslations from '@/locales/en';

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

// Function to get all translation keys from files
const getFileTranslationKeys = (): Record<string, Record<string, string>> => {
  return {
    sr: flattenObject(srTranslations),
    de: flattenObject(deTranslations),
    en: flattenObject(enTranslations)
  };
};

// Function to get all translation keys from database
const getDatabaseTranslationKeys = async (): Promise<Record<string, Record<string, string>>> => {
  const { data, error } = await supabase
    .from('translations')
    .select('key, language_code, value');

  if (error) {
    console.error('Error fetching translations from database:', error);
    return { sr: {}, de: {}, en: {} };
  }

  const dbTranslations: Record<string, Record<string, string>> = {
    sr: {},
    de: {},
    en: {}
  };

  data?.forEach(item => {
    dbTranslations[item.language_code][item.key] = item.value;
  });

  return dbTranslations;
};

// Function to compare translation keys
export const compareTranslationKeys = async () => {
  const fileTranslations = getFileTranslationKeys();
  const dbTranslations = await getDatabaseTranslationKeys();

  console.log('=== TRANSLATION KEY COMPARISON ===\n');

  const languages = ['sr', 'de', 'en'];
  
  for (const lang of languages) {
    console.log(`--- ${lang.toUpperCase()} LANGUAGE ---`);
    
    const fileKeys = Object.keys(fileTranslations[lang]);
    const dbKeys = Object.keys(dbTranslations[lang]);
    
    console.log(`File keys: ${fileKeys.length}`);
    console.log(`Database keys: ${dbKeys.length}`);
    
    // Find keys in files but not in database
    const missingInDb = fileKeys.filter(key => !dbKeys.includes(key));
    console.log(`Missing in database: ${missingInDb.length}`);
    if (missingInDb.length > 0) {
      console.log('Keys missing in database:');
      missingInDb.forEach(key => console.log(`  - ${key}`));
    }
    
    // Find keys in database but not in files
    const missingInFiles = dbKeys.filter(key => !fileKeys.includes(key));
    console.log(`Extra in database: ${missingInFiles.length}`);
    if (missingInFiles.length > 0) {
      console.log('Keys extra in database:');
      missingInFiles.forEach(key => console.log(`  - ${key}`));
    }
    
    console.log('');
  }

  // Check for keys that exist in one language file but not others
  console.log('--- CROSS-LANGUAGE CONSISTENCY ---');
  const allFileKeys = new Set<string>();
  Object.values(fileTranslations).forEach(langTranslations => {
    Object.keys(langTranslations).forEach(key => allFileKeys.add(key));
  });
  
  languages.forEach(lang => {
    const missingKeys = Array.from(allFileKeys).filter(key => !fileTranslations[lang][key]);
    if (missingKeys.length > 0) {
      console.log(`${lang.toUpperCase()} is missing keys:`);
      missingKeys.forEach(key => console.log(`  - ${key}`));
    }
  });
  
  return { fileTranslations, dbTranslations };
};

// Function to generate SQL for missing translations
export const generateMissingTranslationSQL = async () => {
  const fileTranslations = getFileTranslationKeys();
  const dbTranslations = await getDatabaseTranslationKeys();

  console.log('=== SQL FOR MISSING TRANSLATIONS ===\n');
  
  const languages = ['sr', 'de', 'en'];
  
  for (const lang of languages) {
    const fileKeys = Object.keys(fileTranslations[lang]);
    const dbKeys = Object.keys(dbTranslations[lang]);
    const missingInDb = fileKeys.filter(key => !dbKeys.includes(key));
    
    if (missingInDb.length > 0) {
      console.log(`-- Missing ${lang} translations`);
      missingInDb.forEach(key => {
        const value = fileTranslations[lang][key].replace(/'/g, "''"); // Escape single quotes
        console.log(`INSERT INTO translations (key, language_code, value) VALUES ('${key}', '${lang}', '${value}');`);
      });
      console.log('');
    }
  }
};

// Function to find all missing translations and generate complete SQL
export const generateCompleteTranslationSQL = async () => {
  const fileTranslations = getFileTranslationKeys();
  const dbTranslations = await getDatabaseTranslationKeys();

  console.log('=== COMPLETE TRANSLATION SQL ===\n');
  
  const languages = ['sr', 'de', 'en'];
  
  for (const lang of languages) {
    console.log(`-- ${lang.toUpperCase()} TRANSLATIONS`);
    console.log(`DELETE FROM translations WHERE language_code = '${lang}';\n`);
    
    const fileKeys = Object.keys(fileTranslations[lang]);
    fileKeys.forEach(key => {
      const value = fileTranslations[lang][key].replace(/'/g, "''"); // Escape single quotes
      console.log(`INSERT INTO translations (key, language_code, value) VALUES ('${key}', '${lang}', '${value}');`);
    });
    console.log('');
  }
};