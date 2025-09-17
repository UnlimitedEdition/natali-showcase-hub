#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase client initialization with hardcoded credentials
const supabaseUrl = "https://flwkfhgnzcjlnrjaagxz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2tmaGduemNqbG5yamFhZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTg3OTAsImV4cCI6MjA3MzE5NDc5MH0.bm8gqQgSsXgA_GIfvqJC1CouIvNRNn0tkEZHwLO50Lg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check current translations
const checkTranslations = async () => {
  try {
    // Get count of translations by language
    const { data: translationCounts, error } = await supabase
      .from('translations')
      .select('language_code')
      .then(() => {
        return supabase
          .from('translations')
          .select('language_code');
      });

    if (error) {
      console.error('Error fetching translations:', error.message);
      return;
    }

    // Count translations by language
    const counts = {
      sr: 0,
      de: 0,
      en: 0
    };

    translationCounts.forEach(item => {
      if (counts[item.language_code] !== undefined) {
        counts[item.language_code]++;
      }
    });

    console.log('Current translation counts:');
    console.log('- Serbian (sr):', counts.sr);
    console.log('- German (de):', counts.de);
    console.log('- English (en):', counts.en);
    console.log('- Total:', translationCounts.length);
    
    // Show some sample translations
    console.log('\nSample translations:');
    const { data: sampleTranslations, error: sampleError } = await supabase
      .from('translations')
      .select('*')
      .limit(10);

    if (sampleError) {
      console.error('Error fetching sample translations:', sampleError.message);
    } else {
      sampleTranslations.forEach(translation => {
        console.log(`- ${translation.language_code}: ${translation.key} = ${translation.value.substring(0, 30)}${translation.value.length > 30 ? '...' : ''}`);
      });
    }
  } catch (error) {
    console.error('Error checking translations:', error.message);
  }
};

console.log('Checking current translations in the database...\n');
checkTranslations();