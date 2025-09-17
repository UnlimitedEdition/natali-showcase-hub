import React from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Cookies() {
  const { t, language } = useLanguage();

  const getCookiesContent = () => {
    switch (language) {
      case 'de':
        return {
          title: 'Cookie-Richtlinie',
          lastUpdated: 'Letzte Aktualisierung: Januar 2025',
          content: `
            <h2>1. Was sind Cookies?</h2>
            <p>Cookies sind kleine Textdateien, die von Websites auf Ihrem Computer oder Mobilgerät gespeichert werden, wenn Sie Websites besuchen. Sie werden weit verbreitet verwendet, um sicherzustellen, dass Websites ordnungsgemäß funktionieren, und um Informationen darüber bereitzustellen, wie Websites verwendet werden, was den Website-Betreibern hilft, deren Sites zu verbessern.</p>

            <h2>2. Wie verwenden wir Cookies?</h2>
            <p>Wir verwenden Cookies, um unsere Website zu betreiben und unsere Services bereitzustellen, sowie um Ihr Nutzererlebnis zu verbessern. Cookies helfen uns dabei:</p>
            <ul>
              <li>Zu verstehen, wie unsere Website genutzt wird</li>
              <li>Die Leistung unserer Website zu messen</li>
              <li>Das Nutzererlebnis zu verbessern</li>
              <li>Marketing zu personalisieren</li>
            </ul>

            <h2>3. Arten von Cookies, die wir verwenden</h2>
            
            <h3>Notwendige Cookies</h3>
            <p>Diese Cookies sind für das Funktionieren unserer Website unbedingt erforderlich. Sie ermöglichen es Ihnen, sich auf sichere Bereiche unserer Website zu bewegen und grundlegende Funktionen wie den Zugriff auf Ihr Benutzerkonto zu nutzen. Ohne diese Cookies können wir die von Ihnen angeforderten Services nicht bereitstellen.</p>
            
            <h3>Leistungs-Cookies</h3>
            <p>Diese Cookies sammeln Informationen darüber, wie Sie unsere Website nutzen, zum Beispiel welche Seiten Sie besuchen und auf welche Links Sie klicken. Alle Informationen, die diese Cookies sammeln, sind aggregiert und anonym. Sie dienen dazu, die Funktionsweise einer Website zu verbessern.</p>
            
            <h3>Funktionalitäts-Cookies</h3>
            <p>Diese Cookies ermöglichen es unserer Website, sich an Informationen zu erinnern, die Ihre Nutzung betreffen, wie Ihre Spracheinstellung oder Ihre Region. Sie helfen auch dabei, personalisierte Funktionen zu bieten, wie zum Beispiel das Speichern Ihrer Einstellungen.</p>
            
            <h3>Marketing-/Zielgruppen-Cookies</h3>
            <p>Diese Cookies werden verwendet, um Ihre Besuche auf unseren Websites zu verfolgen. Das Ziel besteht darin, Anzeigen anzuzeigen, die relevant und ansprechend für den einzelnen Benutzer sind und daher für Publisher und Werbetreibende von größerem Wert sind.</p>

            <h2>4. Verwaltung von Cookie-Einstellungen</h2>
            <p>Sie können Ihre Cookie-Einstellungen jederzeit über unser Cookie-Banner verwalten. Sie haben die Möglichkeit, bestimmte Arten von Cookies zu akzeptieren oder abzulehnen, oder alle Cookies zu deaktivieren. Bitte beachten Sie, dass das Deaktivieren einiger Cookies die Funktionalität unserer Website beeinträchtigen kann.</p>

            <h2>5. Änderungen dieser Cookie-Richtlinie</h2>
            <p>Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren. Wir empfehlen Ihnen, diese Seite regelmäßig auf Änderungen zu überprüfen. Änderungen dieser Cookie-Richtlinie treten sofort in Kraft, sobald sie auf dieser Seite veröffentlicht werden.</p>

            <h2>6. Kontakt</h2>
            <p>Wenn Sie Fragen zu unserer Cookie-Richtlinie haben, kontaktieren Sie uns bitte unter: privacy@nataliashow.com</p>
          `
        };
      case 'sr':
        return {
          title: 'Политика колачића',
          lastUpdated: 'Последње ажурирање: Јануар 2025',
          content: `
            <h2>1. Шта су колачићи?</h2>
            <p>Колачићи су мале текстуалне датотеке које се чувају на вашем рачунару или мобилном уређају када посећујете веб сајтове. Они се широко користе како би се осигурало исправно функционисање веб сајтова и пружиле информације о томе како се веб сајтови користе, што помаже власницима сајтова да побољшају своје сајтове.</p>

            <h2>2. Како користимо колачиће?</h2>
            <p>Користимо колачиће за покретање нашег сајта и пружање наших услуга, као и за побољшање вашег корисничког искуства. Колачићи нам помажу да:</p>
            <ul>
              <li>Разумемо како се наш сајт користи</li>
              <li>Меримо перформансе нашег сајта</li>
              <li>Побољшамо корисничко искуство</li>
              <li>Персонализујемо маркетинг</li>
            </ul>

            <h2>3. Врсте колачића које користимо</h2>
            
            <h3>Неопходни колачићи</h3>
            <p>Ови колачићи су неопходни за функционисање нашег сајта. Омогућавају вам да се крећете кроз безбедне делове нашег сајта и користите основне функције као што је приступ вашем корисничком налогу. Без ових колачића не можемо да пружимо услуге које сте тражили.</p>
            
            <h3>Перформансни колачићи</h3>
            <p>Ови колачићи прикупљају информације о томе како користите наш сајт, на пример које странице посећујете и на које линкове кликнете. Све информације које прикупљају ови колачићи су агреговане и анонимне. Оне служе за побољшање функционисања сајта.</p>
            
            <h3>Функционални колачићи</h3>
            <p>Ови колачићи омогућавају нашим сајтовима да се сете информација које се односе на вашу употребу, као што су поставке језика или ваш регион. Они такође помажу у пружању персонализованих функција, као што је чување ваших поставки.</p>
            
            <h3>Маркетиншки/таргетинг колачићи</h3>
            <p>Ови колачићи се користе за праћење ваших посета нашим сајтовима. Циљ је да приказују огласе који су релевантни и занимљиви за појединачног корисника и стога имају већу вредност за издаваче и оглашиваче.</p>

            <h2>4. Управљање поставкама колачића</h2>
            <p>Својим поставкама колачића можете да управљате у било које време преко нашег банера за колачиће. Имате могућност да прихватите или одбијете одређене врсте колачића или да онемогућите све колачиће. Имајте у виду да онемогућавање неких колачића може утицати на функционалност нашег сајта.</p>

            <h2>5. Промене ове политике колачића</h2>
            <p>Ову политику колачића можемо повремено ажурирати. Саветујемо вам да повремено проверавате ову страницу због промена. Промене ове политике колачића ступају на снагу одmah након објављивања на овој страници.</p>

            <h2>6. Контакт</h2>
            <p>Ако имате питања у вези са нашом политиком колачића, контактирајте нас на: privacy@nataliashow.com</p>
          `
        };
      default: // English
        return {
          title: 'Cookie Policy',
          lastUpdated: 'Last updated: January 2025',
          content: `
            <h2>1. What are cookies?</h2>
            <p>Cookies are small text files that are stored on your computer or mobile device when you visit websites. They are widely used to make websites work properly, and to provide information about how websites are used, which helps website owners improve their sites.</p>

            <h2>2. How do we use cookies?</h2>
            <p>We use cookies to operate our website and provide our services, as well as to improve your user experience. Cookies help us:</p>
            <ul>
              <li>Understand how our website is used</li>
              <li>Measure the performance of our website</li>
              <li>Improve the user experience</li>
              <li>Personalize marketing</li>
            </ul>

            <h2>3. Types of cookies we use</h2>
            
            <h3>Necessary cookies</h3>
            <p>These cookies are essential for our website to function. They enable you to move around secure areas of our website and use basic functions such as accessing your user account. Without these cookies, we cannot provide the services you have requested.</p>
            
            <h3>Performance cookies</h3>
            <p>These cookies collect information about how you use our website, for example which pages you visit and which links you click on. All information these cookies collect is aggregated and anonymous. They are used to improve how a website works.</p>
            
            <h3>Functionality cookies</h3>
            <p>These cookies allow our websites to remember information that relates to your use, such as your language preference or your region. They also help to provide personalized features, such as saving your settings.</p>
            
            <h3>Marketing/targeting cookies</h3>
            <p>These cookies are used to track your visits to our websites. The aim is to display ads that are relevant and engaging for the individual user and therefore more valuable for publishers and advertisers.</p>

            <h2>4. Managing cookie settings</h2>
            <p>You can manage your cookie settings at any time through our cookie banner. You have the option to accept or reject certain types of cookies, or to disable all cookies. Please note that disabling some cookies may affect the functionality of our website.</p>

            <h2>5. Changes to this cookie policy</h2>
            <p>We may update this cookie policy from time to time. We encourage you to review this page periodically for changes. Changes to this cookie policy take effect immediately upon posting on this page.</p>

            <h2>6. Contact</h2>
            <p>If you have questions about our cookie policy, please contact us at: privacy@nataliashow.com</p>
          `
        };
    }
  };

  const cookiesContent = getCookiesContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {cookiesContent.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {cookiesContent.lastUpdated}
            </p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div 
              dangerouslySetInnerHTML={{ __html: cookiesContent.content }}
              className="space-y-6"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}