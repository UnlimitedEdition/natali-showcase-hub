import { useState } from 'react';
import { Menu, X, Mic, Languages, Settings, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { useLanguage } from '@/contexts/LanguageContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { name: t('nav.home'), href: '/', en: t('nav.home'), de: t('nav.home') },
    { name: t('nav.podcast'), href: '/podcast', en: t('nav.podcast'), de: t('nav.podcast') },
    { name: t('nav.kitchen'), href: '/kitchen', en: t('nav.kitchen'), de: t('nav.kitchen') },
    { name: t('nav.stories'), href: '/stories', en: t('nav.stories'), de: t('nav.stories') },
    { name: t('nav.contact'), href: '/contact', en: t('nav.contact'), de: t('nav.contact') },
  ];

  const languages = [
    { code: 'sr', name: 'SR', label: t('admin.language.sr') },
    { code: 'de', name: 'DE', label: t('admin.language.de') },
    { code: 'en', name: 'EN', label: t('admin.language.en') }
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'sr' | 'de' | 'en');
    setIsLanguageSelectorOpen(false);
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Natalia Show Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Natalia Show
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
            
            {/* Admin Panel Button - Only visible to admins/editors/supers */}
            {isAdmin && <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdminPanelOpen(true)}
              className="space-x-1"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Button>}
            
            {/* Database Inspector Button - Only visible to admins/supers, log visibility */}
            {isAdmin && (
              console.log('[Nav] Checking DB button for isSuperAdmin'),
              <Link to="/database-inspector">
                <Button
                  variant="ghost"
                  size="sm"
                  className="space-x-1"
                >
                  <Database className="w-4 h-4" />
                  <span>DB</span>
                </Button>
              </Link>
            )}
            
            {/* Language Selector */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="space-x-1"
                onClick={() => setIsLanguageSelectorOpen(!isLanguageSelectorOpen)}
              >
                <Languages className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </Button>
              
              {isLanguageSelectorOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          language === lang.code 
                            ? 'bg-accent text-accent-foreground' 
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        {lang.label} ({lang.name})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              {isAdmin && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsAdminPanelOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-foreground hover:text-primary-glow hover:bg-accent/10 rounded-md transition-colors flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Admin Panel</span>
                </button>
              )}
              {isAdmin && (
                <Link
                  to="/database-inspector"
                  className="block px-3 py-2 text-foreground hover:text-primary-glow hover:bg-accent/10 rounded-md transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Database className="w-4 h-4 mr-2" />
                  <span>Database Inspector</span>
                </Link>
              )}
              <div className="px-3 py-2 border-t border-border mt-2 pt-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">Jezik / Language</div>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={language === lang.code ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Admin Panel */}
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </nav>
  );
};

export default Navigation;