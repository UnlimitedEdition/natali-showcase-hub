import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://flwkfhgnzcjlnrjaagxz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2tmaGduemNqbG5yamFhZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTg3OTAsImV4cCI6MjA3MzE5NDc5MH0.bm8gqQgSsXgA_GIfvqJC1CouIvNRNn0tkEZHwLO50Lg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// Function to migrate translations with service role
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
  
  // For migration, we need to use service role - let's do it manually for now
  console.log('Manual migration required - please run the following SQL in your Supabase SQL editor:');
  console.log('\n-- First, clear existing translations');
  console.log('DELETE FROM translations;');
  
  console.log('\n-- Then insert new translations (example for a few keys):');
  translations.slice(0, 5).forEach(t => {
    console.log(`INSERT INTO translations (key, language_code, value) VALUES ('${t.key}', '${t.language_code}', '${t.value.replace(/'/g, "''")}');`);
  });
  
  console.log('\n-- Note: You need to run this with a service role key or in the Supabase SQL editor');
  console.log(`-- Total translations to insert: ${translations.length}`);
  
  // Also create a full SQL file
  const sqlFilePath = path.join(__dirname, 'translations_migration.sql');
  let sqlContent = '-- Translation migration SQL\n\n';
  sqlContent += 'DELETE FROM translations;\n\n';
  
  // Use parameterized queries format for better SQL injection protection
  translations.forEach(t => {
    // Escape single quotes by doubling them
    const escapedValue = t.value.replace(/'/g, "''");
    sqlContent += `INSERT INTO translations (key, language_code, value) VALUES ('${t.key}', '${t.language_code}', '${escapedValue}');\n`;
  });
  
  try {
    fs.writeFileSync(sqlFilePath, sqlContent);
    console.log(`\nFull SQL migration file created at: ${sqlFilePath}`);
    
    // Add file stats to the log
    const stats = fs.statSync(sqlFilePath);
    console.log(`File size: ${stats.size} bytes`);
  } catch (err) {
    console.error('Error writing SQL migration file:', err);
  }
}

migrateTranslations().then(() => {
  console.log('\nPlease follow the instructions above to complete the migration manually in your Supabase SQL editor.');
}).catch(err => {
  console.error('Error during translation migration:', err);
});