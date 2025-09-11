import { ChefHat, Clock, Users, Star } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Kitchen = () => {
  const recipes = [
    {
      id: 1,
      title: "Tradicionalni Sarma",
      description: "Autentični recept za sarma koji se prenosi kroz generacije, sa posebnim savovima Natali.",
      time: "2 sata",
      difficulty: "Srednja",
      servings: "6-8",
      rating: 4.9,
      image: "🥬",
      category: "Tradicionalno"
    },
    {
      id: 2,
      title: "Mediteranski Risoto",
      description: "Kremasti risoto sa morskim plodovima, inspirisan putovanjima po Mediteranu.",
      time: "45 min",
      difficulty: "Teška",
      servings: "4",
      rating: 4.7,
      image: "🍤",
      category: "Italijansko"
    },
    {
      id: 3,
      title: "Domaći Hleb sa Začinima",
      description: "Jednostavan recept za aromatičan hleb koji će vaš dom ispuniti divnim mirisom.",
      time: "3 sata",
      difficulty: "Laka",
      servings: "1 vekna",
      rating: 4.8,
      image: "🍞",
      category: "Pekarski"
    },
    {
      id: 4,
      title: "Sezonska Salata sa Avokadom",
      description: "Osvežavajuća salata sa sezonskim voćem i povrćem, idealna za letnje dane.",
      time: "15 min",
      difficulty: "Laka",
      servings: "4",
      rating: 4.6,
      image: "🥑",
      category: "Zdravo"
    },
    {
      id: 5,
      title: "Čokoladni Fondant",
      description: "Dekadentan desert sa toplim čokoladnim centrom, savršen za posebne prilike.",
      time: "30 min",
      difficulty: "Teška",
      servings: "4",
      rating: 4.9,
      image: "🍫",
      category: "Desert"
    },
    {
      id: 6,
      title: "Balkanska Pita sa Sirom",
      description: "Klasična balkanska pita sa domaćim sirom i tankim korima.",
      time: "1.5 sata",
      difficulty: "Srednja",
      servings: "8",
      rating: 4.8,
      image: "🥧",
      category: "Tradicionalno"
    }
  ];

  const tips = [
    {
      title: "Kvalitet Začina",
      description: "Uvek koristite sveže začine za najbolji ukus. Zamenite ih svakih 6 meseci."
    },
    {
      title: "Temperatura Kuvanja",
      description: "Investirajte u dobar termometar za meso - temperatura je ključ uspešnog kuvanja."
    },
    {
      title: "Priprema Ingredients",
      description: "Uvek pripremite sve sastojke pre početka kuvanja. Ovo se zove 'mise en place'."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
            Natali Kuhinja
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Otkrijte svet ukusa kroz provjerene recepte, kulinarske savjete i priče o hrani koja spaja ljude.
          </p>
        </div>
      </section>

      {/* Featured Recipe */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="premium-card p-8 rounded-2xl mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-sm font-medium text-primary-glow bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
                  Recept Nedjelje
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bakin Kolač sa Šljivama
                </h2>
                <p className="text-muted-foreground mb-6 text-lg">
                  Autentični recept koji Natali čuva kao obiteljsku tajnu. Jednostavan, ali nevjrojatno ukusan kolač 
                  koji će vas vratiti u djetinjstvo.
                </p>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span>1 sat 15 min</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span>8-10 komada</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>4.9</span>
                  </div>
                </div>
                <Button variant="hero" size="lg">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Pogledaj Recept
                </Button>
              </div>
              <div className="text-center">
                <div className="text-9xl animate-float">🍰</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Svi Recepti
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Od tradicionalnih balkanih jela do internacionalnih specijaliteta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => (
              <Card key={recipe.id} className="episode-card group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                    <div className="text-4xl animate-float">{recipe.image}</div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-glow transition-colors">
                    {recipe.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {recipe.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {recipe.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {recipe.servings}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Težina: {recipe.difficulty}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {recipe.rating}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button variant="podcast" className="w-full group">
                    <ChefHat className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Pogledaj Recept
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cooking Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kulinarski Savjeti
            </h2>
            <p className="text-lg text-muted-foreground">
              Profesionalni savjeti koji će unaprediti vaše kulinarske vještine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="premium-card p-6 rounded-xl text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <h3 className="text-lg font-semibold mb-3 text-primary-glow">
                  {tip.title}
                </h3>
                <p className="text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Kitchen;