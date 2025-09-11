import { Play, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturedEpisodes = () => {
  const episodes = [
    {
      id: 1,
      title: "Putovanje kroz Mediteransku Kuhinju",
      description: "Otkrivamo tajne tradicionalnih recepata sa Natali i gošćom Marijom Petrović, poznatom kuvarkom.",
      duration: "45 min",
      date: "15. januar 2025",
      image: "🍝",
      category: "Kuhinja"
    },
    {
      id: 2,
      title: "Žensko Preduzetništvo u Srbiji",
      description: "Inspirativni razgovor sa uspešnim preduzetnicama o izazovima i pobedama u poslovnom svetu.",
      duration: "52 min",
      date: "12. januar 2025",
      image: "👩‍💼",
      category: "Priče"
    },
    {
      id: 3,
      title: "Wellness i Mentalno Zdravlje",
      description: "Dubinski razgovor o važnosti mentalnog zdravlja sa dr Anom Nikolić, poznatom psihologinjom.",
      duration: "38 min",
      date: "8. januar 2025",
      image: "🧘‍♀️",
      category: "Lifestyle"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Izdvojene Epizode
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Najnoviji razgovori koji inspirišu, edukuju i zabavljaju naše slušaoce širom regiona.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes.map((episode, index) => (
            <Card key={episode.id} className="episode-card group animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-primary-glow bg-primary/10 px-2 py-1 rounded-full">
                    {episode.category}
                  </span>
                  <div className="text-3xl animate-float">{episode.image}</div>
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Pogledaj Sve Epizode
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEpisodes;