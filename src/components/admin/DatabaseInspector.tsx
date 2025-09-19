import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const DatabaseInspector: React.FC = () => {
  const { t } = useLanguage();
  const [contentData, setContentData] = useState<any[]>([]);
  const [episodesData, setEpisodesData] = useState<any[]>([]);
  const [profilesData, setProfilesData] = useState<any[]>([]);
  const [translationsData, setTranslationsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDatabaseInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[DatabaseInspector] Starting data fetch...');
      
      // Get sample data from content table
      const { data: contentSample, error: contentError } = await supabase
        .from('content')
        .select('*')
        .limit(5);

      if (contentError) {
        console.error('Content error:', contentError);
        throw contentError;
      }

      // Get sample data from episodes table
      const { data: episodesSample, error: episodesError } = await supabase
        .from('episodes')
        .select('*')
        .limit(5);

      if (episodesError) {
        console.error('Episodes error:', episodesError);
        throw episodesError;
      }

      // Get sample data from profiles table
      const { data: profilesSample, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        throw profilesError;
      }

      // Get sample data from translations table
      const { data: translationsSample, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .limit(10);

      if (translationsError) {
        console.error('Translations error:', translationsError);
        throw translationsError;
      }

      console.log('[DatabaseInspector] Data fetched successfully');
      setContentData(contentSample || []);
      setEpisodesData(episodesSample || []);
      setProfilesData(profilesSample || []);
      setTranslationsData(translationsSample || []);
      
    } catch (err) {
      console.error('Database inspection error:', err);
      setError('Database error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseInfo();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Database Inspector</h3>
        <Button onClick={loadDatabaseInfo} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Content Table
                <Badge className="ml-2">{contentData.length} records</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {contentData.map((item, index) => (
                  <div key={index} className="border-b border-border py-2 last:border-b-0">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                ))}
                {contentData.length === 0 && (
                  <p className="text-muted-foreground">No data available</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Episodes Table
                <Badge className="ml-2">{episodesData.length} records</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {episodesData.map((item, index) => (
                  <div key={index} className="border-b border-border py-2 last:border-b-0">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                ))}
                {episodesData.length === 0 && (
                  <p className="text-muted-foreground">No data available</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Profiles Table
                <Badge className="ml-2">{profilesData.length} records</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {profilesData.map((item, index) => (
                  <div key={index} className="border-b border-border py-2 last:border-b-0">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                ))}
                {profilesData.length === 0 && (
                  <p className="text-muted-foreground">No data available</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Translations Table
                <Badge className="ml-2">{translationsData.length} records</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {translationsData.map((item, index) => (
                  <div key={index} className="border-b border-border py-2 last:border-b-0">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                ))}
                {translationsData.length === 0 && (
                  <p className="text-muted-foreground">No data available</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};