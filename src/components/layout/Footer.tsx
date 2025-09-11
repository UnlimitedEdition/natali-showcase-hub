import { Heart, Mail, Phone, MapPin, Instagram, Youtube, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* About */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Natali Show</h3>
              <p className="text-muted-foreground">
                Inspirativni podkast koji spaja priče, kuhinju i autentičnost. 
                Pridružite se našoj zajednici koja slavi raznolikost i kreativnost.
              </p>
              <div className="flex space-x-3">
                <Button variant="ghost" size="icon">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Youtube className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Facebook className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Brzi Linkovi</h3>
              <ul className="space-y-2">
                <li><a href="/podcast" className="text-muted-foreground hover:text-primary-glow transition-colors">Sve Epizode</a></li>
                <li><a href="/kitchen" className="text-muted-foreground hover:text-primary-glow transition-colors">Kulinarski Saveti</a></li>
                <li><a href="/stories" className="text-muted-foreground hover:text-primary-glow transition-colors">Gosti</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-primary-glow transition-colors">Kontakt</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Kontakt</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">hello@natalishow.rs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">+381 11 123 4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Beograd, Srbija</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Newsletter</h3>
              <p className="text-muted-foreground">
                Prijavite se za nedeljne novosti i ekskluzivni sadržaj.
              </p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Unesite email adresu"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="premium" className="w-full">
                  Prijavite se
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © {currentYear} Natali Show. Sva prava zadržana.
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-primary-glow transition-colors">Politika Privatnosti</a>
              <span>•</span>
              <a href="/terms" className="hover:text-primary-glow transition-colors">Uslovi Korišćenja</a>
              <span>•</span>
              <a href="/cookies" className="hover:text-primary-glow transition-colors">GDPR & Cookies</a>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              Napravljeno sa <Heart className="w-4 h-4 mx-1 text-red-500" /> u Srbiji
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;