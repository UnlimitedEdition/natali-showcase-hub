const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://flwkfhgnzcjlnrjaagxz.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Function to flatten nested objects
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
    } else {
      flattened[prefix + key] = obj[key];
    }
  }
  
  return flattened;
}

// Function to migrate translations
async function migrateTranslations() {
  console.log('Starting translation migration...');
  
  // Load translation files
  const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en.json'), 'utf8'));
  const deTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/de.json'), 'utf8'));
  const srTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/sr.json'), 'utf8'));
  
  // Flatten all translation objects
  const enFlat = flattenObject(enTranslations);
  const deFlat = flattenObject(deTranslations);
  const srFlat = flattenObject(srTranslations);
  
  // Prepare data for insertion
  const translations = [];
  
  // Add English translations
  for (const key in enFlat) {
    translations.push({
      key,
      language_code: 'en',
      value: enFlat[key]
    });
  }
  
  // Add German translations
  for (const key in deFlat) {
    translations.push({
      key,
      language_code: 'de',
      value: deFlat[key]
    });
  }
  
  // Add Serbian translations
  for (const key in srFlat) {
    translations.push({
      key,
      language_code: 'sr',
      value: srFlat[key]
    });
  }
  
  console.log(`Prepared ${translations.length} translations for migration`);
  
  // Insert translations into database
  try {
    // Clear existing translations
    const { error: deleteError } = await supabase
      .from('translations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError) {
      console.error('Error clearing existing translations:', deleteError);
      return;
    }
    
    // Insert new translations
    const { data, error } = await supabase
      .from('translations')
      .insert(translations);
    
    if (error) {
      console.error('Error inserting translations:', error);
      return;
    }
    
    console.log(`Successfully migrated ${translations.length} translations to database`);
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateTranslations().then(() => {
  console.log('Translation migration completed');
}).catch(err => {
  console.error('Error during translation migration:', err);
});