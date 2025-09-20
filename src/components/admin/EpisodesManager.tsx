import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Edit, Plus, Languages, Globe } from 'lucide-react';
import { EpisodesUploadModal } from './EpisodesUploadModal';

interface Episode {
  id: string;
  title: string;
  description: string;
  language_code: string;
  youtube_url: string;
  is_published: boolean;
  created_at: string;
}

interface EpisodesManagerProps {
  groupedEpisodes: Record<string, Episode[]>;
  language: string;
  fetchEpisodes: () => void;
  togglePublished: (id: string, table: string, isPublished: boolean) => void;
}

const EpisodesManager: React.FC<EpisodesManagerProps> = ({
  groupedEpisodes,
  language,
  fetchEpisodes,
  togglePublished
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Episodes</h2>
        <Button onClick={() => { setEditingEpisodeId(null); setIsUploadModalOpen(true); }} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Upload New Episode
        </Button>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto py-4">
        {Object.values(groupedEpisodes).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex items-center justify-center h-full">
            <div>
              <div className="mx-auto h-12 w-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="mt-2">No episodes found</p>
              <p className="text-sm">Upload your first episode to get started</p>
            </div>
          </div>
        ) : (
          Object.values(groupedEpisodes).map((group) => {
            const id = group[0].id;
            const sample = group[0];
            const titles = group.map(ep => `${ep.language_code.toUpperCase()}: ${ep.title}`).join('\n');
            const description = group.find(ep => ep.language_code === language)?.description || group[0].description || 'No description';
            const languages = group.map(ep => ep.language_code).join(', ');

            return (
              <Card key={id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-lg">Episode ID: {id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${sample.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {sample.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground break-all">YouTube URL: {sample.youtube_url || 'None'}</p>
                        <div className="mt-2">
                          <strong className="flex items-center">
                            <Languages className="mr-1 h-4 w-4" />
                            Titles:
                          </strong>
                          <pre className="text-sm mt-1 p-2 bg-muted rounded whitespace-pre-wrap">{titles}</pre>
                        </div>
                        {description && (
                          <div className="mt-2">
                            <strong>Description ({language}):</strong>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
                          </div>
                        )}
                        <p className="text-sm mt-2 flex items-center">
                          <Globe className="mr-1 h-4 w-4" />
                          Languages: {languages}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted p-4 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(id, 'episodes', sample.is_published)}
                    >
                      {sample.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      <span className="ml-2">{sample.is_published ? 'Unpublish' : 'Publish'}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditingEpisodeId(id); setIsUploadModalOpen(true); }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="ml-2">Edit</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
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
    </div>
  );
};

export default EpisodesManager;