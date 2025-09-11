import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, Image, Video, Youtube } from 'lucide-react';

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
  
  // Form data
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [contentText, setContentText] = useState('');
  const [contentHtml, setContentHtml] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error", 
          description: "Image size must be less than 5MB",
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
      
      // For now, we'll use a placeholder URL since we haven't set up storage bucket
      // In production, you would upload to Supabase storage
      const publicUrl = URL.createObjectURL(file);
      
      toast({
        title: "Info",
        description: "Image preview created. In production, this would upload to cloud storage.",
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
          is_published: true
        }, {
          onConflict: 'page_key,section_key,language_code'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content uploaded successfully!",
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
        title: "Error",
        description: "Failed to save content",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Upload className="h-6 w-6 text-primary" />
            {t('admin.upload.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Text */}
          <div className="space-y-2">
            <Label htmlFor="content-text">Text Content</Label>
            <Textarea
              id="content-text"
              placeholder="Enter text content..."
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
                <Label htmlFor="image-upload">Upload Image</Label>
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
                    Choose Image
                  </Button>
                  {imageFile && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">{imageFile.name}</p>
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        className="max-w-full max-h-48 mx-auto mt-2 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                {videoUrl && (
                  <div className="mt-4">
                    <video
                      src={videoUrl}
                      controls
                      className="max-w-full max-h-48 mx-auto rounded-lg"
                      onError={() => toast({
                        title: "Error",
                        description: "Invalid video URL",
                        variant: "destructive"
                      })}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="youtube" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                {youtubeUrl && extractYouTubeId(youtubeUrl) && (
                  <div className="mt-4">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(youtubeUrl)}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full aspect-video rounded-lg"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* HTML Content */}
          <div className="space-y-2">
            <Label htmlFor="content-html">HTML Content (Optional)</Label>
            <Textarea
              id="content-html"
              placeholder="Enter HTML content for advanced formatting..."
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              {loading ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};