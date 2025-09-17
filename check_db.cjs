const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://flwkfhgnzcjlnrjaagxz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2tmaGduemNqbG5yamFhZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTg3OTAsImV4cCI6MjA3MzE5NDc5MH0.bm8gqQgSsXgA_GIfvqJC1CouIvNRNn0tkEZHwLO50Lg";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkDatabase() {
  console.log('=== DATABASE CONTENT CHECK ===');
  
  // Check content table
  const { data: content, error: contentError } = await supabase
    .from('content')
    .select('*');
    
  if (contentError) {
    console.error('Error fetching content:', contentError);
  } else {
    console.log(`Content table has ${content.length} records:`);
    content.forEach(item => {
      console.log(`- Page: ${item.page_key}, Section: ${item.section_key}, Language: ${item.language_code}, Published: ${item.is_published}`);
      if (item.content_text) console.log(`  Text: ${item.content_text.substring(0, 50)}...`);
      if (item.media_url) console.log(`  Media: ${item.media_type} - ${item.media_url}`);
    });
  }
  
  // Check episodes table
  const { data: episodes, error: episodesError } = await supabase
    .from('episodes')
    .select('*');
    
  if (episodesError) {
    console.error('Error fetching episodes:', episodesError);
  } else {
    console.log(`\nEpisodes table has ${episodes.length} records:`);
    episodes.forEach(item => {
      console.log(`- Title: ${item.title}, Language: ${item.language_code}, Published: ${item.is_published}`);
    });
  }
  
  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');
    
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
  } else {
    console.log(`\nProfiles table has ${profiles.length} records:`);
    profiles.forEach(profile => {
      console.log(`- Email: ${profile.email}, Role: ${profile.role}, User ID: ${profile.user_id}`);
    });
  }
  
  // Check translations table if it exists
  try {
    const { data: translations, error: translationsError } = await supabase
      .from('translations')
      .select('*');
    
    if (translationsError) {
      console.log('\nTranslations table does not exist or is not accessible');
    } else {
      console.log(`\nTranslations table has ${translations.length} records:`);
      translations.slice(0, 10).forEach(translation => {
        console.log(`- Key: ${translation.key}, Language: ${translation.language_code}, Value: ${translation.value.substring(0, 50)}...`);
      });
      if (translations.length > 10) {
        console.log(`... and ${translations.length - 10} more records`);
      }
    }
  } catch (err) {
    console.log('\nTranslations table does not exist or is not accessible');
  }
  
  // Check RLS policies
  console.log('\n=== CHECKING RLS POLICIES ===');
  const tables = ['content', 'episodes', 'profiles', 'translations'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .rpc('get_policies_info', { table_name: table });
        
      if (error) {
        console.log(`Could not get policies for ${table}:`, error.message);
      } else {
        console.log(`${table} policies:`, data);
      }
    } catch (err) {
      console.log(`Error checking policies for ${table}:`, err.message);
    }
  }
}

async function checkTranslationsTable() {
  console.log('=== TRANSLATIONS TABLE CHECK ===');
  
  try {
    const { data: translations, error: translationsError } = await supabase
      .from('translations')
      .select('*');
    
    if (translationsError) {
      console.log('Translations table does not exist or is not accessible');
      return;
    }
    
    console.log(`Translations table has ${translations.length} records:`);
    
    // Group by language
    const byLanguage = {};
    translations.forEach(t => {
      if (!byLanguage[t.language_code]) {
        byLanguage[t.language_code] = [];
      }
      byLanguage[t.language_code].push(t);
    });
    
    Object.keys(byLanguage).forEach(lang => {
      console.log(`- ${lang}: ${byLanguage[lang].length} records`);
    });
    
    // Show sample records
    console.log('\nSample records:');
    translations.slice(0, 10).forEach(translation => {
      console.log(`- Key: ${translation.key}, Language: ${translation.language_code}, Value: ${translation.value.substring(0, 50)}...`);
    });
    
    if (translations.length > 10) {
      console.log(`... and ${translations.length - 10} more records`);
    }
  } catch (err) {
    console.log('Error checking translations table:', err.message);
  }
}

checkDatabase().then(() => {
  console.log('\nDatabase check completed.');
}).catch(err => {
  console.error('Error during database check:', err);
});

module.exports = {
  checkDatabase,
  checkTranslationsTable
};