-- Upsert missing newsletter translations for all languages
-- Correct schema: key, language_code, value (no is_published column)
-- Run this in Supabase SQL editor

INSERT INTO translations (key, language_code, value)
VALUES 
  -- SR
  ('footer.newsletter.resend.description', 'sr', 'Novi link za potvrdu poslat na Vaš email.'),
  
  ('footer.newsletter.alreadyPending.title', 'sr', 'Čekamo potvrdu'),
  ('footer.newsletter.alreadyPending.description', 'sr', 'Čekamo Vašu potvrdu. Proverite email ili pokušajte kasnije.'),
  ('footer.newsletter.alreadySubscribed.title', 'sr', 'Već pretplaćeni'),
  ('footer.newsletter.alreadySubscribed.description', 'sr', 'Već ste pretplaćeni na newsletter. Možete se odjaviti u bilo kom trenutku.'),
  ('footer.newsletter.wasUnsubscribed.title', 'sr', 'Ranije odjavljeni'),
  ('footer.newsletter.wasUnsubscribed.description', 'sr', 'Ranije ste se odjavili od newsletter-a. Ako želite ponovo da se pretplatite, kliknite na dugme.'),
  
  ('footer.newsletter.emailLabel', 'sr', 'Unesite vašu email adresu'),
  ('footer.newsletter.consent', 'sr', 'Saglašavam se sa uslovima newsletter-a i želim primati nedeljne vesti (možete se odjaviti u bilo kom trenutku)'),
  ('footer.newsletter.submitting', 'sr', 'Pretplaćujem se...'),
  ('footer.newsletter.success.title', 'sr', 'Uspešno!'),
  ('footer.newsletter.success.description', 'sr', 'Proverite Vaš email za potvrdu pretplate. Link za potvrdu ističe za 24 sata.'),
  ('footer.newsletter.error.title', 'sr', 'Greška'),
  ('footer.newsletter.error.description', 'sr', 'Došlo je do greške prilikom pretplate. Pokušajte ponovo ili nas kontaktirajte direktno.'),
  
  -- DE
  ('footer.newsletter.resend.description', 'de', 'Neuer Bestätigungslink wurde an Ihre E-Mail gesendet.'),
  
  ('footer.newsletter.alreadyPending.title', 'de', 'Bestätigung ausstehend'),
  ('footer.newsletter.alreadyPending.description', 'de', 'Wir warten auf Ihre Bestätigung. Überprüfen Sie Ihre E-Mail oder versuchen Sie es später.'),
  ('footer.newsletter.alreadySubscribed.title', 'de', 'Bereits abonniert'),
  ('footer.newsletter.alreadySubscribed.description', 'de', 'Sie sind bereits für den Newsletter angemeldet. Sie können sich jederzeit abmelden.'),
  ('footer.newsletter.wasUnsubscribed.title', 'de', 'Kürzlich abbestellt'),
  ('footer.newsletter.wasUnsubscribed.description', 'de', 'Sie haben sich kürzlich vom Newsletter abgemeldet. Wenn Sie sich erneut anmelden möchten, klicken Sie auf die Schaltfläche.'),
  
  ('footer.newsletter.emailLabel', 'de', 'Geben Sie Ihre E-Mail-Adresse ein'),
  ('footer.newsletter.consent', 'de', 'Ich stimme den Newsletter-Bedingungen zu und möchte wöchentliche Neuigkeiten erhalten (kann jederzeit abbestellen)'),
  ('footer.newsletter.submitting', 'de', 'Abonnieren...'),
  ('footer.newsletter.success.title', 'de', 'Erfolgreich!'),
  ('footer.newsletter.success.description', 'de', 'Überprüfen Sie Ihre E-Mail für die Abonnementbestätigung. Der Bestätigungslink läuft in 24 Stunden ab.'),
  ('footer.newsletter.error.title', 'de', 'Fehler'),
  ('footer.newsletter.error.description', 'de', 'Es ist ein Fehler beim Abonnieren aufgetreten. Versuchen Sie es erneut oder kontaktieren Sie uns direkt.'),
  
  -- EN
  ('footer.newsletter.resend.description', 'en', 'New confirmation link sent to your email.'),
  
  ('footer.newsletter.alreadyPending.title', 'en', 'Confirmation Pending'),
  ('footer.newsletter.alreadyPending.description', 'en', 'We are waiting for your confirmation. Check your email or try later.'),
  ('footer.newsletter.alreadySubscribed.title', 'en', 'Already Subscribed'),
  ('footer.newsletter.alreadySubscribed.description', 'en', 'You are already subscribed to the newsletter. You can unsubscribe at any time.'),
  ('footer.newsletter.wasUnsubscribed.title', 'en', 'Recently Unsubscribed'),
  ('footer.newsletter.wasUnsubscribed.description', 'en', 'You recently unsubscribed from the newsletter. If you want to subscribe again, click the button.'),
  
  ('footer.newsletter.emailLabel', 'en', 'Enter your email address'),
  ('footer.newsletter.consent', 'en', 'I agree to the newsletter terms and want to receive weekly news (can unsubscribe anytime)'),
  ('footer.newsletter.submitting', 'en', 'Subscribing...'),
  ('footer.newsletter.success.title', 'en', 'Success!'),
  ('footer.newsletter.success.description', 'en', 'Check your email for subscription confirmation. The confirmation link expires in 24 hours.'),
  ('footer.newsletter.error.title', 'en', 'Error'),
  ('footer.newsletter.error.description', 'en', 'An error occurred during subscription. Please try again or contact us directly.')

ON CONFLICT (key, language_code)
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();