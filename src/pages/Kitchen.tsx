// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { VideoModal } from '@/components/VideoModal';
import { Search, Play, Users, Calendar, BookOpen, Heart, ChevronDown } from 'lucide-react';

type ContentItem = Database['public']['Tables']['content']['Row'];

interface Episode {
  id: string;
  title?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  read_time?: string;
  likes?: number;
  category?: string;
  media_url?: string;
  media_type?: string;
  content_text?: string;
  content_html?: string;
}

interface Recipe {
  id: string;
  title?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  read_time?: string;
  likes?: number;
  category?: string;
  media_url?: string;
  media_type?: string;
  content_text?: string;
  content_html?: string;
}

const Kitchen = () => {
  const { t, language } = useLanguage();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: '',
    title: ''
  });
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const observer = useRef<IntersectionObserver | null>(null);
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  // State for pagination
  const [visibleEpisodesCount, setVisibleEpisodesCount] = useState(6);
  const episodesPerPage = 6;

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('page_key', 'kitchen')
        .eq('language_code', language)
        .eq('is_published', true);

      if (error) throw error;
      setContent(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const fetchEpisodes = async () => {
    try {
      // Fetch episodes that either have 'kitchen' category or no category at all
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('language_code', language)
        .eq('is_published', true)
        .or('category.eq.kitchen,category.is.null')
        .order('episode_number', { ascending: true });

      if (error) throw error;
      setEpisodes(data as unknown as Episode[]);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('page_key', 'kitchen')
        .eq('section_key', 'recipe')
        .eq('language_code', language)
        .eq('is_published', true);

      if (error) throw error;
      setRecipes(data as unknown as Recipe[]);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const getContentBySection = (sectionKey: string) => {
    const item = content.find(item => item.section_key === sectionKey);
    return item ? item.content_text : null;
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

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Format date based on language
    switch (language) {
      case 'sr':
        return date.toLocaleDateString('sr-RS', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }).replace(/\./g, '');
      case 'de':
        return date.toLocaleDateString('de-DE', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      default:
        return date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
    }
  };

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // Set a 500ms timer before marking as visible
        const timer = setTimeout(() => {
          setVisibleItems(prev => new Set(prev).add(id));
        }, 500);
        timerRefs.current.set(id, timer);
      } else {
        const id = entry.target.id;
        // Clear timer if element exits viewport before 500ms
        if (timerRefs.current.has(id)) {
          clearTimeout(timerRefs.current.get(id)!);
          timerRefs.current.delete(id);
        }
      }
    });
  };

  const loadMoreEpisodes = () => {
    setVisibleEpisodesCount(prevCount => prevCount + episodesPerPage);
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1
    });

    return () => {
      observer.current?.disconnect();
      // Clear all timers
      timerRefs.current.forEach(timer => clearTimeout(timer));
      timerRefs.current.clear();
    };
  }, []);

  useEffect(() => {
    fetchContent();
    fetchEpisodes();
    fetchRecipes();
  }, [language]);

  const filteredEpisodes = episodes.filter(episode => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchesSearch = (episode as any).title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                         ((episode as any).description && (episode as any).description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Get only the visible episodes based on the current count
  const visibleEpisodes = filteredEpisodes.slice(0, visibleEpisodesCount);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-pulse h-16 bg-gray-200 rounded w-64 mx-auto mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32 mx-auto max-w-4xl"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <img 
              src="/logo.png" 
              alt="Natalia Show Logo" 
              width="64"
              height="64"
              className="w-16 h-16 object-contain mr-4"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {getContentBySection('hero_title') || t('kitchen.title')}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto min-h-[3rem]">
            {getContentBySection('hero_subtitle') || t('kitchen.subtitle')}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-3">
              <div className="prose max-w-none">
                {content
                  .filter(item => item.section_key === 'content')
                  .map(item => (
                    <div key={item.id} className="mb-8">
                      {item.content_html ? (
                        <div dangerouslySetInnerHTML={{ __html: item.content_html }} />
                      ) : (
                        <p className="text-lg">{item.content_text}</p>
                      )}
                      
                      {item.media_url && item.media_type === 'youtube' && (
                        <div className="mt-6">
                          <Button 
                            onClick={() => openVideoModal(item.media_url!, item.content_text || t('kitchen.watchVideo'))}
                            className="flex items-center gap-2 mb-4"
                          >
                            <Play className="h-5 w-5" />
                            {t('kitchen.watchVideo')}
                          </Button>
                          <div 
                            className="relative aspect-video bg-muted rounded-lg cursor-pointer"
                            onClick={() => openVideoModal(item.media_url!, item.content_text || t('kitchen.watchVideo'))}
                            ref={el => {
                              if (el) {
                                observer.current?.observe(el);
                                el.id = `content-video-${item.id}`;
                              }
                            }}
                          >
                            {visibleItems.has(`content-video-${item.id}`) && (
                              <img 
                                src={`https://img.youtube.com/vi/${extractYouTubeId(item.media_url!)!}/mqdefault.jpg`} 
                                alt={item.content_text || t('kitchen.videoThumbnail')}
                                width="320"
                                height="180"
                                loading="lazy"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            )}
                            {!visibleItems.has(`content-video-${item.id}`) && (
                              <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                              <Play className="h-12 w-12 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {item.media_url && item.media_type === 'image' && (
                        <img 
                          src={item.media_url} 
                          alt={item.content_text || t('kitchen.contentImage')}
                          className="w-full h-auto rounded-lg mt-6"
                        />
                      )}
                      
                      {item.media_url && item.media_type === 'video' && (
                        <div className="mt-6">
                          <video 
                            src={item.media_url} 
                            controls 
                            className="w-full rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-background border-b">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('kitchen.searchPlaceholder')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredEpisodes.length === 0 ? (
            <div className="text-center py-12">
              <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('podcast.noEpisodes')}</h3>
              <p className="text-muted-foreground">{t('podcast.noEpisodesDescription')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleEpisodes.map((episode) => (
                <Card key={episode.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (episode as any).youtube_url && extractYouTubeId((episode as any).youtube_url) && (
                    <div 
                      className="relative aspect-video bg-muted cursor-pointer"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onClick={() => openVideoModal((episode as any).youtube_url, (episode as any).title)}
                      ref={el => {
                        if (el) {
                          observer.current?.observe(el);
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          el.id = `episode-video-${(episode as any).id}`;
                        }
                      }}
                    >
                      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                      visibleItems.has(`episode-video-${(episode as any).id}`) ? (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <img 
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          src={`https://img.youtube.com/vi/${extractYouTubeId((episode as any).youtube_url)}/mqdefault.jpg`} 
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          alt={(episode as any).title}
                          width="320"
                          height="180"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted animate-pulse" />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="bg-primary/90 rounded-full p-3 hover:bg-primary transition-colors">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <CardTitle className="line-clamp-2">{(episode as any).title}</CardTitle>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (episode as any).description && (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (episode as any).description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (episode as any).author && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (episode as any).author}
                        </div>
                      )}
                      
                      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (episode as any).created_at && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                          formatDate((episode as any).created_at)}
                        </div>
                      )}
                      
                      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (episode as any).read_time && (
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (episode as any).read_time}
                        </div>
                      )}
                      
                      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (episode as any).likes && (
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                          {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (episode as any).likes}
                        </div>
                      )}
                    </div>
                    
                    {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (episode as any).category && (
                      <div className="text-sm px-2 py-1 bg-secondary/10 text-secondary rounded-full inline-block">
                        {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (episode as any).category}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onClick={() => openVideoModal((episode as any).youtube_url, (episode as any).title)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {t('podcast.watchNow')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {filteredEpisodes.length > visibleEpisodesCount && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMoreEpisodes}>
                {t('kitchen.loadMore')}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Recipes Section */}
      {recipes.length > 0 && (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('kitchen.recipes.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {recipe.media_url && recipe.media_type === 'youtube' && (
                    <div 
                      className="relative aspect-video bg-muted cursor-pointer"
                      onClick={() => openVideoModal(recipe.media_url!, recipe.title || t('kitchen.watchRecipe'))}
                      ref={el => {
                        if (el) {
                          observer.current?.observe(el);
                          el.id = `recipe-video-${recipe.id}`;
                        }
                      }}
                    >
                      {visibleItems.has(`recipe-video-${recipe.id}`) ? (
                        <img 
                          src={`https://img.youtube.com/vi/${extractYouTubeId(recipe.media_url)}/mqdefault.jpg`} 
                          alt={recipe.title || t('kitchen.recipeThumbnail')}
                          width="320"
                          height="180"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted animate-pulse" />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="h-10 w-10 text-white fill-white" />
                      </div>
                    </div>
                  )}
                  
                  {recipe.media_url && recipe.media_type === 'image' && (
                    <img 
                      src={recipe.media_url} 
                      alt={recipe.title || t('kitchen.recipeImage')}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  <CardHeader>
                    <CardTitle>{recipe.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {recipe.excerpt && (
                      <p className="text-muted-foreground">{recipe.excerpt}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {recipe.author && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {recipe.author}
                        </div>
                      )}
                      
                      {recipe.date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {recipe.date}
                        </div>
                      )}
                      
                      {recipe.read_time && (
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {recipe.read_time}
                        </div>
                      )}
                      
                      {recipe.likes && (
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                          {recipe.likes}
                        </div>
                      )}
                    </div>
                    
                    {recipe.category && (
                      <div className="text-sm px-2 py-1 bg-secondary/10 text-secondary rounded-full inline-block">
                        {recipe.category}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    {recipe.media_url && recipe.media_type === 'youtube' && (
                      <Button 
                        className="w-full"
                        onClick={() => openVideoModal(recipe.media_url!, recipe.title || t('kitchen.watchRecipe'))}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t('kitchen.watchRecipe')}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.videoUrl}
        title={videoModal.title}
      />
    </div>
  );
};

export default Kitchen;