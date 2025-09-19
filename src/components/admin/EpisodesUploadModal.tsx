import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, Play, Plus, Trash2, X, Hash } from 'lucide-react';
import { VideoModal } from '@/components/VideoModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EpisodeData {
  title: string;
  description: string;
  youtubeUrl: string;
  section: 'podcast' | 'kitchen' | 'stories' | '';
  position: number | null;
}

interface EpisodesUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
  episodeId?: string;
}

export const EpisodesUploadModal: React.FC<EpisodesUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  episodeId
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [activeLanguageTab, setActiveLanguageTab] = useState('sr');
  // No tag-related state anymore
  
  // Episode data for all languages
  const [episodeData, setEpisodeData] = useState({
    sr: {
      title: '',
      description: '',
      youtubeUrl: '',
      section: '', // Section assignment instead of tags
      position: null as number | null,
    },
    de: {
      title: '',
      description: '',
      youtubeUrl: '',
      section: '', // Section assignment instead of tags
      position: null as number | null,
    },
    en: {
      title: '',
      description: '',
      youtubeUrl: '',
      section: '', // Section assignment instead of tags
      position: null as number | null,
    },
    isPublished: true,
  });

  // Update active language tab when language changes
  useEffect(() => {
    setActiveLanguageTab(language);
  }, [language]);

  // Section options
  const sections = [
    { id: 'podcast', label: t('admin.episodes.sections.podcast') },
    { id: 'kitchen', label: t('admin.episodes.sections.kitchen') },
    { id: 'stories', label: t('admin.episodes.sections.stories') }
  ];

  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: '',
    title: ''
  });

  useEffect(() => {
    if (episodeId && isOpen) {
      fetchEpisode(episodeId);
    } else {
      // Reset form when opening for a new episode
      setEpisodeData({
        sr: {
          title: '',
          description: '',
          youtubeUrl: '',
          section: '',
          additionalTags: [],
          position: null,
        },
        de: {
          title: '',
          description: '',
          youtubeUrl: '',
          section: '',
          additionalTags: [],
          position: null,
        },
        en: {
          title: '',
          description: '',
          youtubeUrl: '',
          section: '',
          additionalTags: [],
          position: null,
        },
        isPublished: true,
      });
    }
  }, [episodeId, isOpen]);

  const fetchEpisode = async (episodeId: string) => {
    try {
      // Fetch episodes for all languages for this episode ID
      const { data: episodes, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('id', episodeId);

      if (error) throw error;
      if (!episodes || episodes.length === 0) return;

      // Create episode data object with data for each language
      const episodeDataCopy = { ...episodeData, isPublished: false };
      
      // Define sections for reference
      const sections = [
        { id: 'podcast', name: 'Podcast' },
        { id: 'kitchen', name: 'Kuhinja/Küche/Kitchen' },
        { id: 'stories', name: 'Priče/Geschichten/Stories' }
      ];

      // Process each episode
      for (const data of episodes) {
        const lang = data.language_code;
        let section: string | null = null;
        
        // Extract section from category field
        if (data.category) {
          const categoryField = data.category;
          const tags = categoryField.split(',').map((tag: string) => tag.trim());
          // Find section (one of the required ones)
          const foundSection = tags.find((tag: string) => 
            sections.some(s => s.id === tag)
          );
          
          if (foundSection) {
            section = foundSection;
          }
        }

        episodeDataCopy[lang as 'sr' | 'de' | 'en'] = {
          title: data.title || '',
          description: data.description || '',
          youtubeUrl: data.youtube_url || '',
          section: section as 'podcast' | 'kitchen' | 'stories' | '',
          position: data.episode_number || null,
        };
      }

      // Get the published status from any episode (they should all be the same)
      const anyEpisode = episodes[0];
      if (anyEpisode) {
        episodeDataCopy.isPublished = anyEpisode.is_published;
      }

      setEpisodeData(episodeDataCopy);
    } catch (error) {
      console.error('Error fetching episode:', error);
      toast({
        title: t('toast.error'),
        description: 'Failed to fetch episode',
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Generate ID for new episodes
      const id = episodeId || uuidv4();
      
      // Delete existing episodes for this ID in all languages (only for existing episodes)
      if (episodeId) {
        const { error: deleteError } = await supabase
          .from('episodes')
          .delete()
          .eq('id', episodeId);
          
        if (deleteError) {
          throw deleteError;
        }
      }

      // Insert episodes for all languages
      const languages = ['sr', 'de', 'en'];
      const episodeInserts = languages.map(lang => {
        const langData = episodeData[lang as 'sr' | 'de' | 'en'];
        
        // Use section as category
        const category = langData.section || null;
        
        return {
          id: id,
          title: langData.title,
          description: langData.description || null,
          youtube_url: langData.youtubeUrl || null,
          category: category, // Store section in category field
          language_code: lang,
          is_published: episodeData.isPublished,
          episode_number: langData.position || null
        };
      });

      const { error: insertError } = await supabase
        .from('episodes')
        .insert(episodeInserts);

      if (insertError) throw insertError;

      toast({
        title: t('toast.success'),
        description: episodeId 
          ? t('admin.contentUpdated') 
          : t('admin.uploadSuccess'),
      });

      onUploadSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving episode:', error);
      toast({
        title: t('toast.error'),
        description: episodeId 
          ? t('admin.contentUpdateError') 
          : t('admin.uploadError'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

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

  const handleInputChange = (lang: 'sr' | 'de' | 'en', field: keyof Omit<EpisodeData, 'section' | 'position'>, value: string) => {
    setEpisodeData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handlePositionChange = (lang: 'sr' | 'de' | 'en', value: string) => {
    const position = value ? parseInt(value, 10) : null;
    setEpisodeData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        position
      }
    }));
  };

  const handleSectionChange = (lang: 'sr' | 'de' | 'en', section: 'podcast' | 'kitchen' | 'stories' | '') => {
    setEpisodeData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        section
      }
    }));
  };

  const currentLangData = episodeData[activeLanguageTab as 'sr' | 'de' | 'en'];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="episode-upload-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <Play className="h-6 w-6 text-primary" />
              {episodeId ? t('admin.editContent') : t('admin.episodes.add')}
            </DialogTitle>
            <p id="episode-upload-description" className="sr-only">
              {episodeId ? t('admin.episodes.editDescription') : t('admin.episodes.addDescription')}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Language Tabs */}
            <Tabs value={activeLanguageTab} onValueChange={setActiveLanguageTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sr">{t('admin.language.sr')}</TabsTrigger>
                <TabsTrigger value="de">{t('admin.language.de')}</TabsTrigger>
                <TabsTrigger value="en">{t('admin.language.en')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeLanguageTab} className="space-y-6 mt-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="episode-title">{t('admin.episodes.title')}</Label>
                  <Input
                    id="episode-title"
                    placeholder={t('admin.episodes.enterTitle')}
                    value={currentLangData.title}
                    onChange={(e) => handleInputChange(activeLanguageTab as 'sr' | 'de' | 'en', 'title', e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="episode-description">{t('admin.episodes.description')}</Label>
                  <Textarea
                    id="episode-description"
                    placeholder={t('admin.episodes.enterDescription')}
                    value={currentLangData.description}
                    onChange={(e) => handleInputChange(activeLanguageTab as 'sr' | 'de' | 'en', 'description', e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Section Assignment (Required) */}
                <div className="space-y-2">
                  <Label>{t('admin.episodes.section')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {sections.map((section) => (
                      <Button
                        key={section.id}
                        type="button"
                        variant={currentLangData.section === section.id ? "default" : "outline"}
                        onClick={() => handleSectionChange(activeLanguageTab as 'sr' | 'de' | 'en', section.id as 'podcast' | 'kitchen' | 'stories')}
                        className="whitespace-nowrap"
                      >
                        {section.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="episode-position">{t('admin.episodes.position')}</Label>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="episode-position"
                      type="number"
                      min="1"
                      placeholder={t('admin.episodes.enterPosition')}
                      value={currentLangData.position || ''}
                      onChange={(e) => handlePositionChange(activeLanguageTab as 'sr' | 'de' | 'en', e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.episodes.positionHelp')}
                  </p>
                </div>

                {/* YouTube URL */}
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">{t('admin.episodes.youtubeUrl')}</Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder={t('admin.episodes.enterYoutubeUrl')}
                    value={currentLangData.youtubeUrl}
                    onChange={(e) => handleInputChange(activeLanguageTab as 'sr' | 'de' | 'en', 'youtubeUrl', e.target.value)}
                  />
                  {currentLangData.youtubeUrl && extractYouTubeId(currentLangData.youtubeUrl) && (
                    <div className="mt-4">
                      <Button
                        onClick={() => openVideoModal(currentLangData.youtubeUrl, currentLangData.title || t('admin.upload.youtubePreview'))}
                        className="mb-2"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t('admin.upload.previewVideo')}
                      </Button>
                      <div className="relative aspect-video">
                        <img
                          src={`https://img.youtube.com/vi/${extractYouTubeId(currentLangData.youtubeUrl)}/mqdefault.jpg`}
                          alt={t('admin.upload.youtubeThumbnail')}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                          <Play className="h-12 w-12 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="is-published">{t('admin.published')}</Label>
              <Button
                id="is-published"
                variant={episodeData.isPublished ? "default" : "outline"}
                onClick={() => setEpisodeData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                className="w-24"
              >
                {episodeData.isPublished ? t('admin.published') : t('admin.panel.draft')}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                {t('admin.cancel')}
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading || !episodeData.sr.title || !episodeData.de.title || !episodeData.en.title || !currentLangData.section} 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    {t('admin.upload.uploading')}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {t('admin.save')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.videoUrl}
        title={videoModal.title}
      />
    </>
  );
};