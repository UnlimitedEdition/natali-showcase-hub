import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Globe, Play } from 'lucide-react';
import { VideoModal } from '@/components/VideoModal';

const DatabaseInspector = () => {
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const [contentData, setContentData] = useState<any[]>([]);
  const [episodesData, setEpisodesData] = useState<any[]>([]);
  const [profilesData, setProfilesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: '',
    title: ''
  });

  const fetchData = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch content data
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('*');
      
      if (contentError) throw contentError;
      setContentData(content || []);
      
      // Fetch episodes data
      const { data: episodes, error: episodesError } = await supabase
        .from('episodes')
        .select('*');
      
      if (episodesError) throw episodesError;
      setEpisodesData(episodes || []);
      
      // Fetch profiles data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      setProfilesData(profiles || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const openVideoModal = (videoUrl: string, title: string) => {
    setVideoModal({
      isOpen: true,
      videoUrl,
      title
    });
  };

  const closeVideoModal = () => {
    setVideoModal({
      isOpen: false,
      videoUrl: '',
      title: ''
    });
  };

  const languages = [
    { code: 'sr', name: 'SR', label: t('admin.language.sr') },
    { code: 'de', name: 'DE', label: t('admin.language.de') },
    { code: 'en', name: 'EN', label: t('admin.language.en') }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('admin.accessDenied.title')}</h1>
          <p>{t('admin.accessDenied.message')}</p>
        </div>
      </div>
    );
  }

  // Filter data by selected language
  const filteredContentData = contentData.filter(item => item.language_code === selectedLanguage);
  const filteredEpisodesData = episodesData.filter(item => item.language_code === selectedLanguage);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.databaseInspector.title')}</h1>
            <p className="text-muted-foreground">{t('admin.databaseInspector.subtitle')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center bg-secondary rounded-md p-1">
              <Globe className="h-4 w-4 ml-2 text-muted-foreground" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-background shadow'
                      : 'hover:bg-background/50'
                  }`}
                  onClick={() => setSelectedLanguage(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            <Button onClick={fetchData} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admin.refreshing')}
                </>
              ) : (
                t('admin.refreshData')
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>{t('admin.error')}:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin.databaseInspector.contentTable')} ({filteredContentData.length} {t('admin.records')})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {filteredContentData.map((item) => (
                  <div key={item.id} className="mb-4 p-3 border rounded">
                    <div className="font-semibold">{item.page_key} - {item.section_key}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {languages.find(l => l.code === item.language_code)?.name || item.language_code}
                    </div>
                    <div className="mt-2 text-sm">{item.content_text}</div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {t('admin.published')}: {item.is_published ? t('common.yes') : t('common.no')}
                    </div>
                  </div>
                ))}
                {filteredContentData.length === 0 && (
                  <p className="text-muted-foreground">{t('admin.databaseInspector.noContentData')}</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Episodes Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin.databaseInspector.episodesTable')} ({filteredEpisodesData.length} {t('admin.records')})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {filteredEpisodesData.map((item) => (
                  <div key={item.id} className="mb-4 p-3 border rounded">
                    <div className="font-semibold text-lg mb-2">{item.title}</div>
                                        
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">
                        {languages.find(l => l.code === item.language_code)?.label || 
                         item.language_code}
                      </span>
                    </div>
                                        
                    {item.description && (
                      <div className="mt-2 mb-3 p-2 bg-muted/50 rounded-md">
                        <p className="text-sm">{item.description}</p>
                      </div>
                    )}
                                        
                    {item.youtube_url && (
                      <div className="mt-2 mb-3">
                        <Button 
                          onClick={() => openVideoModal(item.youtube_url, item.title)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Play className="w-4 h-4 mr-1.5" />
                          {t('admin.databaseInspector.watchEpisode')}
                        </Button>
                      </div>
                    )}
                                        
                    <div className="mt-4 pt-3 border-t border-muted/30">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {t('admin.published')}: {item.is_published ? t('common.yes') : t('common.no')}
                        </span>
                                            
                        {item.season_number && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {t('admin.season')}: {item.season_number}
                          </span>
                        )}
                                            
                        {item.episode_number && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {t('admin.episode')}: {item.episode_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredEpisodesData.length === 0 && (
                  <p className="text-muted-foreground">{t('admin.databaseInspector.noEpisodesData')}</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Profiles Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin.databaseInspector.profilesTable')} ({profilesData.length} {t('admin.records')})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {profilesData.map((item) => (
                  <div key={item.user_id} className="mb-4 p-3 border rounded">
                    <div className="font-semibold">
                      {item.full_name || item.email || t('admin.databaseInspector.unnamedUser')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t('admin.email')}: {item.email || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t('admin.role')}: {item.role || 'N/A'}
                    </div>
                    <div className="mt-2 text-xs">
                      {t('admin.userId')}: {item.user_id}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {t('admin.lastActive')}: {item.last_active ? new Date(item.last_active).toLocaleString() : t('admin.never')}
                    </div>
                  </div>
                ))}
                {profilesData.length === 0 && (
                  <p className="text-muted-foreground">{t('admin.databaseInspector.noProfilesData')}</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.videoUrl}
        title={videoModal.title}
      />
    </div>
  );
};

export default DatabaseInspector;