import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, Image, Video, Youtube, Play } from 'lucide-react';
import { VideoModal } from '@/components/VideoModal';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageKey: string;
  sectionKey: string;
  onUploadSuccess?: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  pageKey,
  sectionKey,
  onUploadSuccess
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [isPublished, setIsPublished] = useState(true);
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: '',
    title: ''
  });
  
  // Form data
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [contentText, setContentText] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setImageFile(null);
      setVideoUrl('');
      setYoutubeUrl('');
      setContentText('');
      setContentHtml('');
      setIsPublished(true);
      
      // Load existing content if it exists
      loadExistingContent();
    }
  }, [isOpen, pageKey, sectionKey, language]);

  const loadExistingContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('page_key', pageKey)
        .eq('section_key', sectionKey)
        .eq('language_code', language)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows" error
        throw error;
      }

      if (data) {
        setContentText(data.content_text || '');
        setContentHtml(data.content_html || '');
        setVideoUrl(data.media_type === 'video' ? (data.media_url || '') : '');
        setYoutubeUrl(data.media_type === 'youtube' ? (data.media_url || '') : '');
        setIsPublished(data.is_published);
        
        if (data.media_type === 'video') {
          setActiveTab('video');
        } else if (data.media_type === 'youtube') {
          setActiveTab('youtube');
        } else if (data.media_type === 'image') {
          setActiveTab('image');
        }
      }
    } catch (error) {
      console.error('Error loading existing content:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t('toast.error'), 
          description: t('toast.invalidImage'),
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('toast.error'), 
          description: t('toast.imageTooLarge'),
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageKey}_${sectionKey}_${Date.now()}.${fileExt}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('content')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        toast({
          title: t('toast.error'),
          description: t('toast.contentUploadFailed'),
          variant: "destructive"
        });
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(fileName);

      toast({
        title: t('toast.success'),
        description: t('toast.imagePreviewCreated'),
      });
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let mediaUrl = '';
      let mediaType = '';

      if (activeTab === 'image' && imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          mediaUrl = uploadedUrl;
          mediaType = 'image';
        }
      } else if (activeTab === 'video' && videoUrl) {
        mediaUrl = videoUrl;
        mediaType = 'video';
      } else if (activeTab === 'youtube' && youtubeUrl) {
        mediaUrl = youtubeUrl;
        mediaType = 'youtube';
      }

      // Save to database
      const { error } = await supabase
        .from('content')
        .upsert({
          page_key: pageKey,
          section_key: sectionKey,
          language_code: language,
          content_text: contentText || null,
          content_html: contentHtml || null,
          media_url: mediaUrl || null,
          media_type: mediaType || null,
          is_published: isPublished
        }, {
          onConflict: 'page_key,section_key,language_code'
        });

      if (error) throw error;

      toast({
        title: t('toast.success'),
        description: t('toast.contentUploaded'),
      });

      // Reset form
      setImageFile(null);
      setVideoUrl('');
      setYoutubeUrl('');
      setContentText('');
      setContentHtml('');
      
      onUploadSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: t('toast.error'),
        description: t('toast.contentUploadFailed'),
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="upload-modal-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <Upload className="h-6 w-6 text-primary" />
              {t('admin.upload.title')}
            </DialogTitle>
            <p id="upload-modal-description" className="sr-only">
              {t('admin.upload.description')}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Content Text */}
            <div className="space-y-2">
              <Label htmlFor="content-text">{t('admin.upload.textContent')}</Label>
              <Textarea
                id="content-text"
                placeholder={t('admin.upload.enterTextContent')}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                rows={3}
              />
            </div>

            {/* Media Upload Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  {t('admin.upload.image')}
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  {t('admin.upload.video')}
                </TabsTrigger>
                <TabsTrigger value="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  {t('admin.upload.youtube')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-upload">{t('admin.upload.image')}</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="mb-4"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t('admin.upload.imageUpload')}
                    </Button>
                    {imageFile && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">{imageFile.name}</p>
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt={t('admin.panel.preview')}
                          className="max-w-full max-h-48 mx-auto mt-2 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-url">{t('admin.upload.videoUrl')}</Label>
                  <Input
                    id="video-url"
                    type="url"
                    placeholder={t('admin.upload.enterVideoUrl')}
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  {videoUrl && (
                    <div className="mt-4">
                      <Button
                        onClick={() => openVideoModal(videoUrl, t('admin.upload.videoPreview'))}
                        className="mb-2"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t('admin.upload.previewVideo')}
                      </Button>
                      <video
                        src={videoUrl}
                        controls
                        className="max-w-full max-h-48 mx-auto rounded-lg"
                        onError={() => toast({
                          title: t('toast.error'),
                          description: t('toast.invalidVideoUrl'),
                          variant: "destructive"
                        })}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="youtube" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">{t('admin.upload.youtubeUrl')}</Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder={t('admin.upload.enterYoutubeUrl')}
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  {youtubeUrl && extractYouTubeId(youtubeUrl) && (
                    <div className="mt-4">
                      <Button
                        onClick={() => openVideoModal(youtubeUrl, t('admin.upload.youtubePreview'))}
                        className="mb-2"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t('admin.upload.previewVideo')}
                      </Button>
                      <div className="relative aspect-video">
                        <img
                          src={`https://img.youtube.com/vi/${extractYouTubeId(youtubeUrl)}/mqdefault.jpg`}
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

            {/* HTML Content */}
            <div className="space-y-2">
              <Label htmlFor="content-html">{t('admin.upload.htmlContentOptional')}</Label>
              <Textarea
                id="content-html"
                placeholder={t('admin.upload.enterHtmlContent')}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="is-published">{t('admin.published')}</Label>
              <Button
                id="is-published"
                variant={isPublished ? "default" : "outline"}
                onClick={() => setIsPublished(!isPublished)}
                className="w-24"
              >
                {isPublished ? t('admin.panel.published') : t('admin.panel.draft')}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading} 
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
                    {t('common.save')}
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