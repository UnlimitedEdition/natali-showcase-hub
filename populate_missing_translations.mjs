#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase config (iz projekta)
const supabaseUrl = 'https://flwkfhgnzcjlnrjaagxz.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2tmaGduemNqbG5yamFhZ3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzYxODc5MCwiZXhwIjoyMDczMTk0NzkwfQ.oXsQQ5oSFWMwL7AokzgFkdTYe-9hKN7HSc7-JYagKXU';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Flatten nested objects
const flattenObject = (obj, prefix = '') => {
  const flattened = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      flattened[prefix ? `${prefix}.${key}` : key] = obj[key];
    }
  }
  return flattened;
};

// Get local translations
const getLocalTranslations = () => {
  const sr = flattenObject(JSON.parse(fs.readFileSync('./src/locales/sr.json', 'utf8')));
  const de = flattenObject(JSON.parse(fs.readFileSync('./src/locales/de.json', 'utf8')));
  const en = flattenObject(JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf8')));
  return { sr, de, en };
};

// Get existing DB keys per language
const getExistingDBKeys = async () => {
  const { data, error } = await supabase.from('translations').select('key, language_code');
  if (error) {
    console.error('Error fetching existing translations:', error);
    return { sr: new Set(), de: new Set(), en: new Set() };
  }
  const existing = { sr: new Set(), de: new Set(), en: new Set() };
  data.forEach(item => {
    if (existing[item.language_code]) {
      existing[item.language_code].add(item.key);
    }
  });
  return existing;
};

// Upsert translations for a language
const upsertForLanguage = async (language, localTranslations, existingKeys) => {
  const toUpsert = [];
  for (const [key, value] of Object.entries(localTranslations)) {
    if (!existingKeys.has(key)) {
      toUpsert.push({ key, language_code: language, value });
    }
  }
  if (toUpsert.length === 0) {
    console.log(`No missing translations for ${language}`);
    return 0;
  }
  console.log(`Upserting ${toUpsert.length} missing translations for ${language}`);
  const { data, error } = await supabase.from('translations').upsert(toUpsert, { onConflict: 'key,language_code' });
  if (error) {
    console.error(`Error upserting for ${language}:`, error);
    return 0;
  }
  if (!data) {
    console.error(`No data returned for ${language}`);
    return 0;
  }
  console.log(`Successfully upserted ${data.length} for ${language}`);
  return data.length;
};

// Main
async function main() {
  console.log('Starting to populate missing translations...');
  const local = getLocalTranslations();
  const existing = await getExistingDBKeys();
  let total = 0;
  total += await upsertForLanguage('sr', local.sr, existing.sr);
  total += await upsertForLanguage('de', local.de, existing.de);
  total += await upsertForLanguage('en', local.en, existing.en);
  console.log(`\nCompleted! Added/updated ${total} missing translations across all languages.`);
  console.log('Restart your app and test the translations.');
}

main().catch(console.error);