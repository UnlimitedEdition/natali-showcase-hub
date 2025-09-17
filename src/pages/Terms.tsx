import React from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Terms() {
  const { t, language } = useLanguage();

  const getTermsContent = () => {
    switch (language) {
      case 'de':
        return {
          title: t('terms.title'),
          lastUpdated: 'Letzte Aktualisierung: Januar 2025',
          content: `
            <h2>1. Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für die Nutzung aller Services der Natalia Show (nachfolgend "Betreiber" oder "Website"), insbesondere für die Nutzung des Podcasts, des Online-Shops und aller damit verbundenen Inhalte.</p>

            <h2>2. Vertragsgegenstand</h2>
            <p>Der Betreiber stellt dem Nutzer eine Plattform zur Verfügung, auf der dieser Podcast-Inhalte konsumieren, Produkte erwerben und mit anderen Nutzern in Kontakt treten kann.</p>

            <h2>3. Vertragsschluss</h2>
            <p>Der Vertrag kommt mit Absenden der Bestellung durch den Nutzer und Annahme durch den Betreiber zustande. Der Betreiber behält sich vor, die Annahme der Bestellung innerhalb von 5 Werktagen zu bestätigen.</p>

            <h2>4. Registrierung</h2>
            <p>Einige Funktionen der Website erfordern eine Registrierung. Bei der Registrierung sind wahrheitsgemäße Angaben zu machen. Der Nutzer ist verpflichtet, seine Zugangsdaten geheim zu halten.</p>

            <h2>5. Nutzungsinhalte</h2>
            <p>Der Nutzer erhält ein einfaches, nicht übertragbares, nicht unterlizenzierbares, zeitlich unbeschränktes, räumlich auf die Bundesrepublik Deutschland begrenztes Nutzungsrecht an den auf der Website bereitgestellten Inhalten.</p>

            <h2>6. Haftung</h2>
            <p>Der Betreiber haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, bei grober Fahrlässigkeit und Vorsatz sowie bei zwingender Haftung nach dem Produkthaftungsgesetz.</p>

            <h2>7. Datenschutz</h2>
            <p>Die Erhebung, Verarbeitung und Nutzung personenbezogener Daten erfolgt nach den Bestimmungen der Datenschutzerklärung, die unter <a href="/privacy" class="text-primary hover:underline">Datenschutz</a> abrufbar ist.</p>

            <h2>8. Änderung der AGB</h2>
            <p>Der Betreiber behält sich das Recht vor, diese AGB jederzeit zu ändern. Die Änderungen werden dem Nutzer per E-Mail mitgeteilt.</p>

            <h2>9. Anwendbares Recht</h2>
            <p>Es gilt das Recht der Bundesrepublik Deutschland. Die Anwendung des UN-Kaufrechts ist ausgeschlossen.</p>

            <h2>10. Gerichtsstand</h2>
            <p>Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Belgrad, Serbien.</p>
          `
        };
      case 'sr':
        return {
          title: t('terms.title'),
          lastUpdated: 'Последње ажурирање: Јануар 2025',
          content: `
            <h2>1. Обим примене</h2>
            <p>Ови општи услови пословања (у даљем тексту: "ОУП") важе за коришћење свих услуга које нуди Natalia Show (у даљем тексту: "Оператер" или "Веб сајт"), посебно за коришћење подкаста, онлајн продавнице и свих повезаних садржаја.</p>

            <h2>2. Предмет уговора</h2>
            <p>Оператер кориснику омогућава платформу преко које може да конзумира садржаје подкаста, купује производе и комуницира са другим корисницима.</p>

            <h2>3. Закључење уговора</h2>
            <p>Уговор се закључује достављањем поруџбине од стране корисника и прихватањем од стране оператера. Оператер задржава право да потврди прихватање поруџбине у року од 5 радних дана.</p>

            <h2>4. Регистрација</h2>
            <p>Неке функције веб сајта захтевају регистрацију. Приликом регистрације неопходно је дати тачне податке. Корисник је дужан да чува своје податке за приступ у тајности.</p>

            <h2>5. Садржај коришћења</h2>
            <p>Корисник добија једноставно, непреносиво, неподлиценцирано, временски неограничено, просторно ограничено на територију Републике Србије право коришћења садржаја који се налазе на веб сајту.</p>

            <h2>6. Одговорност</h2>
            <p>Оператер одговара без ограничења за штету која настане услед повrede живота, тела или здравља, код грубе небрежње и намерног поступања, као и код обавезног одговорности према Закону о одговорности произвођача.</p>

            <h2>7. Заштита података</h2>
            <p>Прикупљање, обрада и коришћење личних података врши се у складу са одредбама Политике приватности, која је доступна на линку <a href="/privacy" class="text-primary hover:underline">Приватност</a>.</p>

            <h2>8. Измена ОУП</h2>
            <p>Оператер задржава право да измени ове ОУП у било ком тренутку. Промене ће бити достављене кориснику путем е-поште.</p>

            <h2>9. Примењиво право</h2>
            <p>Примењује се право Републике Србије. Примена УН конвенције о уговорима о купопродаји је искључена.</p>

            <h2>10. Судска надлежност</h2>
            <p>Судска надлежност за све спорове из овог уговора је Београд, Србија.</p>
          `
        };
      default: // English
        return {
          title: t('terms.title'),
          lastUpdated: 'Last updated: January 2025',
          content: `
            <h2>1. Scope</h2>
            <p>These General Terms and Conditions (hereinafter "GTC") apply to the use of all services provided by Natalia Show (hereinafter "Operator" or "Website"), in particular for the use of podcasts, the online shop and all related content.</p>

            <h2>2. Subject of contract</h2>
            <p>The operator provides the user with a platform on which he can consume podcast content, purchase products and interact with other users.</p>

            <h2>3. Conclusion of contract</h2>
            <p>The contract is concluded upon submission of the order by the user and acceptance by the operator. The operator reserves the right to confirm acceptance of the order within 5 working days.</p>

            <h2>4. Registration</h2>
            <p>Some functions of the website require registration. Accurate information must be provided during registration. The user is obliged to keep his access data secret.</p>

            <h2>5. Use content</h2>
            <p>The user receives a simple, non-transferable, non-sublicensable, unlimited in time, limited to the territory of the Republic of Serbia right to use the content provided on the website.</p>

            <h2>6. Liability</h2>
            <p>The operator is liable without limitation for damages arising from injury to life, body or health, in case of gross negligence and intent, as well as for mandatory liability under the Product Liability Act.</p>

            <h2>7. Data protection</h2>
            <p>The collection, processing and use of personal data is carried out in accordance with the provisions of the Privacy Policy, which can be accessed at <a href="/privacy" class="text-primary hover:underline">Privacy</a>.</p>

            <h2>8. Amendment of GTC</h2>
            <p>The operator reserves the right to change these GTC at any time. Changes will be communicated to the user by email.</p>

            <h2>9. Applicable law</h2>
            <p>The law of the Republic of Serbia applies. The application of the UN Convention on Contracts for the International Sale of Goods is excluded.</p>

            <h2>10. Jurisdiction</h2>
            <p>The jurisdiction for all disputes arising from this contract is Belgrade, Serbia.</p>
          `
        };
    }
  };

  const termsContent = getTermsContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {termsContent.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {termsContent.lastUpdated}
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div 
              dangerouslySetInnerHTML={{ __html: termsContent.content }}
              className="space-y-6"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}