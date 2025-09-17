import { supabase } from '@/integrations/supabase/client';

export const inspectDatabase = async () => {
  try {
    // Get all tables in the database using Supabase RPC
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info');

    if (tablesError) {
      // Fallback method - get known tables directly
      console.log('=== DATABASE TABLES (fallback method) ===');
      const tables = [
        { table_name: 'content', table_schema: 'public', table_type: 'BASE TABLE' },
        { table_name: 'episodes', table_schema: 'public', table_type: 'BASE TABLE' },
        { table_name: 'profiles', table_schema: 'public', table_type: 'BASE TABLE' }
      ];
      console.log(tables);
    } else {
      console.log('=== DATABASE TABLES ===');
      console.log(tables);
    }

    // Get row counts for each table
    console.log('\n=== TABLE ROW COUNTS ===');
    const tablesToCheck = ['content', 'episodes', 'profiles', 'translations'];
    
    for (const tableName of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error(`Error counting rows in ${tableName}:`, error);
          continue;
        }

        console.log(`${tableName}: ${count} rows`);
      } catch (err) {
        console.error(`Error counting rows in ${tableName}:`, err);
      }
    }

    // Get sample data from content table
    console.log('\n=== SAMPLE DATA FROM CONTENT TABLE ===');
    const { data: contentSample, error: contentError } = await supabase
      .from('content')
      .select('*')
      .limit(5);

    if (contentError) {
      console.error('Error fetching content sample:', contentError);
    } else {
      console.log(contentSample);
    }

    // Get sample data from episodes table
    console.log('\n=== SAMPLE DATA FROM EPISODES TABLE ===');
    const { data: episodesSample, error: episodesError } = await supabase
      .from('episodes')
      .select('*')
      .limit(5);

    if (episodesError) {
      console.error('Error fetching episodes sample:', episodesError);
    } else {
      console.log(episodesSample);
    }

    // Get sample data from profiles table
    console.log('\n=== SAMPLE DATA FROM PROFILES TABLE ===');
    const { data: profilesSample, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.error('Error fetching profiles sample:', profilesError);
    } else {
      console.log(profilesSample);
    }

    // Get sample data from translations table
    console.log('\n=== SAMPLE DATA FROM TRANSLATIONS TABLE ===');
    const { data: translationsSample, error: translationsError } = await supabase
      .from('translations')
      .select('*')
      .limit(10);

    if (translationsError) {
      console.error('Error fetching translations sample:', translationsError);
    } else {
      console.log(translationsSample);
    }

    // Get translation counts by language
    console.log('\n=== TRANSLATION COUNTS BY LANGUAGE ===');
    const { data: translationCounts, error: translationCountsError } = await supabase
      .from('translations')
      .select('language_code')
      .then(async () => {
        return await supabase.rpc('get_translation_counts');
      })
      .catch(async () => {
        // Fallback method
        const languages = ['en', 'de', 'sr'];
        for (const lang of languages) {
          const { count, error } = await supabase
            .from('translations')
            .select('*', { count: 'exact', head: true })
            .eq('language_code', lang);
          
          if (!error) {
            console.log(`${lang}: ${count} translations`);
          }
        }
      });

    if (translationCountsError) {
      console.error('Error fetching translation counts:', translationCountsError);
    } else if (translationCounts) {
      console.log(translationCounts);
    }

  } catch (error) {
    console.error('Database inspection error:', error);
  }
};