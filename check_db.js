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
  
  // Check RLS status
  console.log('\n=== RLS STATUS ===');
  const tables = ['content', 'episodes', 'profiles'];
  for (const table of tables) {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('relname')
      .eq('relname', table)
      .single();
      
    if (error) {
      console.error(`Error checking table ${table}:`, error);
    } else {
      console.log(`${table}: exists`);
    }
  }
}

checkDatabase();