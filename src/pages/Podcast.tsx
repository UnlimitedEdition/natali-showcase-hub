import { useState } from 'react';
import { Search, Filter, Play, Clock, Calendar } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Podcast = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Kuhinja', 'Priče', 'Lifestyle', 'Intervju', 'Putovanja'];

  const episodes = [
    {
      id: 1,
      title: "Putovanje kroz Mediteransku Kuhinju",
      description: "Otkrivamo tajne tradicionalnih recepata sa Natali i gošćom Marijom Petrović.",
      duration: "45 min",
      date: "15. januar 2025",
      category: "Kuhinja",
      plays: "2.5K"
    },
    {
      id: 2,
      title: "Žensko Preduzetništvo u Srbiji",
      description: "Inspirativni razgovor sa uspešnim preduzetnicama o izazovima i pobedama.",
      duration: "52 min",
      date: "12. januar 2025",
      category: "Priče",
      plays: "3.1K"
    },
    {
      id: 3,
      title: "Wellness i Mentalno Zdravlje",
      description: "Dubinski razgovor o važnosti mentalnog zdravlja sa dr Anom Nikolić.",
      duration: "38 min",
      date: "8. januar 2025",
      category: "Lifestyle",
      plays: "4.2K"
    },
    {
      id: 4,
      title: "Tajne Uspešnog Brendiranja",
      description: "Kako izgraditi jak lični brend u digitalnom dobu sa Milanom Jovanović.",
      duration: "41 min",
      date: "5. januar 2025",
      category: "Intervju",
      plays: "1.8K"
    },
    {
      id: 5,
      title: "Skriveni Dragulji Balkana",
      description: "Putopis kroz neistražene destinacije sa travel blogerkom Anom Stojanović.",
      duration: "33 min",
      date: "1. januar 2025",
      category: "Putovanja",
      plays: "2.9K"
    },
    {
      id: 6,
      title: "Novi Početak: Resolutions 2025",
      description: "Kako postaviti i ostvariti ciljeve u novoj godini - praktični saveti.",
      duration: "29 min",
      date: "29. decembar 2024",
      category: "Lifestyle",
      plays: "5.1K"
    }
  ];

  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || episode.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
            Sve Epizode
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Istražite arhivu inspirativnih razgovora, kulinarskih avantura i životnih priča.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Pretražite epizode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "premium" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-6">
            Prikazano {filteredEpisodes.length} od {episodes.length} epizoda
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEpisodes.map((episode, index) => (
              <Card key={episode.id} className="episode-card group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-primary-glow bg-primary/10 px-2 py-1 rounded-full">
                      {episode.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {episode.plays} reprodukcija
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-glow transition-colors">
                    {episode.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {episode.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {episode.duration}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {episode.date}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button variant="podcast" className="w-full group">
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Slušaj Epizodu
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredEpisodes.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Nema epizoda koje odgovaraju vašoj pretrazi.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4"
              >
                Obriši filtere
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Podcast;