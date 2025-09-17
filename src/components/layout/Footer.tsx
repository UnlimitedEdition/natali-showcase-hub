import React, { useState } from 'react';
import { Heart, Mail, Phone, MapPin, Instagram, Youtube, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jednostavna UUID v4 generacija za browser kompatibilnost
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const consentChecked = formData.get('consent');

    if (!email || !consentChecked) {
      toast({
        title: t('footer.newsletter.error.title') || "Greška",
        description: t('footer.newsletter.error.description') || "Molimo Vas da unesete email i potvrdite saglasnost sa uslovima.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Proveri da li email već postoji
      const { data: existing, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('id, status')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError; // PGRST116 = no rows

      const newToken = generateUUID();
      let successMessage = t('footer.newsletter.success.description') || "Proverite Vaš email za potvrdu pretplate. Link za potvrdu ističe za 24 sata.";

      if (existing) {
        // Update postojećeg sa novim token-om i pending status-om
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'pending',
            subscribed_at: new Date().toISOString(),
            unsub_token: newToken
          })
          .eq('email', email);

        if (updateError) throw updateError;

        successMessage = t('footer.newsletter.resend.description') || "Novi link za potvrdu poslat na Vaš email.";
      } else {
        // Insert novi
        const id = generateUUID();
        const { error: insertError } = await supabase
          .from('newsletter_subscribers')
          .insert({
            id,
            email,
            status: 'pending',
            subscribed_at: new Date().toISOString(),
            unsub_token: newToken
          });

        if (insertError) throw insertError;
      }

      // TODO: Integrisati slanje email-a sa potvrdnim linkom koristeći edge function
      // await fetch('/functions/v1/send-confirmation', {
      //   method: 'POST',
      //   body: JSON.stringify({ token: newToken, email, language })
      // });

      toast({
        title: t('footer.newsletter.success.title') || "Uspešno!",
        description: successMessage,
      });

      // Reset forme
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Greška pri pretplati na newsletter:', error);
      toast({
        title: t('footer.newsletter.error.title') || "Greška",
        description: t('footer.newsletter.error.description') || "Došlo je do greške prilikom pretplate. Pokušajte ponovo ili nas kontaktirajte direktno.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* About */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Natalia Show</h3>
              <p className="text-muted-foreground">
                {t('footer.about')}
              </p>
              <div className="flex space-x-3">
                <a href="https://www.instagram.com/natalijashow?igsh=MWRqMTF3eDJmZnJ2OQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                  <Button variant="premium" size="icon" className="rounded-full">
                    <Instagram className="w-5 h-5" />
                  </Button>
                </a>
                <a href="https://www.youtube.com/@NataliaShow26" target="_blank" rel="noopener noreferrer">
                  <Button variant="premium" size="icon" className="rounded-full">
                    <Youtube className="w-5 h-5" />
                  </Button>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61564248726605&mibextid=wwXIfr&rdid=cfu5kDJ9qbEkk0TW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17HLLzNVhN%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noopener noreferrer">
                  <Button variant="premium" size="icon" className="rounded-full">
                    <Facebook className="w-5 h-5" />
                  </Button>
                </a>
                <a href="https://www.tiktok.com/@natalia..show?_t=ZN-8zimvrQnWSM&_r=1" target="_blank" rel="noopener noreferrer">
                  <Button variant="premium" size="icon" className="rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.92a8.18 8.18 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.05z"/>
                    </svg>
                  </Button>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2">
                <li><a href="/podcast" className="text-muted-foreground hover:text-primary-glow transition-colors">{t('nav.podcast')}</a></li>
                <li><a href="/kitchen" className="text-muted-foreground hover:text-primary-glow transition-colors">{t('nav.kitchen')}</a></li>
                <li><a href="/stories" className="text-muted-foreground hover:text-primary-glow transition-colors">{t('nav.stories')}</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-primary-glow transition-colors">{t('nav.contact')}</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('footer.contact')}</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">hello@Nataliashow.rs</span>
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
              <h3 className="text-lg font-semibold text-foreground">{t('footer.newsletter.title')}</h3>
              <p className="text-muted-foreground">
                {t('footer.newsletter.description')}
              </p>
              <div className="space-y-2">
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div>
                    <Label htmlFor="newsletter-email" className="text-sm font-medium mb-1 block">
                      {t('footer.newsletter.emailLabel') || 'Email adresa'}
                    </Label>
                    <input
                      id="newsletter-email"
                      type="email"
                      name="email"
                      placeholder={t('footer.newsletter.placeholder')}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      className="rounded"
                      aria-label={t('footer.newsletter.consent') || 'Saglasnost sa uslovima newsletter-a'}
                    />
                    <Label htmlFor="consent" className="text-xs text-muted-foreground cursor-pointer">
                      {t('footer.newsletter.consent')}
                    </Label>
                  </div>
                  <Button type="submit" variant="premium" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t('footer.newsletter.submitting') : t('footer.newsletter.button')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="py-8 text-center text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center justify-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by Natalia Show</span>
            </div>
            <div>
              &copy; {currentYear} Natalia Show. {t('footer.copyright')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;