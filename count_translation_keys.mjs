#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

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

// Count keys in each language file
const en = flattenObject(JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf8')));
const sr = flattenObject(JSON.parse(fs.readFileSync('./src/locales/sr.json', 'utf8')));
const de = flattenObject(JSON.parse(fs.readFileSync('./src/locales/de.json', 'utf8')));

console.log('=== Translation Key Counts ===');
console.log('English keys:', Object.keys(en).length);
console.log('Serbian keys:', Object.keys(sr).length);
console.log('German keys:', Object.keys(de).length);

// Find all unique keys across all languages
const allKeys = new Set([
  ...Object.keys(en),
  ...Object.keys(sr),
  ...Object.keys(de)
]);

console.log('\n=== Key Analysis ===');
console.log('Total unique keys across all languages:', allKeys.size);

// Find missing keys in each language
const missingInEn = [...allKeys].filter(key => !(key in en));
const missingInSr = [...allKeys].filter(key => !(key in sr));
const missingInDe = [...allKeys].filter(key => !(key in de));

console.log('\nMissing in English:', missingInEn.length);
if (missingInEn.length > 0) {
  console.log('Examples:', missingInEn.slice(0, 10));
}

console.log('Missing in Serbian:', missingInSr.length);
if (missingInSr.length > 0) {
  console.log('Examples:', missingInSr.slice(0, 10));
}

console.log('Missing in German:', missingInDe.length);
if (missingInDe.length > 0) {
  console.log('Examples:', missingInDe.slice(0, 10));
}

// Show some sample keys from each language
console.log('\n=== Sample Keys ===');
console.log('English sample:', Object.keys(en).slice(0, 5));
console.log('Serbian sample:', Object.keys(sr).slice(0, 5));
console.log('German sample:', Object.keys(de).slice(0, 5));