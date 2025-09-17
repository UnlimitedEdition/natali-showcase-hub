import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Podcast, Users, Database, Settings, Eye, EyeOff, Plus, Play, Terminal, Languages, Menu, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { EpisodesUploadModal } from './EpisodesUploadModal';

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
  description: string | null;
  duration_seconds: number | null;
  published_date: string | null;
  language_code: string;
  is_featured: boolean;
  thumbnail_url: string | null;
  created_at: string;
  youtube_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  episode_number: number | null;
  season_number: number | null;
  is_published: boolean;
  updated_at: string;
  // These fields may exist in the database but are not guaranteed
  category?: string | null;
  author?: string | null;
  read_time?: string | null;
  likes?: number | null;
}

interface GuestRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  reason: string;
  message: string;
  language_code: string;
  created_at: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { t, loading: translationsLoading, language, translations, loading } = useLanguage();
  const { isAdmin, isSuperAdmin, role } = useAuth();
  console.log(`[AdminPanel] Loaded role: ${role}, isAdmin: ${isAdmin}, isSuperAdmin: ${isSuperAdmin}`);
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState<SimplifiedContentItem[]>([]);
  const [groupedEpisodes, setGroupedEpisodes] = useState<Record<string, Episode[]>>({});
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>([]);
  const [loadingContent, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [logs, setLogs] = useState<{timestamp: Date, message: string, type: string}[]>([]);
  const [command, setCommand] = useState('');
  const [translationLogs, setTranslationLogs] = useState<{timestamp: Date, message: string, type: string}[]>([]);
  const [translationCommand, setTranslationCommand] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (isOpen && isAdmin) {
      console.log('[AdminPanel] Fetching admin data for role:', role);
      fetchSimplifiedContent();
      fetchEpisodes();
      if (role === 'admin' || role === 'superadmin') {
        console.log('[AdminPanel] Fetching guest requests for admin/superadmin');
        fetchGuestRequests();
      } else {
        console.log('[AdminPanel] Skipping guest requests for role:', role);
      }
    }
  }, [isOpen, isAdmin, role]);

  const fetchSimplifiedContent = async () => {
    setLoading(true);
    try {
      // Fetch content for all languages
      const { data: srData, error: srError } = await supabase
        .from('content')
        .select('page_key, section_key, content_text')
        .eq('section_key', 'hero_title')
        .eq('language_code', 'sr');

      const { data: deData, error: deError } = await supabase
        .from('content')
        .select('page_key, section_key, content_text')
        .eq('section_key', 'hero_title')
        .eq('language_code', 'de');

      const { data: enData, error: enError } = await supabase
        .from('content')
        .select('page_key, section_key, content_text')
        .eq('section_key', 'hero_title')
        .eq('language_code', 'en');

      const { data: srSubtitleData, error: srSubtitleError } = await supabase
        .from('content')
        .select('page_key, section_key, content_text')
        .eq('section_key', 'hero_subtitle')
        .eq('language_code', 'sr');

      const { data: deSubtitleData, error: deSubtitleError } = await supabase
        .from('content')
        .select('page_key, section_key, content_text')
        .eq('section_key', 'hero_subtitle')
        .eq('language_code', 'de');

      const { data: enSubtitleData, error: enSubtitleError } = await supabase
        .from('content')
        .select('page_key, section_key, content_text')
        .eq('section_key', 'hero_subtitle')
        .eq('language_code', 'en');

      if (srError || deError || enError || srSubtitleError || deSubtitleError || enSubtitleError) {
        throw new Error('Failed to fetch content');
      }

      // Combine data into simplified structure
      const pages = ['home', 'podcast', 'kitchen', 'stories', 'contact'];
      const simplifiedContent: SimplifiedContentItem[] = pages.map(page => {
        const srTitle = srData?.find(item => item.page_key === page)?.content_text || '';
        const deTitle = deData?.find(item => item.page_key === page)?.content_text || '';
        const enTitle = enData?.find(item => item.page_key === page)?.content_text || '';
        const srSubtitle = srSubtitleData?.find(item => item.page_key === page)?.content_text || '';
        const deSubtitle = deSubtitleData?.find(item => item.page_key === page)?.content_text || '';
        const enSubtitle = enSubtitleData?.find(item => item.page_key === page)?.content_text || '';

        return {
          page_key: page,
          hero_title_sr: srTitle,
          hero_title_de: deTitle,
          hero_title_en: enTitle,
          hero_subtitle_sr: srSubtitle,
          hero_subtitle_de: deSubtitle,
          hero_subtitle_en: enSubtitle
        };
      });

      setContent(simplifiedContent);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
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
      const grouped = data.reduce((acc: Record<string, Episode[]>, episode: Episode) => {
        if (!acc[episode.id]) {
          acc[episode.id] = [];
        }
        acc[episode.id].push(episode);
        return acc;
      }, {});
      setGroupedEpisodes(grouped);
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
        fetchSimplifiedContent();
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

  const handleContentChange = (pageKey: string, field: string, value: string) => {
    setContent(prev => prev.map(item => 
      item.page_key === pageKey ? { ...item, [field]: value } : item
    ));
  };

  const saveAllContent = async () => {
    setSaving(true);
    try {
      // Create array of all updates
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

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span>Admin Panel</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* Sidebar for tabs on mobile/desktop */}
          <div className="w-64 border-r bg-background hidden md:block">
            <nav className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="content" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="episodes" className="justify-start">
                    <Podcast className="mr-2 h-4 w-4" />
                    Episodes
                  </TabsTrigger>
                  {(role === 'admin' || role === 'superadmin') && (
                    <TabsTrigger value="guests" className="justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Guest Requests
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="logs" className="justify-start">
                    <Terminal className="mr-2 h-4 w-4" />
                    Logs
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed top-16 left-0 w-full bg-background border-b z-50">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="content" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="episodes" className="justify-start">
                    <Podcast className="mr-2 h-4 w-4" />
                    Episodes
                  </TabsTrigger>
                  {(role === 'admin' || role === 'superadmin') && (
                    <TabsTrigger value="guests" className="justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Guest Requests
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="logs" className="justify-start">
                    <Terminal className="mr-2 h-4 w-4" />
                    Logs
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Main content area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Tabs value={activeTab} className="w-full">
              {/* Content Tab */}
              <TabsContent value="content" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Manage Content</h2>
                    <Button onClick={saveAllContent} disabled={saving || loadingContent}>
                      {saving ? 'Saving...' : 'Save All Changes'}
                    </Button>
                  </div>
                  {loadingContent ? (
                    <div>Loading content...</div>
                  ) : (
                    <div className="space-y-6">
                      {content.map((item) => (
                        <Card key={item.page_key}>
                          <CardHeader>
                            <CardTitle>{item.page_key.toUpperCase()}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Hero Title */}
                            <div className="space-y-2">
                              <h3 className="font-semibold">Hero Title</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label>SR</Label>
                                  <Input
                                    value={item.hero_title_sr}
                                    onChange={(e) => handleContentChange(item.page_key, 'hero_title_sr', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>DE</Label>
                                  <Input
                                    value={item.hero_title_de}
                                    onChange={(e) => handleContentChange(item.page_key, 'hero_title_de', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>EN</Label>
                                  <Input
                                    value={item.hero_title_en}
                                    onChange={(e) => handleContentChange(item.page_key, 'hero_title_en', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* Hero Subtitle */}
                            <div className="space-y-2">
                              <h3 className="font-semibold">Hero Subtitle</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label>SR</Label>
                                  <Input
                                    value={item.hero_subtitle_sr}
                                    onChange={(e) => handleContentChange(item.page_key, 'hero_subtitle_sr', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>DE</Label>
                                  <Input
                                    value={item.hero_subtitle_de}
                                    onChange={(e) => handleContentChange(item.page_key, 'hero_subtitle_de', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>EN</Label>
                                  <Input
                                    value={item.hero_subtitle_en}
                                    onChange={(e) => handleContentChange(item.page_key, 'hero_subtitle_en', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Episodes Tab */}
              <TabsContent value="episodes" className="mt-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Manage Episodes</h2>
                    <Button onClick={() => { setEditingEpisodeId(null); setIsUploadModalOpen(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload New Episode
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {Object.values(groupedEpisodes).map((group) => {
                      const id = group[0].id;
                      const sample = group[0];
                      const titles = group.map(ep => `${ep.language_code.toUpperCase()}: ${ep.title}`).join('\n');
                      const description = group.find(ep => ep.language_code === language)?.description || group[0].description || 'No description';
                      const languages = group.map(ep => ep.language_code).join(', ');

                      return (
                        <Card key={id}>
                          <CardContent className="p-4">
                            <div className="mb-4">
                              <h3 className="font-semibold">Video ID: {id}</h3>
                              <p className="text-sm text-muted-foreground">YouTube URL: {sample.youtube_url || 'None'}</p>
                              <div className="mt-2">
                                <strong>Titles:</strong>
                                <pre className="text-sm mt-1 p-2 bg-muted rounded whitespace-pre-wrap">{titles}</pre>
                              </div>
                              {description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Description ({language}): {description}
                                </p>
                              )}
                              <p className="text-sm mt-1">Languages: {languages}</p>
                              <p className="text-sm">Published: {sample.is_published ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePublished(id, 'episodes', sample.is_published)}
                              >
                                {sample.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                {sample.is_published ? 'Unpublish' : 'Publish'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setEditingEpisodeId(id); setIsUploadModalOpen(true); }}
                              >
                                Edit
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
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
              </TabsContent>

              {/* Guest Requests Tab */}
              {(role === 'admin' || role === 'superadmin') && (
                <TabsContent value="guests" className="mt-0">
                  <h2 className="text-2xl font-bold mb-6">Guest Requests</h2>
                  <div className="grid gap-4">
                    {guestRequests.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{request.first_name} {request.last_name}</h3>
                              <p className="text-sm text-muted-foreground">{request.email}</p>
                              <p className="text-sm">Reason: {request.reason}</p>
                              <p className="text-sm mt-2">Message: {request.message}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Logs Tab */}
              <TabsContent value="logs" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">System Logs</h2>
                  <Textarea
                    value={logs.map(log => `[${log.timestamp.toLocaleString()}] ${log.message} (${log.type})`).join('\n')}
                    readOnly
                    className="h-64"
                    placeholder="No logs available..."
                  />
                  <div className="flex gap-2">
                    <Input
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder="Enter command..."
                    />
                    <Button onClick={() => {
                      // Placeholder for command execution
                      setLogs(prev => [...prev, { timestamp: new Date(), message: command, type: 'info' }]);
                      setCommand('');
                    }}>
                      Execute
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};