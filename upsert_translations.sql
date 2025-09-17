
-- PUN SQL za dodavanje/ ažuriranje nedostajućih prevoda u translations tabelu
-- Koristi UPSERT (INSERT ON CONFLICT) da izbegne duplikate i ažurira ako postoji
-- Izvrši ovo u Supabase Dashboard > SQL Editor
-- Ovo neće obrisati postojeće podatke, samo će dodati ili ažurirati missing ključeve
-- Bazirano na check_translations.mjs output-u (SR: 73, DE: 39, EN: 198)

-- SR TRANSLATIONS (73 missing)
INSERT INTO translations (key, language_code, value) VALUES ('common.error', 'sr', 'Greška') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('common.success', 'sr', 'Uspešno') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('common.warning', 'sr', 'Upozorenje') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('navigation.home', 'sr', 'Početna') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('navigation.podcast', 'sr', 'Podcast') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('navigation.kitchen', 'sr', 'Kuhinja') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('navigation.stories', 'sr', 'Priče') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('navigation.contact', 'sr', 'Kontakt') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('home.title', 'sr', 'Dobrodošli u Natali Show') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('home.subtitle', 'sr', 'Elegantan podcast o životu, kuvanju i inspirativnim pričama') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('home.latestEpisode', 'sr', 'Najnovija Epizoda') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('home.episodes', 'sr', 'Epizoda') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('home.listeners', 'sr', 'Slušalaца') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('home.languages', 'sr', 'Jezika') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.title', 'sr', 'Podcast Epizode') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.subtitle', 'sr', 'Slušajte naše najnovije epizode') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.searchPlaceholder', 'sr', 'Pretraži epizode...') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.filter', 'sr', 'Filter') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.categories.all', 'sr', 'Sve Kategorije') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.categories.kitchen', 'sr', 'Kuhinja') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.categories.stories', 'sr', 'Priče') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.categories.lifestyle', 'sr', 'Životni Stil') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.categories.interview', 'sr', 'Intervju') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.categories.travel', 'sr', 'Putovanja') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.noEpisodes', 'sr', 'Nema pronađenih epizoda') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.noEpisodesDescription', 'sr', 'Trenutno nema dostupnih epizoda. Vratite se kasnije za novi sadržaj.') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.watchNow', 'sr', 'Gledaj Sada') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.hero.title', 'sr', 'Podcast') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.hero.subtitle', 'sr', 'Slušajte naše najnovije epizode') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.watchVideo', 'sr', 'Gledaj Video') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.videoThumbnail', 'sr', 'Video minijatura') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.contentImage', 'sr', 'Slika sadržaja') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.watchEpisode', 'sr', 'Gledaj Epizodu') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.episodeThumbnail', 'sr', 'Minijatura epizode') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('podcast.about.title', 'sr', 'O Podcastu') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('kitchen.hero.title', 'sr', 'Kuhinja') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('kitchen.hero.subtitle', 'sr', 'Ukusni recepti i saveti za kuvanje') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('kitchen.searchPlaceholder', 'sr', 'Pretraži recepte...') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('kitchen.watchEpisode', 'sr', 'Gledaj Epizodu') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('kitchen.episodeThumbnail', 'sr', 'Minijatura epizode') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('kitchen.episodes.title', 'sr', 'Epizode o kuvanju') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('stories.hero.title', 'sr', 'Priče') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('stories.hero.subtitle', 'sr', 'Inspirativne priče i životna iskustva') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('stories.searchPlaceholder', 'sr', 'Pretraži priče...') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('stories.about.title', 'sr', 'O pričama') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('stories.stories.title', 'sr', 'Priče') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('contact.form.submitting', 'sr', 'Šalje se...') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('contact.form.success', 'sr', 'Poruka uspešno poslata! Javljamo se uskoro.') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('contact.form.error', 'sr', 'Neuspešno slanje poruke. Pokušajte ponovo.') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('admin.episodes', 'sr', 'Epizode') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('admin.users.title', 'sr', 'Upravljanje korisnicima') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('admin.users.guestRequests', 'sr', 'Zahtevi za gosta') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code, value) VALUES ('admin.users.totalRequests', 'sr', 'ukupno zahteva') ON CONFLICT (key, language_code) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
INSERT INTO translations (key, language_code,