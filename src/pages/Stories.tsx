import { BookOpen, Heart, Users, Calendar } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Stories = () => {
  const stories = [
    {
      id: 1,
      title: "Putovanje Samoootkrića kroz Yoga",
      author: "Milica Jovanović",
      excerpt: "Kako sam kroz yoga pronašla sebe i svoju životnu misiju nakon godina traženja...",
      category: "Lični Rast",
      readTime: "8 min",
      date: "20. januar 2025",
      likes: 234,
      image: "🧘‍♀️"
    },
    {
      id: 2,
      title: "Od Korporacije do Svoje Firme",
      author: "Marko Petrović",
      excerpt: "Priča o tome kako sam napustio siguran posao i osnovao svoju IT kompaniju...",
      category: "Preduzetništvo",
      readTime: "12 min",
      date: "18. januar 2025",
      likes: 189,
      image: "💼"
    },
    {
      id: 3,
      title: "Majčinstvo Posle 40",
      author: "Ana Stojanović",
      excerpt: "Iskrena priča o izazovima i radostima postajanja majka u zrelijim godinama...",
      category: "Porodica",
      readTime: "10 min",
      date: "15. januar 2025",
      likes: 312,
      image: "👶"
    },
    {
      id: 4,
      title: "Borba protiv Anksioznosti",
      author: "Stefan Nikolić",
      excerpt: "Moj put ka mentalnom zdravlju i tehnike koje su mi pomogle da premostavim strahove...",
      category: "Mentalno Zdravlje",
      readTime: "15 min",
      date: "12. januar 2025",
      likes: 456,
      image: "🌱"
    },
    {
      id: 5,
      title: "Ljubav bez Granica",
      author: "Jovana i David",
      excerpt: "Kako smo se upoznali na različitim kontinentima i izgradili međunarodnu ljubav...",
      category: "Ljubav",
      readTime: "7 min",
      date: "10. januar 2025",
      likes: 178,
      image: "💕"
    },
    {
      id: 6,
      title: "Drugi Šansa u Karijeri",
      author: "Dragana Mitrović",
      excerpt: "Sa 45 godina sam promenila potpuno karijeru i postala uspešna umetnička...",
      category: "Karijera",
      readTime: "9 min",
      date: "8. januar 2025",
      likes: 267,
      image: "🎨"
    }
  ];

  const categories = ["Sve", "Lični Rast", "Preduzetništvo", "Porodica", "Mentalno Zdravlje", "Ljubav", "Karijera"];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
            Životne Priče
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Autentične priče naših slušalaca i gostiju koji dijele svoja iskustva, borbe i pobjede.
          </p>
        </div>
      </section>

      {/* Featured Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="premium-card p-8 rounded-2xl mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-sm font-medium text-primary-glow bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
                  Izdvojena Priča
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Transformacija kroz Nevoljue
                </h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Nevjerovatna priča Jelene Marković o tome kako je preživjela tešku bolest i pronašla 
                  novi smisao života kroz pomaganje drugima.
                </p>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span>20 min čitanja</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span>22. januar 2025</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    <span>892</span>
                  </div>
                </div>
                <Button variant="hero" size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Pročitaj Priču
                </Button>
              </div>
              <div className="text-center">
                <div className="text-9xl animate-float">🌟</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="hover:variant-premium"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <Card key={story.id} className="episode-card group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                      {story.category}
                    </span>
                    <div className="text-3xl animate-float">{story.image}</div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-glow transition-colors line-clamp-2">
                    {story.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    od {story.author}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {story.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {story.readTime}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {story.date}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1 text-red-500" />
                      {story.likes}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button variant="podcast" className="w-full group">
                    <BookOpen className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Pročitaj Više
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Učitaj Više Priča
            </Button>
          </div>
        </div>
      </section>

      {/* Submit Story CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Podijelite Svoju Priču
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Imate li inspirativnu priču koju želite podijeliti? Vaše iskustvo može pomoći i inspirisati druge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              <Users className="w-5 h-5 mr-2" />
              Pošaljite Priču
            </Button>
            <Button variant="outline" size="lg">
              Saznajte Više
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stories;