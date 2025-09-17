import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://db.flwkfhgnzcjlnrjaagxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiLmZsd2tmaGducnpjamxucmphYWd4eiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzI2MTY1MDY2LCJleHAiOjE3NTc3MDEwNjZ9.vDa5fUNiA0qDxW40w7tZzyJ8QR0nWuxrJfbH0ySoT0k';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContent() {
  try {
    // Fetch all content
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('page_key', { ascending: true })
      .order('section_key', { ascending: true })
      .order('language_code', { ascending: true });

    if (error) {
      console.error('Error fetching content:', error);
      return;
    }

    console.log(`Total content items: ${data.length}`);
    console.log('\nContent by page and section:');
    
    // Group by page and section
    const grouped = {};
    data.forEach(item => {
      const key = `${item.page_key}-${item.section_key}`;
      if (!grouped[key]) {
        grouped[key] = {
          page_key: item.page_key,
          section_key: item.section_key,
          languages: {}
        };
      }
      grouped[key].languages[item.language_code] = item.content_text;
    });

    // Display grouped content
    Object.values(grouped).forEach(item => {
      console.log(`\nPage: ${item.page_key}, Section: ${item.section_key}`);
      console.log(`  SR: ${item.languages.sr || 'MISSING'}`);
      console.log(`  DE: ${item.languages.de || 'MISSING'}`);
      console.log(`  EN: ${item.languages.en || 'MISSING'}`);
    });

    // Check for missing combinations
    console.log('\n\nChecking for missing content combinations...');
    const pages = ['home', 'podcast', 'kitchen', 'stories', 'contact'];
    const sections = ['hero_title', 'hero_subtitle'];
    const languages = ['sr', 'de', 'en'];
    
    let missingCount = 0;
    pages.forEach(page => {
      sections.forEach(section => {
        languages.forEach(lang => {
          const exists = data.find(item => 
            item.page_key === page && 
            item.section_key === section && 
            item.language_code === lang
          );
          
          if (!exists) {
            console.log(`MISSING: ${page} - ${section} - ${lang}`);
            missingCount++;
          }
        });
      });
    });
    
    console.log(`\nTotal missing combinations: ${missingCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkContent();