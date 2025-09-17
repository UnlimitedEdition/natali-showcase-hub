#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Function to flatten nested objects
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

// Get all translation keys from files
const enFile = flattenObject(JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf8')));
const srFile = flattenObject(JSON.parse(fs.readFileSync('./src/locales/sr.json', 'utf8')));
const deFile = flattenObject(JSON.parse(fs.readFileSync('./src/locales/de.json', 'utf8')));

console.log('-- Complete missing translations for all languages\n');

// Generate SQL for English translations
console.log('-- English translations');
for (const [key, value] of Object.entries(enFile)) {
  // Escape single quotes
  const escapedValue = value.replace(/'/g, "''");
  console.log(`INSERT INTO translations (key, language_code, value) VALUES ('${key}', 'en', '${escapedValue}');`);
}
console.log('');

// Generate SQL for Serbian translations
console.log('-- Serbian translations');
for (const [key, value] of Object.entries(srFile)) {
  // Escape single quotes
  const escapedValue = value.replace(/'/g, "''");
  console.log(`INSERT INTO translations (key, language_code, value) VALUES ('${key}', 'sr', '${escapedValue}');`);
}
console.log('');

// Generate SQL for German translations
console.log('-- German translations');
for (const [key, value] of Object.entries(deFile)) {
  // Escape single quotes
  const escapedValue = value.replace(/'/g, "''");
  console.log(`INSERT INTO translations (key, language_code, value) VALUES ('${key}', 'de', '${escapedValue}');`);
}