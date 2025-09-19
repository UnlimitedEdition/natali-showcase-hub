import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://flwkfhgnzcjlnrjaagxz.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Function to flatten nested objects
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
    } else {
      flattened[prefix + key] = obj[key];
    }
  }
  
  return flattened;
}

// Additional translations to add more content to the database
const additionalTranslations = {
  'en': {
    // Additional common translations
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.confirm': 'Confirm',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.share': 'Share',
    'common.print': 'Print',
    'common.copy': 'Copy',
    'common.paste': 'Paste',
    'common.cut': 'Cut',
    'common.undo': 'Undo',
    'common.redo': 'Redo',
    
    // Additional navigation translations
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.shop': 'Shop',
    'nav.events': 'Events',
    'nav.gallery': 'Gallery',
    'nav.team': 'Team',
    'nav.testimonials': 'Testimonials',
    'nav.faq': 'FAQ',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms of Service',
    'nav.cookies': 'Cookie Policy',
    
    // Additional home page translations
    'home.welcome': 'Welcome',
    'home.explore': 'Explore',
    'home.popular': 'Popular',
    'home.trending': 'Trending',
    'home.recommended': 'Recommended',
    'home.featured': 'Featured',
    'home.latest': 'Latest',
    'home.viewAll': 'View All',
    'home.readMore': 'Read More',
    'home.watchVideo': 'Watch Video',
    'home.subscribe': 'Subscribe',
    'home.newsletter': 'Newsletter',
    
    // Additional podcast translations
    'podcast.episode': 'Episode',
    'podcast.season': 'Season',
    'podcast.duration': 'Duration',
    'podcast.host': 'Host',
    'podcast.guest': 'Guest',
    'podcast.transcript': 'Transcript',
    'podcast.related': 'Related Episodes',
    'podcast.subscribe': 'Subscribe to Podcast',
    'podcast.rss': 'RSS Feed',
    'podcast.apple': 'Apple Podcasts',
    'podcast.spotify': 'Spotify',
    'podcast.google': 'Google Podcasts',
    
    // Additional kitchen translations
    'kitchen.ingredients': 'Ingredients',
    'kitchen.instructions': 'Instructions',
    'kitchen.prepTime': 'Prep Time',
    'kitchen.cookTime': 'Cook Time',
    'kitchen.totalTime': 'Total Time',
    'kitchen.difficulty': 'Difficulty',
    'kitchen.servings': 'Servings',
    'kitchen.nutrition': 'Nutrition',
    'kitchen.calories': 'Calories',
    'kitchen.protein': 'Protein',
    'kitchen.carbs': 'Carbs',
    'kitchen.fat': 'Fat',
    'kitchen.video': 'Recipe Video',
    'kitchen.photos': 'Recipe Photos',
    'kitchen.reviews': 'Reviews',
    'kitchen.rating': 'Rating',
    
    // Additional stories translations
    'stories.author': 'Author',
    'stories.date': 'Date',
    'stories.category': 'Category',
    'stories.tags': 'Tags',
    'stories.comments': 'Comments',
    'stories.related': 'Related Stories',
    'stories.share': 'Share Story',
    'stories.print': 'Print Story',
    
    // Additional contact translations
    'contact.subject': 'Subject',
    'contact.phone': 'Phone Number',
    'contact.company': 'Company',
    'contact.address': 'Address',
    'contact.city': 'City',
    'contact.state': 'State/Province',
    'contact.zip': 'ZIP/Postal Code',
    'contact.country': 'Country',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.sent': 'Message Sent',
    'contact.thanks': 'Thank you for your message!',
    
    // Additional admin translations
    'admin.dashboard': 'Dashboard',
    'admin.analytics': 'Analytics',
    'admin.reports': 'Reports',
    'admin.settings': 'Settings',
    'admin.profile': 'Profile',
    'admin.logout': 'Logout',
    'admin.login': 'Login',
    'admin.register': 'Register',
    'admin.forgot': 'Forgot Password',
    'admin.reset': 'Reset Password',
    
    // Additional footer translations
    'footer.company': 'Company',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',
    'footer.follow': 'Follow Us',
    'footer.subscribe': 'Subscribe to our newsletter',
    'footer.copyright': 'All rights reserved',
    
    // Additional auth translations
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.profile': 'Profile',
    'auth.account': 'Account',
    'auth.password': 'Password',
    'auth.email': 'Email Address',
    'auth.name': 'Full Name',
    'auth.remember': 'Remember Me',
    'auth.forgot': 'Forgot Your Password?',
  },
  
  'de': {
    // Additional common translations
    'common.yes': 'Ja',
    'common.no': 'Nein',
    'common.ok': 'OK',
    'common.confirm': 'Bestätigen',
    'common.continue': 'Weiter',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.finish': 'Fertig',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.download': 'Herunterladen',
    'common.upload': 'Hochladen',
    'common.share': 'Teilen',
    'common.print': 'Drucken',
    'common.copy': 'Kopieren',
    'common.paste': 'Einfügen',
    'common.cut': 'Ausschneiden',
    'common.undo': 'Rückgängig',
    'common.redo': 'Wiederholen',
    
    // Additional navigation translations
    'nav.about': 'Über uns',
    'nav.services': 'Dienstleistungen',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.shop': 'Shop',
    'nav.events': 'Veranstaltungen',
    'nav.gallery': 'Galerie',
    'nav.team': 'Team',
    'nav.testimonials': 'Referenzen',
    'nav.faq': 'FAQ',
    'nav.privacy': 'Datenschutz',
    'nav.terms': 'Allgemeine Geschäftsbedingungen',
    'nav.cookies': 'Cookie-Richtlinie',
    
    // Additional home page translations
    'home.welcome': 'Willkommen',
    'home.explore': 'Entdecken',
    'home.popular': 'Beliebt',
    'home.trending': 'Im Trend',
    'home.recommended': 'Empfohlen',
    'home.featured': 'Hervorgehoben',
    'home.latest': 'Neueste',
    'home.viewAll': 'Alle anzeigen',
    'home.readMore': 'Weiterlesen',
    'home.watchVideo': 'Video ansehen',
    'home.subscribe': 'Abonnieren',
    'home.newsletter': 'Newsletter',
    
    // Additional podcast translations
    'podcast.episode': 'Episode',
    'podcast.season': 'Staffel',
    'podcast.duration': 'Dauer',
    'podcast.host': 'Moderator',
    'podcast.guest': 'Gast',
    'podcast.transcript': 'Transkript',
    'podcast.related': 'Verwandte Episoden',
    'podcast.subscribe': 'Podcast abonnieren',
    'podcast.rss': 'RSS-Feed',
    'podcast.apple': 'Apple Podcasts',
    'podcast.spotify': 'Spotify',
    'podcast.google': 'Google Podcasts',
    
    // Additional kitchen translations
    'kitchen.ingredients': 'Zutaten',
    'kitchen.instructions': 'Anweisungen',
    'kitchen.prepTime': 'Vorbereitungszeit',
    'kitchen.cookTime': 'Kochzeit',
    'kitchen.totalTime': 'Gesamtzeit',
    'kitchen.difficulty': 'Schwierigkeit',
    'kitchen.servings': 'Portionen',
    'kitchen.nutrition': 'Nährwerte',
    'kitchen.calories': 'Kalorien',
    'kitchen.protein': 'Protein',
    'kitchen.carbs': 'Kohlenhydrate',
    'kitchen.fat': 'Fett',
    'kitchen.video': 'Rezeptvideo',
    'kitchen.photos': 'Rezeptfotos',
    'kitchen.reviews': 'Bewertungen',
    'kitchen.rating': 'Bewertung',
    
    // Additional stories translations
    'stories.author': 'Autor',
    'stories.date': 'Datum',
    'stories.category': 'Kategorie',
    'stories.tags': 'Tags',
    'stories.comments': 'Kommentare',
    'stories.related': 'Verwandte Geschichten',
    'stories.share': 'Geschichte teilen',
    'stories.print': 'Geschichte drucken',
    
    // Additional contact translations
    'contact.subject': 'Betreff',
    'contact.phone': 'Telefonnummer',
    'contact.company': 'Unternehmen',
    'contact.address': 'Adresse',
    'contact.city': 'Stadt',
    'contact.state': 'Bundesland',
    'contact.zip': 'PLZ',
    'contact.country': 'Land',
    'contact.message': 'Nachricht',
    'contact.send': 'Nachricht senden',
    'contact.sending': 'Wird gesendet...',
    'contact.sent': 'Nachricht gesendet',
    'contact.thanks': 'Vielen Dank für Ihre Nachricht!',
    
    // Additional admin translations
    'admin.dashboard': 'Dashboard',
    'admin.analytics': 'Analyse',
    'admin.reports': 'Berichte',
    'admin.settings': 'Einstellungen',
    'admin.profile': 'Profil',
    'admin.logout': 'Abmelden',
    'admin.login': 'Anmelden',
    'admin.register': 'Registrieren',
    'admin.forgot': 'Passwort vergessen',
    'admin.reset': 'Passwort zurücksetzen',
    
    // Additional footer translations
    'footer.company': 'Unternehmen',
    'footer.resources': 'Ressourcen',
    'footer.legal': 'Rechtliches',
    'footer.follow': 'Folgen Sie uns',
    'footer.subscribe': 'Abonnieren Sie unseren Newsletter',
    'footer.copyright': 'Alle Rechte vorbehalten',
    
    // Additional auth translations
    'auth.login': 'Anmelden',
    'auth.logout': 'Abmelden',
    'auth.register': 'Registrieren',
    'auth.profile': 'Profil',
    'auth.account': 'Konto',
    'auth.password': 'Passwort',
    'auth.email': 'E-Mail-Adresse',
    'auth.name': 'Vollständiger Name',
    'auth.remember': 'Angemeldet bleiben',
    'auth.forgot': 'Passwort vergessen?',
  },
  
  'sr': {
    // Additional common translations
    'common.yes': 'Da',
    'common.no': 'Ne',
    'common.ok': 'OK',
    'common.confirm': 'Potvrdi',
    'common.continue': 'Nastavi',
    'common.back': 'Nazad',
    'common.next': 'Sledeće',
    'common.previous': 'Prethodno',
    'common.finish': 'Završi',
    'common.search': 'Pretraži',
    'common.filter': 'Filtriraj',
    'common.sort': 'Sortiraj',
    'common.download': 'Preuzmi',
    'common.upload': 'Postavi',
    'common.share': 'Deli',
    'common.print': 'Štampaj',
    'common.copy': 'Kopiraj',
    'common.paste': 'Nalepi',
    'common.cut': 'Iseci',
    'common.undo': 'Poništi',
    'common.redo': 'Ponovi',
    
    // Additional navigation translations
    'nav.about': 'O nama',
    'nav.services': 'Usluge',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.shop': 'Prodavnica',
    'nav.events': 'Događaji',
    'nav.gallery': 'Galerija',
    'nav.team': 'Tim',
    'nav.testimonials': 'Preporuke',
    'nav.faq': 'Često postavljana pitanja',
    'nav.privacy': 'Politika privatnosti',
    'nav.terms': 'Uslovi korišćenja',
    'nav.cookies': 'Politika kolačića',
    
    // Additional home page translations
    'home.welcome': 'Dobrodošli',
    'home.explore': 'Istraži',
    'home.popular': 'Popularno',
    'home.trending': 'U trendu',
    'home.recommended': 'Preporučeno',
    'home.featured': 'Istaknuto',
    'home.latest': 'Najnovije',
    'home.viewAll': 'Prikaži sve',
    'home.readMore': 'Pročitaj više',
    'home.watchVideo': 'Pogledaj video',
    'home.subscribe': 'Pretplati se',
    'home.newsletter': 'Newsletter',
    
    // Additional podcast translations
    'podcast.episode': 'Epizoda',
    'podcast.season': 'Sezona',
    'podcast.duration': 'Trajanje',
    'podcast.host': 'Domaćin',
    'podcast.guest': 'Gost',
    'podcast.transcript': 'Transkript',
    'podcast.related': 'Povezane epizode',
    'podcast.subscribe': 'Pretplati se na podkast',
    'podcast.rss': 'RSS Feed',
    'podcast.apple': 'Apple Podcasts',
    'podcast.spotify': 'Spotify',
    'podcast.google': 'Google Podcasts',
    
    // Additional kitchen translations
    'kitchen.ingredients': 'Sastojci',
    'kitchen.instructions': 'Uputstva',
    'kitchen.prepTime': 'Vreme pripreme',
    'kitchen.cookTime': 'Vreme kuvanja',
    'kitchen.totalTime': 'Ukupno vreme',
    'kitchen.difficulty': 'Težina',
    'kitchen.servings': 'Porcije',
    'kitchen.nutrition': 'Nutritivne vrednosti',
    'kitchen.calories': 'Kalorije',
    'kitchen.protein': 'Proteini',
    'kitchen.carbs': 'Ugljeni hidrati',
    'kitchen.fat': 'Masti',
    'kitchen.video': 'Video recepta',
    'kitchen.photos': 'Fotografije recepta',
    'kitchen.reviews': 'Recenzije',
    'kitchen.rating': 'Ocena',
    
    // Additional stories translations
    'stories.author': 'Autor',
    'stories.date': 'Datum',
    'stories.category': 'Kategorija',
    'stories.tags': 'Tagovi',
    'stories.comments': 'Komentari',
    'stories.related': 'Povezane priče',
    'stories.share': 'Deli priču',
    'stories.print': 'Štampaj priču',
    
    // Additional contact translations
    'contact.subject': 'Naslov',
    'contact.phone': 'Broj telefona',
    'contact.company': 'Kompanija',
    'contact.address': 'Adresa',
    'contact.city': 'Grad',
    'contact.state': 'Država/Pokrajina',
    'contact.zip': 'Poštanski broj',
    'contact.country': 'Zemlja',
    'contact.message': 'Poruka',
    'contact.send': 'Pošalji poruku',
    'contact.sending': 'Slanje...',
    'contact.sent': 'Poruka poslata',
    'contact.thanks': 'Hvala vam na poruci!',
    
    // Additional admin translations
    'admin.dashboard': 'Kontrolna tabla',
    'admin.analytics': 'Analitika',
    'admin.reports': 'Izveštaji',
    'admin.settings': 'Podešavanja',
    'admin.profile': 'Profil',
    'admin.logout': 'Odjavi se',
    'admin.login': 'Prijavi se',
    'admin.register': 'Registruj se',
    'admin.forgot': 'Zaboravljena lozinka',
    'admin.reset': 'Resetuj lozinku',
    
    // Additional footer translations
    'footer.company': 'Kompanija',
    'footer.resources': 'Resursi',
    'footer.legal': 'Pravno',
    'footer.follow': 'Pratite nas',
    'footer.subscribe': 'Pretplatite se na naš newsletter',
    'footer.copyright': 'Sva prava zadržana',
    
    // Additional auth translations
    'auth.login': 'Prijavi se',
    'auth.logout': 'Odjavi se',
    'auth.register': 'Registruj se',
    'auth.profile': 'Profil',
    'auth.account': 'Nalog',
    'auth.password': 'Lozinka',
    'auth.email': 'Email adresa',
    'auth.name': 'Puno ime',
    'auth.remember': 'Zapamti me',
    'auth.forgot': 'Zaboravili ste lozinku?',
  }
};

async function addMoreTranslations() {
  console.log('Adding more translations to the database...');
  
  try {
    // Prepare data for insertion
    const translations = [];
    
    // Add English translations
    for (const key in additionalTranslations.en) {
      translations.push({
        key,
        language_code: 'en',
        value: additionalTranslations.en[key]
      });
    }
    
    // Add German translations
    for (const key in additionalTranslations.de) {
      translations.push({
        key,
        language_code: 'de',
        value: additionalTranslations.de[key]
      });
    }
    
    // Add Serbian translations
    for (const key in additionalTranslations.sr) {
      translations.push({
        key,
        language_code: 'sr',
        value: additionalTranslations.sr[key]
      });
    }
    
    console.log(`Prepared ${translations.length} additional translations for insertion`);
    
    // Insert translations into database
    console.log('Inserting translations...');
    const { data, error } = await supabase
      .from('translations')
      .insert(translations);
    
    if (error) {
      console.error('Error inserting translations:', error);
      return;
    }
    
    console.log(`Successfully added ${translations.length} translations to the database`);
  } catch (error) {
    console.error('Error during translation insertion:', error);
  }
}

addMoreTranslations().then(() => {
  console.log('Additional translations script completed.');
}).catch(err => {
  console.error('Error executing script:', err);
});