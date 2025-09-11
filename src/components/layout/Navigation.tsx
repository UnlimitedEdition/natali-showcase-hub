import { useState } from 'react';
import { Menu, X, Mic, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Početna', href: '/', en: 'Home', de: 'Startseite' },
    { name: 'Podkast', href: '/podcast', en: 'Podcast', de: 'Podcast' },
    { name: 'Kuhinja', href: '/kitchen', en: 'Kitchen', de: 'Küche' },
    { name: 'Priče', href: '/stories', en: 'Stories', de: 'Geschichten' },
    { name: 'Kontakt', href: '/contact', en: 'Contact', de: 'Kontakt' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5 text-foreground" />
            </div>
            <div className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Natali Show
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-link ${
                  location.pathname === item.href ? 'active' : ''
                } text-foreground hover:text-primary-glow`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Language Selector */}
            <Button variant="ghost" size="sm" className="space-x-1">
              <Languages className="w-4 h-4" />
              <span>SR</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-lg rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-3 py-2 text-foreground hover:text-primary-glow hover:bg-accent/10 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 border-t border-border mt-2 pt-2">
                <Button variant="ghost" size="sm" className="w-full justify-start space-x-2">
                  <Languages className="w-4 h-4" />
                  <span>Jezik / Language</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;