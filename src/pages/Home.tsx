import Navigation from '@/components/layout/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedEpisodes from '@/components/sections/FeaturedEpisodes';
import Footer from '@/components/layout/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedEpisodes />
      </main>
      <Footer />
    </div>
  );
};

export default Home;