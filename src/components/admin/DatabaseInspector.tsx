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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationCheck, setTranslationCheck] = useState<{
    isLoading: boolean;
    hasIssues: boolean;
    issuesCount: number;
    details: Array<{
      id: number;
      field: string;
      missingTranslations: string[];
    }>;
  }>({
    isLoading: false,
    hasIssues: false,
    issuesCount: 0,
    details: []
  });
  const [showTranslationDetails, setShowTranslationDetails] = useState(false);

  const checkTranslations = async (contentItems: any[]) => {
    setTranslationCheck(prev => ({ ...prev, isLoading: true }));
    
    try {
      const issues: Array<{
        id: number;
        field: string;
        missingTranslations: string[];
      }> = [];
      
      // 获取所有可用的语言
      const { data: { languages } } = await supabase.auth.admin.listAuthenticators();
      const availableLanguages = languages.map((lang: any) => lang.code);
      
      contentItems.forEach((item) => {
        // 检查标题翻译
        const titleTranslations = item.title_translations || {};
        const missingTitleLangs = availableLanguages.filter(
          (lang: string) => !(lang in titleTranslations)
        );
        
        if (missingTitleLangs.length > 0) {
          issues.push({
            id: item.id,
            field: 'title',
            missingTranslations: missingTitleLangs
          });
        }
        
        // 检查描述翻译
        const descriptionTranslations = item.description_translations || {};
        const missingDescriptionLangs = availableLanguages.filter(
          (lang: string) => !(lang in descriptionTranslations)
        );
        
        if (missingDescriptionLangs.length > 0) {
          issues.push({
            id: item.id,
            field: 'description',
            missingTranslations: missingDescriptionLangs
          });
        }
      });
      
      const hasIssues = issues.length > 0;
      const issuesCount = issues.reduce((sum, issue) => sum + issue.missingTranslations.length, 0);
      
      setTranslationCheck({
        isLoading: false,
        hasIssues,
        issuesCount,
        details: issues
      });
    } catch (err) {
      console.error('Translation check error:', err);
      setTranslationCheck(prev => ({ ...prev, isLoading: false }));
    }
  };

  const loadDatabaseInfo = async () => {
    setLoading(true);
    setError(null);
    try {
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

      setContentData(contentSample || []);
      setEpisodesData(episodesSample || []);
      setProfilesData(profilesSample || []);
      checkTranslations(contentSample || []);
    } catch (err) {
      console.error('Database inspection error:', err);
      setError(t('admin.databaseInspector.error') + ': ' + (err as Error).message);
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
        <h3 className="text-lg font-semibold">{t('admin.databaseInspector.title')}</h3>
        <Button onClick={loadDatabaseInfo} disabled={loading}>
          {loading ? t('admin.databaseInspector.refreshing') : t('admin.databaseInspector.refresh')}
        </Button>
      </div>

  <Drawer open={showTranslationDetails} onOpenChange={setShowTranslationDetails}>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>
          {t('admin.databaseInspector.translationIssuesDetails')}
        </DrawerTitle>
      </DrawerHeader>
      
      <div className="p-4">
        {translationCheck.isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent"></div>
          </div>
        ) : translationCheck.details.length === 0 ? (
          <div className="flex items-center gap-2 p-4 text-green-600 bg-green-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <p>{t('admin.databaseInspector.noTranslationIssues')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {translationCheck.details.map((issue, index) => (
              <Card key={index} className="border-red-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('admin.databaseInspector.itemID', { id: issue.id })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm font-medium">
                        {t('admin.databaseInspector.field', { field: issue.field })}
                      </p>
                    </div>
                    
                    <div className="ml-6">
                      <p className="text-sm text-muted-foreground mb-1">
                        {t('admin.databaseInspector.missingInLanguages')}:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {issue.missingTranslations.map((lang, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="mt-4 text-sm text-muted-foreground">
              {t('admin.databaseInspector.totalIssues', { count: translationCheck.issuesCount })}
            </div>
          </div>
        )}
      </div>
    </DrawerContent>
  </Drawer>
</>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {t('admin.databaseInspector.error')}: {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('admin.databaseInspector.title')}</h3>
            <div className="flex gap-2">
              <Button 
                onClick={loadDatabaseInfo} 
                disabled={loading}
                variant="outline"
              >
                {loading ? t('admin.databaseInspector.refreshing') : t('admin.databaseInspector.refresh')}
              </Button>
              <Button 
                onClick={() => setShowTranslationDetails(true)}
                disabled={translationCheck.isLoading || !translationCheck.hasIssues}
                variant="outline"
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                {t('admin.databaseInspector.translationIssues', { count: translationCheck.issuesCount })}
              </Button>
            </div>
          </div>
        
          {translationCheck.isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
              {t('admin.databaseInspector.checkingTranslations')}
            </div>
          )}
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('admin.databaseInspector.table.content')}
                  <Badge className="ml-2">{contentData.length} {t('admin.databaseInspector.records')}</Badge>
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
                    <p className="text-muted-foreground">{t('admin.databaseInspector.noData')}</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
        
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('admin.databaseInspector.translationStatus')}
                  <Badge className={`ml-2 ${!translationCheck.hasIssues ? 'bg-green-500' : 'bg-red-500'}`}>
                    {!translationCheck.hasIssues 
                      ? t('admin.databaseInspector.translationComplete') 
                      : t('admin.databaseInspector.translationIncomplete')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {translationCheck.hasIssues ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    <p className="text-sm">
                      {!translationCheck.hasIssues
                        ? t('admin.databaseInspector.allTranslationsComplete')
                        : t('admin.databaseInspector.missingTranslations', { count: translationCheck.issuesCount })}
                    </p>
                  </div>
                  
                  {translationCheck.issuesCount > 0 && (
                    <Button 
                      onClick={() => setShowTranslationDetails(true)}
                      size="sm"
                      variant="outline"
                      className="mt-2"
                    >
                      {t('admin.databaseInspector.viewDetails')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </Card>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t('admin.databaseInspector.table.episodes')}
                  <Badge className="ml-2">{episodesData.length} {t('admin.databaseInspector.records')}</Badge>
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
                    <p className="text-muted-foreground">{t('admin.databaseInspector.noData')}</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t('admin.databaseInspector.table.profiles')}
                  <Badge className="ml-2">{profilesData.length} {t('admin.databaseInspector.records')}</Badge>
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
                    <p className="text-muted-foreground">{t('admin.databaseInspector.noData')}</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};