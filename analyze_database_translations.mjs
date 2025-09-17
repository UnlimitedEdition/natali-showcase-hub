#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase client initialization with hardcoded credentials
const supabaseUrl = "https://flwkfhgnzcjlnrjaagxz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2tmaGduemNqbG5yamFhZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTg3OTAsImV4cCI6MjA3MzE5NDc5MH0.bm8gqQgSsXgA_GIfvqJC1CouIvNRNn0tkEZHwLO50Lg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

console.log('=== File-based Translation Keys ===');
console.log('English file keys:', Object.keys(enFile).length);
console.log('Serbian file keys:', Object.keys(srFile).length);
console.log('German file keys:', Object.keys(deFile).length);

// Analyze database translations
const analyzeDatabase = async () => {
  try {
    // Get all translations from database
    const { data, error } = await supabase
      .from('translations')
      .select('key, language_code, value');

    if (error) {
      console.error('Error fetching translations:', error.message);
      return;
    }

    console.log('\n=== Database Translation Analysis ===');
    console.log('Total database translations:', data.length);

    // Group by language
    const translationsByLanguage = {
      en: [],
      sr: [],
      de: []
    };

    data.forEach(item => {
      if (translationsByLanguage[item.language_code]) {
        translationsByLanguage[item.language_code].push(item);
      }
    });

    console.log('English in database:', translationsByLanguage.en.length);
    console.log('Serbian in database:', translationsByLanguage.sr.length);
    console.log('German in database:', translationsByLanguage.de.length);

    // Show some sample database entries
    console.log('\n=== Sample Database Entries ===');
    console.log('English samples:');
    translationsByLanguage.en.slice(0, 3).forEach(item => {
      console.log(`  ${item.key}: ${item.value.substring(0, 50)}${item.value.length > 50 ? '...' : ''}`);
    });

    console.log('Serbian samples:');
    translationsByLanguage.sr.slice(0, 3).forEach(item => {
      console.log(`  ${item.key}: ${item.value.substring(0, 50)}${item.value.length > 50 ? '...' : ''}`);
    });

    console.log('German samples:');
    translationsByLanguage.de.slice(0, 3).forEach(item => {
      console.log(`  ${item.key}: ${item.value.substring(0, 50)}${item.value.length > 50 ? '...' : ''}`);
    });

    // Find keys in database but not in files
    const dbKeysEn = new Set(translationsByLanguage.en.map(item => item.key));
    const dbKeysSr = new Set(translationsByLanguage.sr.map(item => item.key));
    const dbKeysDe = new Set(translationsByLanguage.de.map(item => item.key));
    
    const fileKeys = new Set([
      ...Object.keys(enFile),
      ...Object.keys(srFile),
      ...Object.keys(deFile)
    ]);

    const extraInDbEn = [...dbKeysEn].filter(key => !fileKeys.has(key));
    const extraInDbSr = [...dbKeysSr].filter(key => !fileKeys.has(key));
    const extraInDbDe = [...dbKeysDe].filter(key => !fileKeys.has(key));

    console.log('\n=== Extra Keys in Database (Not in Files) ===');
    console.log('Extra English keys:', extraInDbEn.length);
    console.log('Extra Serbian keys:', extraInDbSr.length);
    console.log('Extra German keys:', extraInDbDe.length);

    // Find keys in files but not in database
    const missingInDbEn = [...Object.keys(enFile)].filter(key => !dbKeysEn.has(key));
    const missingInDbSr = [...Object.keys(srFile)].filter(key => !dbKeysSr.has(key));
    const missingInDbDe = [...Object.keys(deFile)].filter(key => !dbKeysDe.has(key));

    console.log('\n=== Missing Keys in Database (In Files) ===');
    console.log('Missing English keys:', missingInDbEn.length);
    console.log('Missing Serbian keys:', missingInDbSr.length);
    console.log('Missing German keys:', missingInDbDe.length);

    if (missingInDbEn.length > 0) {
      console.log('\nMissing English keys (examples):');
      missingInDbEn.slice(0, 10).forEach(key => console.log(`  - ${key}`));
    }

    if (missingInDbSr.length > 0) {
      console.log('\nMissing Serbian keys (examples):');
      missingInDbSr.slice(0, 10).forEach(key => console.log(`  - ${key}`));
    }

    if (missingInDbDe.length > 0) {
      console.log('\nMissing German keys (examples):');
      missingInDbDe.slice(0, 10).forEach(key => console.log(`  - ${key}`));
    }

  } catch (error) {
    console.error('Error analyzing database:', error.message);
  }
};

analyzeDatabase();