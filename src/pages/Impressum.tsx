import React from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Impressum() {
  const { language } = useLanguage();

  const getImpressumContent = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Impressum',
          lastUpdated: 'Letzte Aktualisierung: Januar 2025',
          content: `
            <h2>Angaben gemäß § 5 TMG</h2>
            <p><strong>Natalia Show</strong><br>
            vertreten durch Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Belgrad<br>
            Serbien</p>

            <h2>Kontakt</h2>
            <p>Telefon: +381 11 123 4567<br>
            E-Mail: info@nataliashow.com<br>
            Website: www.nataliashow.com</p>

            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Belgrad<br>
            Serbien</p>

            <h2>Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br>
            RS123456789</p>

            <h2>Redaktionell verantwortlich</h2>
            <p>Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Belgrad<br>
            Serbien</p>

            <h2>EU-Streitschlichtung</h2>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/.<br>
            Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>

            <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

            <h2>Haftung für Inhalte</h2>
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
            <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

            <h2>Haftung für Links</h2>
            <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p>
            <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

            <h2>Urheberrecht</h2>
            <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
            <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
          `
        };
      case 'sr':
        return {
          title: 'Импресум',
          lastUpdated: 'Последње ажурирање: Јануар 2025',
          content: `
            <h2>Подаци у складу са чланом 5. TMG</h2>
            <p><strong>Natalia Show</strong><br>
            заступник Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Београд<br>
            Србија</p>

            <h2>Контакт</h2>
            <p>Телефон: +381 11 123 4567<br>
            Е-пошта: info@nataliashow.com<br>
            Веб сајт: www.nataliashow.com</p>

            <h2>Одговоран за садржај према члану 55. став 2. RStV</h2>
            <p>Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Београд<br>
            Србија</p>

            <h2>ИД пореског обвезника</h2>
            <p>Идентификациони број пореског обвезника у складу са § 27 a закона о порезу на додату вредност:<br>
            RS123456789</p>

            <h2>Редакција</h2>
            <p>Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Београд<br>
            Србија</p>

            <h2>Решавање спорова унутар ЕУ</h2>
            <p>Европска комисија обезбеђује платформу за решавање спорова на мрежи (OS): https://ec.europa.eu/consumers/odr/.<br>
            Наша адреса електронске поште се налази у импресуму изнад.</p>

            <h2>Решавање потрошачких спорова / Универзално место за решавање спорова</h2>
            <p>Нисмо спремни нити имамо обавезу да учествујемо у поступцима решавања спорова пред потрошачким арбитражним телима.</p>

            <h2>Одговорност за садржај</h2>
            <p>Као давалац услуга, у складу са § 7 став 1. TMG, одговорни смо за сопствени садржај на овим страницама према општим законима. Према §§ 8 до 10. TMG, као давалац услуга нисмо обавезни да пратимо или истражујемо информације које су пренете или складиштене од стране трећих лица, нити да тражимо околности које указују на незакониту активност.</p>
            <p>Обавезе уклањања или блокирања коришћења информација према општим законима овиме нису додирнуте. Одговорност у том погледу је могућа тек од тренутка када се сазна за конкретно кршење закона. Када сазнамо за таква кршења закона, одмах ћемо уклонити тај садржај.</p>

            <h2>Одговорност за линкове</h2>
            <p>Наша понуда садржи линкове ка екстерним веб страницама трећих лица, на чији садржај немамо утицај. Због тога не можемо да преузмемо одговорност за те стране садржаје. За садржај повезаних страница одговоран је увек појединачни провајдер или оператер страница. Повезане странице су проверене у тренутку повезивања у погледу могућих кршења закона. Незаконити садржаји нису били препознатљиви у тренутку повезивања.</p>
            <p>Међутим, стална садржинска контрола повезаних страница је неразумна без конкретних наговештаја кршења закона. Када сазнамо за кршења закона, одмах ћемо уклонити такве линкове.</p>

            <h2>Ауторско право</h2>
            <p>Садржаји и дела направљена од стране оператера страница на овим страницама подлежу немачком закону о ауторским правима. Умножавање, обрађивање, ширење и свака употреба ван граница ауторског права захтевају писану сагласност одговарајућег аутора или творца. Преузимање и копирање ове странице дозвољено је само за приватну, некомерцијалну употребу.</p>
            <p>Уколико садржај на овој страници није направљен од стране оператера, поштовано је ауторско право трећих лица. Посебно су означени садржаји трећих лица. Уколико и поред тога будете уочили кршење ауторског права, молимо вас да нас обавестите. Када сазнамо за кршења закона, одмах ћемо уклонити тај садржај.</p>
          `
        };
      default: // English
        return {
          title: 'Legal Notice',
          lastUpdated: 'Last updated: January 2025',
          content: `
            <h2>Information according to § 5 TMG</h2>
            <p><strong>Natalia Show</strong><br>
            represented by Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Belgrade<br>
            Serbia</p>

            <h2>Contact</h2>
            <p>Phone: +381 11 123 4567<br>
            Email: info@nataliashow.com<br>
            Website: www.nataliashow.com</p>

            <h2>Responsible for content according to § 55 para. 2 RStV</h2>
            <p>Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Belgrade<br>
            Serbia</p>

            <h2>VAT ID</h2>
            <p>VAT identification number according to § 27 a VAT Act:<br>
            RS123456789</p>

            <h2>Editorially responsible</h2>
            <p>Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Belgrade<br>
            Serbia</p>

            <h2>EU dispute resolution</h2>
            <p>The European Commission provides a platform for online dispute resolution (ODR): https://ec.europa.eu/consumers/odr/.<br>
            Our email address can be found above in the imprint.</p>

            <h2>Consumer dispute resolution / Universal arbitration board</h2>
            <p>We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>

            <h2>Liability for content</h2>
            <p>As a service provider, we are responsible for our own content on these pages in accordance with § 7 para.1 TMG according to the general laws. According to §§ 8 to 10 TMG, however, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.</p>
            <p>Obligations to remove or block the use of information according to the general laws remain unaffected. However, liability in this regard is only possible from the point in time at which a concrete infringement of the law becomes known. If we become aware of corresponding legal violations, we will remove these contents immediately.</p>

            <h2>Liability for links</h2>
            <p>Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking.</p>
            <p>However, a permanent content control of the linked pages is not reasonable without concrete evidence of a legal violation. If we become aware of legal violations, we will remove such links immediately.</p>

            <h2>Copyright</h2>
            <p>The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, editing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.</p>
            <p>Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. If we become aware of legal violations, we will remove such content immediately.</p>
          `
        };
    }
  };

  const impressumContent = getImpressumContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {impressumContent.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {impressumContent.lastUpdated}
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div 
              dangerouslySetInnerHTML={{ __html: impressumContent.content }}
              className="space-y-6"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}