import { Play, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="hero-section relative flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
            Natali Show
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dobrodošli u svet inspirativnih priča, kulinarskih avantura i 
            autentičnih razgovora koji menjaju perspektive.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="group">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Slušaj Najnoviju Epizodu
            </Button>
            <Button variant="premium" size="xl">
              <Calendar className="w-5 h-5 mr-2" />
              Zakaži Gosta
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="premium-card text-center p-6 rounded-xl">
              <div className="text-3xl font-bold text-primary-glow mb-2">200+</div>
              <div className="text-muted-foreground">Epizoda</div>
            </div>
            <div className="premium-card text-center p-6 rounded-xl">
              <div className="text-3xl font-bold text-secondary mb-2">50K+</div>
              <div className="text-muted-foreground">Slušalaca</div>
            </div>
            <div className="premium-card text-center p-6 rounded-xl">
              <div className="text-3xl font-bold text-primary-glow mb-2">3</div>
              <div className="text-muted-foreground">Jezika</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary-glow/20 rounded-full animate-float" />
      <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default HeroSection;