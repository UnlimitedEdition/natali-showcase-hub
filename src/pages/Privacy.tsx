import React from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Privacy() {
  const { t, language } = useLanguage();

  const getPrivacyContent = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Datenschutzrichtlinie',
          lastUpdated: 'Zuletzt aktualisiert: Januar 2025',
          content: `
            <h2>1. Verantwortlicher</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p>Natali Show<br>
            E-Mail: privacy@natalishow.com</p>

            <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
            <p>Wir erheben und verwenden Ihre personenbezogenen Daten nur, soweit dies gesetzlich erlaubt ist oder Sie in die Datenerhebung einwilligen.</p>

            <h3>2.1 Beim Besuch unserer Website</h3>
            <p>Bei jedem Zugriff auf unsere Website werden automatisch Informationen erfasst. Diese Informationen, auch als Server-Logfiles bezeichnet, werden automatisch übermittelt:</p>
            <ul>
              <li>IP-Adresse des anfragenden Rechners</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Name und URL der abgerufenen Datei</li>
              <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
              <li>Verwendeter Browser und ggf. das Betriebssystem</li>
            </ul>

            <h3>2.2 Newsletter</h3>
            <p>Wenn Sie sich für unseren Newsletter anmelden, verwenden wir Ihre E-Mail-Adresse für die Zusendung des Newsletters. Die Anmeldung erfolgt im Double-Opt-In-Verfahren.</p>

            <h3>2.3 Cookies</h3>
            <p>Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Wir verwenden verschiedene Arten von Cookies:</p>
            <ul>
              <li><strong>Notwendige Cookies:</strong> Erforderlich für den Betrieb der Website</li>
              <li><strong>Analytische Cookies:</strong> Zur Verbesserung unserer Website</li>
              <li><strong>Marketing-Cookies:</strong> Für personalisierte Werbung</li>
            </ul>

            <h2>3. Rechtsgrundlage</h2>
            <p>Die Verarbeitung erfolgt auf Grundlage von:</p>
            <ul>
              <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
              <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
            </ul>

            <h2>4. Ihre Rechte</h2>
            <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
            <ul>
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
            </ul>

            <h2>5. Kontakt</h2>
            <p>Bei Fragen zum Datenschutz wenden Sie sich bitte an: privacy@natalishow.com</p>
          `
        };
      case 'sr':
        return {
          title: 'Politika privatnosti',
          lastUpdated: 'Poslednje ažuriranje: Januar 2025',
          content: `
            <h2>1. Odgovorno lice</h2>
            <p>Odgovorno za obradu podataka na ovom sajtu je:</p>
            <p>Natali Show<br>
            E-mail: privacy@natalishow.com</p>

            <h2>2. Prikupljanje i obrada ličnih podataka</h2>
            <p>Prikupljamo i koristimo vaše lične podatke samo kada je to zakonski dozvoljeno ili kada date pristanak.</p>

            <h3>2.1 Prilikom posete našem sajtu</h3>
            <p>Pri svakom pristupu našem sajtu automatski se prikupljaju informacije:</p>
            <ul>
              <li>IP adresa računara</li>
              <li>Datum i vreme pristupa</li>
              <li>Naziv i URL fajla</li>
              <li>Sajt sa kojeg dolazite</li>
              <li>Korišćeni pretraživač i operativni sistem</li>
            </ul>

            <h2>3. Vaša prava</h2>
            <p>Imate sledeća prava u vezi sa vašim ličnim podacima:</p>
            <ul>
              <li>Pravo na pristup podacima</li>
              <li>Pravo na ispravku</li>
              <li>Pravo na brisanje</li>
              <li>Pravo na ograničavanje obrade</li>
              <li>Pravo na prenosivost podataka</li>
            </ul>

            <h2>4. Kontakt</h2>
            <p>Za pitanja o privatnosti kontaktirajte nas: privacy@natalishow.com</p>
          `
        };
      default:
        return {
          title: 'Privacy Policy',
          lastUpdated: 'Last updated: January 2025',
          content: `
            <h2>1. Data Controller</h2>
            <p>The data controller for this website is:</p>
            <p>Natali Show<br>
            Email: privacy@natalishow.com</p>

            <h2>2. Collection and Processing of Personal Data</h2>
            <p>We collect and use your personal data only when legally permitted or when you consent to data collection.</p>

            <h3>2.1 When visiting our website</h3>
            <p>Information is automatically captured with each access to our website:</p>
            <ul>
              <li>IP address of the requesting computer</li>
              <li>Date and time of access</li>
              <li>Name and URL of the retrieved file</li>
              <li>Website from which access occurs (referrer URL)</li>
              <li>Browser used and operating system</li>
            </ul>

            <h2>3. Your Rights</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li>Right to access</li>
              <li>Right to rectification</li>
              <li>Right to erasure</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
            </ul>

            <h2>4. Contact</h2>
            <p>For privacy questions, please contact: privacy@natalishow.com</p>
          `
        };
    }
  };

  const privacyContent = getPrivacyContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {privacyContent.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {privacyContent.lastUpdated}
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div 
              dangerouslySetInnerHTML={{ __html: privacyContent.content }}
              className="space-y-6"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}