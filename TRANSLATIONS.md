# Sistem prevoda

## Struktura

Prevodi se čuvaju u dva mesta:
1. Lokalni JSON fajlovi u `src/locales/` direktorijumu (fallback mehanizam)
2. Tabela `translations` u Supabase bazi podataka (primarni izvor)

## Format prevoda

Prevodi su organizovani u hijerarhijsku strukturu sa tačkom kao separatorom:
```
"common": {
  "save": "Sačuvaj",
  "cancel": "Otkaži"
}
```

Pristupa se pomoću `t('common.save')`

## Dodavanje novih prevoda

1. Dodajte prevode u sve tri jezičke datoteke:
   - `src/locales/sr.json` (srpski)
   - `src/locales/de.json` (nemački)
   - `src/locales/en.json` (engleski)

2. Pokrenite migraciju:
   ```bash
   node migrate_translations.mjs
   ```

3. Izvršite generisani SQL u Supabase editoru

## Korišćenje prevoda u komponentama

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { t, language, loading } = useLanguage();
  
  if (loading) return <div>Učitavanje...</div>;
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
};
```

## Fallback mehanizam

Ako prevodi nisu dostupni iz baze podataka, sistem automatski koristi lokalne fajlove.

## Ažuriranje prevoda

Prevode možete ažurirati direktno u Supabase bazi putem:
1. Database Inspector admin panela
2. SQL editora u Supabase dashboardu
3. API poziva sa odgovarajućim privilegijama

## Najbolje prakse

1. Uvek dodajte prevode za sva tri jezika
2. Koristite deskriptivne ključeve (npr. 'auth.signIn' umesto 'button1')
3. Testirajte sve jezike prilikom dodavanja novih funkcionalnosti
4. Redovno ažurirajte lokalne fajlove kao backup