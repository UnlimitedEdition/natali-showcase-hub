import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UploadModal } from './UploadModal';
import { Settings, Upload, Users, FileText, PodcastIcon as Podcast } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Content {
  id: string;
  page_key: string;
  section_key: string;
  language_code: string;
  content_text: string | null;
  content_html: string | null;
  media_url: string | null;
  media_type: string | null;
  is_published: boolean;
}

interface Episode {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  language_code: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState<Content[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    pageKey: string;
    sectionKey: string;
  }>({
    isOpen: false,
    pageKey: '',
    sectionKey: ''
  });

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchContent();
      fetchEpisodes();
    }
  }, [isOpen, isAdmin, language]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('language_code', language)
        .order('page_key', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('language_code', language)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const togglePublished = async (id: string, tableName: 'content' | 'episodes', currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Content ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });

      if (tableName === 'content') {
        fetchContent();
      } else {
        fetchEpisodes();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const openUploadModal = (pageKey: string, sectionKey: string) => {
    setUploadModal({
      isOpen: true,
      pageKey,
      sectionKey
    });
  };

  const closeUploadModal = () => {
    setUploadModal({
      isOpen: false,
      pageKey: '',
      sectionKey: ''
    });
    fetchContent();
  };

  if (!isAdmin) {
    return null;
  }

  const pageKeys = ['home', 'podcast', 'kitchen', 'stories', 'contact'];
  const sectionKeys = ['hero_title', 'hero_subtitle', 'page_title', 'content', 'about'];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <Settings className="h-6 w-6 text-primary" />
              {t('admin.title')}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('admin.content')}
              </TabsTrigger>
              <TabsTrigger value="episodes" className="flex items-center gap-2">
                <Podcast className="h-4 w-4" />
                {t('admin.episodes')}
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('admin.users')}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t('admin.settings')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Content Management ({language.toUpperCase()})</h3>
              </div>

              {/* Quick Upload Buttons */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                {pageKeys.map(pageKey => (
                  <div key={pageKey} className="space-y-2">
                    <h4 className="font-medium capitalize">{pageKey}</h4>
                    {sectionKeys.map(sectionKey => (
                      <Button
                        key={`${pageKey}-${sectionKey}`}
                        variant="outline"
                        size="sm"
                        onClick={() => openUploadModal(pageKey, sectionKey)}
                        className="w-full text-xs"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        {sectionKey.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>

              {/* Content List */}
              <div className="space-y-4">
                {content.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.page_key} - {item.section_key}</h4>
                        {item.content_text && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.content_text.substring(0, 100)}...
                          </p>
                        )}
                        {item.media_url && (
                          <div className="mt-2">
                            <span className="text-xs bg-secondary px-2 py-1 rounded">
                              {item.media_type}: {item.media_url.substring(0, 50)}...
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUploadModal(item.page_key, item.section_key)}
                        >
                          {t('common.edit')}
                        </Button>
                        <Button
                          size="sm"
                          variant={item.is_published ? "default" : "secondary"}
                          onClick={() => togglePublished(item.id, 'content', item.is_published)}
                        >
                          {item.is_published ? 'Published' : 'Draft'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="episodes" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Episodes ({language.toUpperCase()})</h3>
                <Button onClick={() => openUploadModal('podcast', 'new_episode')}>
                  <Upload className="h-4 w-4 mr-2" />
                  Add Episode
                </Button>
              </div>

              <div className="space-y-4">
                {episodes.map((episode) => (
                  <div key={episode.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{episode.title}</h4>
                        {episode.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {episode.description.substring(0, 150)}...
                          </p>
                        )}
                        {episode.youtube_url && (
                          <div className="mt-2">
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              YouTube: {episode.youtube_url.substring(0, 40)}...
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUploadModal('podcast', `episode_${episode.id}`)}
                        >
                          {t('common.edit')}
                        </Button>
                        <Button
                          size="sm"
                          variant={episode.is_published ? "default" : "secondary"}
                          onClick={() => togglePublished(episode.id, 'episodes', episode.is_published)}
                        >
                          {episode.is_published ? 'Published' : 'Draft'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <h3 className="text-lg font-semibold">User Management</h3>
              <p className="text-muted-foreground">User management features will be available here.</p>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-muted-foreground">Site settings and configuration options will be available here.</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={closeUploadModal}
        pageKey={uploadModal.pageKey}
        sectionKey={uploadModal.sectionKey}
        onUploadSuccess={closeUploadModal}
      />
    </>
  );
};