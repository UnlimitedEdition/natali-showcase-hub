import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Podcast, Users, Send, X, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { EpisodesUploadModal } from './EpisodesUploadModal';
import ContentManager from './ContentManager';
import EpisodesManager from './EpisodesManager';
import GuestRequestsManager from './GuestRequestsManager';
import NewsletterManager from './NewsletterManager';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SimplifiedContentItem {
  page_key: string;
  hero_title_sr: string;
  hero_title_de: string;
  hero_title_en: string;
  hero_subtitle_sr: string;
  hero_subtitle_de: string;
  hero_subtitle_en: string;
}

interface Episode {
  id: string;
  title: string;
  description: string;
  language_code: string;
  youtube_url: string;
  is_published: boolean;
  created_at: string;
}

interface GuestRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  created_at: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { isAdmin, isSuperAdmin, role } = useAuth();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState<SimplifiedContentItem[]>([]);
  const [groupedEpisodes, setGroupedEpisodes] = useState<Record<string, Episode[]>>({});
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>([]);
  const [loadingContent, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);

  const fetchGuestRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('guest_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuestRequests(data || []);
    } catch (error) {
      console.error('Error fetching guest requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch guest requests",
        variant: "destructive"
      });
    }
  };

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
  const [loadingNewsletter, setLoadingNewsletter] = useState(true);

  const fetchNewsletterSubscribers = async () => {
    setLoadingNewsletter(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletterSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch newsletter subscribers",
        variant: "destructive"
      });
    } finally {
      setLoadingNewsletter(false);
    }
  };

  const fetchSimplifiedContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content')
        .select('page_key, section_key, language_code, content_text');

      if (error) throw error;

      // Group content by page_key and section_key
      const grouped: Record<string, Record<string, Record<string, string>>> = {};
      
      data?.forEach(item => {
        if (!grouped[item.page_key]) {
          grouped[item.page_key] = {};
        }
        if (!grouped[item.page_key][item.section_key]) {
          grouped[item.page_key][item.section_key] = {};
        }
        grouped[item.page_key][item.section_key][item.language_code] = item.content_text || '';
      });

      // Convert to simplified format
      const simplifiedContent: SimplifiedContentItem[] = Object.entries(grouped).map(([pageKey, sections]) => ({
        page_key: pageKey,
        hero_title_sr: sections.hero_title?.sr || '',
        hero_title_de: sections.hero_title?.de || '',
        hero_title_en: sections.hero_title?.en || '',
        hero_subtitle_sr: sections.hero_subtitle?.sr || '',
        hero_subtitle_de: sections.hero_subtitle?.de || '',
        hero_subtitle_en: sections.hero_subtitle?.en || '',
      }));

      setContent(simplifiedContent);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group episodes by id
      const grouped: Record<string, Episode[]> = {};
      data?.forEach(episode => {
        if (!grouped[episode.id]) {
          grouped[episode.id] = [];
        }
        grouped[episode.id].push(episode);
      });

      setGroupedEpisodes(grouped);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch episodes",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchSimplifiedContent();
      fetchEpisodes();
      if (role === 'admin' || role === 'superadmin') {
        fetchGuestRequests();
      }
      fetchNewsletterSubscribers();
    }
  }, [isOpen, isAdmin, role]);

  const handleContentChange = (pageKey: string, field: string, value: string) => {
    setContent(prev => prev.map(item => 
      item.page_key === pageKey ? { ...item, [field]: value } : item
    ));
  };

  const saveAllContent = async () => {
    setSaving(true);
    try {
      const updates = [];
      
      for (const item of content) {
        // Update hero_title for each language
        updates.push(
          supabase.from('content').upsert({
            page_key: item.page_key,
            section_key: 'hero_title',
            language_code: 'sr',
            content_text: item.hero_title_sr,
            is_published: true
          }, { onConflict: 'page_key,section_key,language_code' })
        );
        
        updates.push(
          supabase.from('content').upsert({
            page_key: item.page_key,
            section_key: 'hero_title',
            language_code: 'de',
            content_text: item.hero_title_de,
            is_published: true
          }, { onConflict: 'page_key,section_key,language_code' })
        );
        
        updates.push(
          supabase.from('content').upsert({
            page_key: item.page_key,
            section_key: 'hero_title',
            language_code: 'en',
            content_text: item.hero_title_en,
            is_published: true
          }, { onConflict: 'page_key,section_key,language_code' })
        );
        
        // Update hero_subtitle for each language
        updates.push(
          supabase.from('content').upsert({
            page_key: item.page_key,
            section_key: 'hero_subtitle',
            language_code: 'sr',
            content_text: item.hero_subtitle_sr,
            is_published: true
          }, { onConflict: 'page_key,section_key,language_code' })
        );
        
        updates.push(
          supabase.from('content').upsert({
            page_key: item.page_key,
            section_key: 'hero_subtitle',
            language_code: 'de',
            content_text: item.hero_subtitle_de,
            is_published: true
          }, { onConflict: 'page_key,section_key,language_code' })
        );
        
        updates.push(
          supabase.from('content').upsert({
            page_key: item.page_key,
            section_key: 'hero_subtitle',
            language_code: 'en',
            content_text: item.hero_subtitle_en,
            is_published: true
          }, { onConflict: 'page_key,section_key,language_code' })
        );
      }

      await Promise.all(updates.map(update => update()));

      toast({
        title: "Success",
        description: "Content saved successfully",
      });

      await fetchSimplifiedContent();
      setSaving(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, table: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_published: !isPublished })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Item ${!isPublished ? 'published' : 'unpublished'} successfully`,
      });

      if (table === 'episodes') {
        fetchEpisodes();
      }
    } catch (error) {
      console.error('Error updating publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update publish status",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Keep existing JSX structure */}
      <DialogContent className="max-w-7xl max-h-[95vh] h-[95vh] p-0 overflow-hidden flex flex-col" aria-describedby="admin-panel-description">
        <DialogHeader className="px-6 py-4 border-b bg-muted flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Manage your content and episodes</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Hidden description for accessibility */}
          <div id="admin-panel-description" className="sr-only">
            Admin panel for managing website content, episodes, guest requests, and newsletter subscribers.
          </div>
          
          {/* Sidebar for tabs on mobile/desktop */}
          <div className="w-full md:w-64 border-r bg-background flex-shrink-0">
            <nav className="p-4 h-full">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4 md:grid-cols-1 gap-2 flex-1">
                  <TabsTrigger value="content" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Content</span>
                    <span className="md:hidden">Content</span>
                  </TabsTrigger>
                  <TabsTrigger value="episodes" className="justify-start">
                    <Podcast className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Episodes</span>
                    <span className="md:hidden">Episodes</span>
                  </TabsTrigger>
                  {(role === 'admin' || role === 'superadmin') && (
                    <TabsTrigger value="guests" className="justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      <span className="hidden md:inline">Guest Requests</span>
                      <span className="md:hidden">Guests</span>
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="logs" className="justify-start">
                    <Send className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Newsletter</span>
                    <span className="md:hidden">Newsletter</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} className="w-full h-full flex flex-col">
              {/* Content Tab */}
              <TabsContent value="content" className="mt-0 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  <ContentManager 
                    content={content}
                    loadingContent={loadingContent}
                    saving={saving}
                    handleContentChange={handleContentChange}
                    saveAllContent={saveAllContent}
                  />
                </div>
              </TabsContent>

              {/* Episodes Tab */}
              <TabsContent value="episodes" className="mt-0 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  <EpisodesManager
                    groupedEpisodes={groupedEpisodes}
                    language={language}
                    fetchEpisodes={fetchEpisodes}
                    togglePublished={togglePublished}
                  />
                </div>
              </TabsContent>

              {/* Guest Requests Tab */}
              {(role === 'admin' || role === 'superadmin') && (
                <TabsContent value="guests" className="mt-0 h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <GuestRequestsManager guestRequests={guestRequests} />
                  </div>
                </TabsContent>
              )}

              {/* Newsletter Tab */}
              <TabsContent value="logs" className="mt-0 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  <NewsletterManager 
                    subscribers={newsletterSubscribers}
                    loading={loadingNewsletter}
                    refreshData={fetchNewsletterSubscribers}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {isUploadModalOpen && (
          <EpisodesUploadModal
            isOpen={isUploadModalOpen}
            episodeId={editingEpisodeId}
            onClose={() => {
              setIsUploadModalOpen(false);
              setEditingEpisodeId(null);
              fetchEpisodes();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};