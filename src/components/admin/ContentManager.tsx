import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface ContentItem {
  page_key: string;
  hero_title_sr: string;
  hero_title_de: string;
  hero_title_en: string;
  hero_subtitle_sr: string;
  hero_subtitle_de: string;
  hero_subtitle_en: string;
}

interface ContentManagerProps {
  content: ContentItem[];
  loadingContent: boolean;
  saving: boolean;
  handleContentChange: (pageKey: string, field: string, value: string) => void;
  saveAllContent: () => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({
  content,
  loadingContent,
  saving,
  handleContentChange,
  saveAllContent
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Content</h2>
        <Button onClick={saveAllContent} disabled={saving || loadingContent} className="w-full sm:w-auto">
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
      {loadingContent ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6 flex-1 overflow-y-auto py-4">
          {content.map((item) => (
            <Card key={item.page_key} className="overflow-hidden">
              <CardHeader className="bg-muted">
                <CardTitle className="flex items-center justify-between">
                  <span>{item.page_key.charAt(0).toUpperCase() + item.page_key.slice(1)}</span>
                  <span className="text-sm font-normal bg-background px-2 py-1 rounded">ID: {item.page_key}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Hero Title */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Hero Title
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <span className="fi fi-rs mr-2"></span>
                        Serbian
                      </Label>
                      <Input
                        value={item.hero_title_sr}
                        onChange={(e) => handleContentChange(item.page_key, 'hero_title_sr', e.target.value)}
                        placeholder="Enter Serbian title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <span className="fi fi-de mr-2"></span>
                        German
                      </Label>
                      <Input
                        value={item.hero_title_de}
                        onChange={(e) => handleContentChange(item.page_key, 'hero_title_de', e.target.value)}
                        placeholder="Enter German title..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <span className="fi fi-us mr-2"></span>
                        English
                      </Label>
                      <Input
                        value={item.hero_title_en}
                        onChange={(e) => handleContentChange(item.page_key, 'hero_title_en', e.target.value)}
                        placeholder="Enter English title..."
                      />
                    </div>
                  </div>
                </div>
                
                {/* Hero Subtitle */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Hero Subtitle
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <span className="fi fi-rs mr-2"></span>
                        Serbian
                      </Label>
                      <Textarea
                        value={item.hero_subtitle_sr}
                        onChange={(e) => handleContentChange(item.page_key, 'hero_subtitle_sr', e.target.value)}
                        placeholder="Enter Serbian subtitle..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <span className="fi fi-de mr-2"></span>
                        German
                      </Label>
                      <Textarea
                        value={item.hero_subtitle_de}
                        onChange={(e) => handleContentChange(item.page_key, 'hero_subtitle_de', e.target.value)}
                        placeholder="Enter German subtitle..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <span className="fi fi-us mr-2"></span>
                        English
                      </Label>
                      <Textarea
                        value={item.hero_subtitle_en}
                        onChange={(e) => handleContentChange(item.page_key, 'hero_subtitle_en', e.target.value)}
                        placeholder="Enter English subtitle..."
                        rows={3}
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
  );
};

export default ContentManager;