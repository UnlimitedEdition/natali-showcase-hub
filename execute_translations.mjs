#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase client initialization with hardcoded credentials
const supabaseUrl = "https://flwkfhgnzcjlnrjaagxz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2tmaGduemNqbG5yamFhZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTg3OTAsImV4cCI6MjA3MzE5NDc5MH0.bm8gqQgSsXgA_GIfvqJC1CouIvNRNn0tkEZHwLO50Lg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read the SQL file
const sqlContent = fs.readFileSync('./add_missing_translations.sql', 'utf8');

// Extract all INSERT statements
const insertStatements = sqlContent
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.startsWith("('"));

console.log(`Found ${insertStatements.length} translation entries to add`);

// Parse the INSERT statements
const translations = [];
insertStatements.forEach(statement => {
  // Remove the trailing comma if it exists
  const cleanStatement = statement.endsWith(',') ? statement.slice(0, -1) : statement;
  
  // Extract values from the statement
  const valuesMatch = cleanStatement.match(/^\('([^']*)',\s*'([^']*)',\s*'([^']*)'\)$/);
  if (valuesMatch) {
    const [, key, language_code, value] = valuesMatch;
    translations.push({
      key,
      language_code,
      value
    });
  }
});

console.log(`Parsed ${translations.length} translations`);

// Batch insert translations
const batchInsert = async () => {
  try {
    console.log('Inserting translations into the database...');
    
    // Insert in batches of 50 to avoid timeouts
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < translations.length; i += batchSize) {
      const batch = translations.slice(i, i + batchSize);
      
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(translations.length/batchSize)} (${batch.length} entries)`);
      
      const { error } = await supabase
        .from('translations')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error.message);
      } else {
        successCount += batch.length;
        console.log(`Successfully inserted batch ${Math.floor(i/batchSize) + 1}`);
      }
    }
    
    console.log(`\nTranslation insertion completed:`);
    console.log(`- Successfully inserted: ${successCount}`);
    console.log(`- Total translations: ${translations.length}`);
    
  } catch (error) {
    console.error('Error during batch insertion:', error.message);
  }
};

console.log('Adding missing translations to the database...\n');
batchInsert();