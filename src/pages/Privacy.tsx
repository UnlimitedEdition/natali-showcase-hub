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
          title: t('privacy.title'),
          lastUpdated: `${t('privacy.lastUpdated')}: Januar 2025`,
          content: `
            <h2>1. Verantwortlicher</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p><strong>Natalia Show</strong><br>
            Vertreten durch: Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Belgrad<br>
            Serbien</p>
            <p>E-Mail: privacy@nataliashow.com</p>

            <h2>2. Übersicht der Datenverarbeitung</h2>
            <p>Die folgende Übersicht fasst die Art der verarbeiteten Daten sowie die Zwecke der Verarbeitung zusammen:</p>
            
            <h3>Arten der verarbeiteten Daten</h3>
            <ul>
              <li>Bestandsdaten (z.B. Namen, Adressen)</li>
              <li>Kontaktdaten (z.B. E-Mail, Telefonnummern)</li>
              <li>Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos)</li>
              <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten)</li>
              <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
            </ul>
            
            <h3>Kategorien betroffener Personen</h3>
            <ul>
              <li>Kunden/Nutzer der Website</li>
              <li>Interessenten</li>
              <li>Geschäfts- und Vertragspartner</li>
              <li>Bewerber und Mitarbeiter</li>
            </ul>
            
            <h3>Zwecke der Verarbeitung</h3>
            <ul>
              <li>Bereitstellung des Onlineangebotes</li>
              <li>Kommunikation</li>
              <li>Sicherheitsmaßnahmen</li>
              <li>Betriebs- und Unterhaltungszwecke</li>
              <li>Direktmarketing (z.B. per E-Mail oder postalisch)</li>
              <li>Reichweitenmessung/Marketing</li>
            </ul>

            <h2>3. Maßgebliche Rechtsgrundlagen</h2>
            <p>Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten:</p>
            <ul>
              <li><strong>Einwilligung (Art. 6 Abs. 1 S. 1 lit. a DSGVO):</strong> Die betroffene Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten für einen spezifischen Zweck oder mehrere bestimmte Zwecke gegeben.</li>
              <li><strong>Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b DSGVO):</strong> Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.</li>
              <li><strong>Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f DSGVO):</strong> Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten erfordern, überwiegen.</li>
            </ul>

            <h2>4. Sicherheitsmaßnahmen</h2>
            <p>Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.</p>
            <p>Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.</p>

            <h2>5. Übermittlung von personenbezogenen Daten</h2>
            <p>Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass die Daten an andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder Personen übermittelt oder sie ihnen gegenüber offengelegt werden. Zu den Empfängern dieser Daten können z.B. mit IT-Aufgaben beauftragte Dienstleister oder Anbieter von Diensten und Inhalten, die in eine Website eingebunden werden, gehören. In solchen Fall beachten wir die gesetzlichen Vorgaben und schließen insbesondere entsprechende Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.</p>

            <h2>6. Datenverarbeitung in Drittländern</h2>
            <p>Sofern wir Daten in einem Drittland (d.h., außerhalb der Europäischen Union (EU), des Europäischen Wirtschaftsraums (EWR)) verarbeiten oder die Verarbeitung im Rahmen der Inanspruchnahme von Diensten Dritter oder der Offenlegung bzw. Übermittlung von Daten an andere Personen, Stellen oder Unternehmen stattfindet, erfolgt dies nur im Einklang mit den gesetzlichen Vorgaben.</p>
            <p>Vorbehaltlich ausdrücklicher Einwilligung oder vertraglich oder gesetzlich erforderlicher Übermittlung verarbeiten oder lassen wir die Daten nur in Drittländern mit einem anerkannten Datenschutzniveau, vertraglicher Verpflichtung durch sogenannte Standardschutzklauseln der EU-Kommission, beim Vorliegen von Zertifizierungen oder verbindlichen internen Datenschutzvorschriften verarbeiten (Art. 44 bis 49 DSGVO, Informationsseite der EU-Kommission: https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de).</p>

            <h2>7. Einsatz von Cookies</h2>
            <p>Cookies sind kleine Textdateien, die Informationen auf Endgeräten speichern und Informationen von Endgeräten auslesen. Z.B. um den Login-Status in einem Nutzerkonto, einen Warenkorbinhalt in einem E-Shop, die aufgerufenen Inhalte oder verwendete Funktionen eines Onlineangebotes speichern. Cookies können ferner zu unterschiedlichen Zwecken eingesetzt werden, z.B. zu Zwecken der Funktionsfähigkeit, Sicherheit und Komfort von Onlineangeboten sowie der Erstellung von Analysen der Besucherströme.</p>
            
            <h3>Einwilligung</h3>
            <p>Wir setzen Cookies im Einklang mit den gesetzlichen Vorschriften ein. Daher holen wir von den Nutzern eine Einwilligung ein, außer wenn diese gesetzlich nicht erforderlich ist. Eine Einwilligung ist insbesondere nicht notwendig, wenn Cookies unbedingt für den Betrieb eines Onlineangebotes erforderlich sind (z.B. zum Speichern von Logins). Die datenschutzrechtliche Rechtsgrundlage für den Einsatz von Cookies ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>
            
            <h3>Arten von Cookies</h3>
            <ul>
              <li><strong>Notwendige Cookies:</strong> Wir können Cookies zu Zwecken der Benutzerführung sowie zur Verbesserung der Sicherheit und des technischen Betriebs unseres Onlineangebotes einsetzen, sofern diese nicht aufgrund von Benutzerinteraktionen gesetzt werden müssen. Diese werden aus technischen Gründen benötigt und enthalten keine personenbezogenen Daten.</li>
              <li><strong>Statistik-, Marketing- und Präferenz-Cookies:</strong> Darüber hinaus setzen wir zu Statistik-, Marketing- und Präferenzzwecken Cookies ein, die wir nur mit Ihrer Einwilligung einsetzen.</li>
            </ul>

            <h2>8. Newsletter</h2>
            <p>Mit den nachfolgenden Hinweisen informieren wir Sie über die Inhalte unseres Newsletters sowie das Anmelde-, Versand- und das statistische Auswertungsverfahren sowie Ihre Widerspruchsrechte auf. Indem Sie unseren Newsletter abonnieren, erklären Sie sich mit dem Empfang und den beschriebenen Verfahren einverstanden.</p>
            
            <h3>Inhalt des Newsletters</h3>
            <p>Um sich für den Newsletter zu registrieren, müssen Sie lediglich Ihre E-Mail-Adresse angeben. Optional können Sie einen Namen angeben, um Sie persönlich ansprechen zu können. Im Rahmen der Anmeldung bitten wir Sie, Ihre Einwilligung zur Übersendung des Newsletters einzuholen.</p>
            
            <h3>Double-Opt-In-Verfahren</h3>
            <p>Die Anmeldung zu unserem Newsletter erfolgt in einem sogenannten Double-Opt-In-Verfahren. D.h., wir werden Ihnen nach Ihrer Anmeldung eine E-Mail an die von Ihnen angegebene E-Mail-Adresse senden, in der Sie um Bestätigung der Anmeldung gebeten werden. Die Anmeldung ist erst dann vollständig, wenn Sie die E-Mail bestätigen. Die Anmeldungen und die Bestätigungen werden protokolliert.</p>
            
            <h3>Löschung und Einschränkung der Verarbeitung</h3>
            <p>Sie können Ihre Einwilligung zum Empfang unseres Newsletters jederzeit widerrufen, d.h. Ihre Abonnements kündigen. Einen Link zur Kündigung des Newsletters finden Sie am Ende eines jeden Newsletters. Wir können die ausgetragenen E-Mail-Adressen bis zu drei Jahren auf Grundlage unserer berechtigten Interessen speichern, bevor wir sie löschen, um eine ehemals gegebene Einwilligung nachweisen zu können. Die Verarbeitung dieser Daten wird auf den Zweck einer möglichen Abwehr von Ansprüchen beschränkt. Ein individueller Löschungsantrag ist jederzeit möglich, sofern zugleich das ehemalige Bestehen einer Einwilligung bestätigt wird.</p>

            <h2>9. Kontaktformular und Anfragen</h2>
            <p>Bei der Kontaktaufnahme mit uns (z.B. per Kontaktformular, E-Mail, Telefon oder via soziale Medien) werden die Angaben der anfragenden Personen verarbeitet, soweit dies zur Beantwortung der Kontaktanfragen und etwaiger angefragter Maßnahmen erforderlich ist.</p>
            
            <h3>Zweck der Verarbeitung</h3>
            <p>Die Verarbeitung der Kontaktdaten dient uns zur Beantwortung von Kontaktanfragen. Im Übrigen gelten die im Rahmen der Kontaktaufnahme mitgeteilten Angaben für die Verarbeitung.</p>
            
            <h3>Rechtsgrundlagen</h3>
            <p>Die Rechtsgrundlage für die Verarbeitung der Daten ist bei Vorliegen einer Einwilligung des Nutzers Art. 6 Abs. 1 lit. a DSGVO. Rechtsgrundlage für die Verarbeitung der Daten, die im Zuge einer Übersendung einer E-Mail übermittelt werden, ist Art. 6 Abs. 1 lit. f DSGVO. Zielt der Kontakt auf den Abschluss eines Vertrages ab, so ist eine zusätzliche Rechtsgrundlage für die Verarbeitung Art. 6 Abs. 1 lit. b DSGVO.</p>
            
            <h3>Aufbewahrung und Löschung</h3>
            <p>Die Daten der Nutzer werden gelöscht, sobald sie für die Zwecke der Verarbeitung nicht mehr erforderlich sind. Dies ist für die durch die Rechtsgrundlagen des Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. b DSGVO (Vertragsabschluss) verarbeiteten Daten der Fall, wenn die Einwilligung widerrufen wird oder der Vertrag erfüllt wurde.</p>
            <p>Weitere Aufbewahrung der Daten kann stattfinden, wenn eine gesetzliche Pflicht zur Aufbewahrung besteht (z.B. handels- und steuerrechtliche Aufbewahrungspflichten). In diesem Fall werden die Daten bis zur Ablauf der gesetzlichen Aufbewahrungsfristen gespeichert.</p>

            <h2>10. Bereitstellung des Onlineangebots</h2>
            <p>Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung stellen zu können. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder das Endgerät der Nutzer zu übermitteln.</p>
            
            <h3>Rechtsgrundlage</h3>
            <p>Die Rechtsgrundlage für die Verarbeitung der Daten zur Bereitstellung des Onlineangebotes ist Art. 6 Abs. 1 lit. f DSGVO.</p>
            
            <h3>Daten, die während der Nutzung des Onlineangebotes erhoben werden</h3>
            <p>Daten, die während der Nutzung des Onlineangebotes verarbeitet werden, umfassen insbesondere:</p>
            <ul>
              <li>Bestandsdaten (z.B. Namen, Adressen)</li>
              <li>Kontaktdaten (z.B. E-Mail, Telefonnummern)</li>
              <li>Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos)</li>
              <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten)</li>
              <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen)</li>
            </ul>

            <h2>11. Ihre Rechte</h2>
            <p>Als betroffene Person haben Sie folgende Rechte:</p>
            <ul>
              <li><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie haben das Recht, von uns eine Bestätigung darüber zu verlangen, ob Sie betreffende personenbezogene Daten verarbeitet werden und auf Auskunft über diese Daten.</li>
              <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie haben das Recht, von uns die Berichtigung Sie betreffender unrichtiger personenbezogener Daten zu verlangen.</li>
              <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie haben das Recht, von uns zu verlangen, dass Sie betreffende personenbezogene Daten unverzüglich gelöscht werden.</li>
              <li><strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie haben das Recht, von uns die Einschränkung der Verarbeitung zu verlangen.</li>
              <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, die Sie betreffenden personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</li>
              <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten Widerspruch einzulegen.</li>
              <li><strong>Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO):</strong> Sie haben das Recht, jederzeit Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, einzulegen.</li>
            </ul>

            <h2>12. Widerrufsrecht bei Einwilligungen</h2>
            <p>Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen. Durch den Widerruf der Einwilligung wird die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung nicht berührt.</p>

            <h2>13. Dauer der Speicherung personenbezogener Daten</h2>
            <p>Die Dauer der Speicherung von personenbezogenen Daten bemisst sich anhand der jeweiligen Rechtsgrundlage, anhand der Verarbeitungszwecke und ggf. anhand der Einwilligung der betroffenen Person.</p>
            <p>Personenbezogene Daten, die wir aus vertraglichen oder gesetzlichen Gründen erheben und speichern, werden gelöscht, sobald der Vertrag erfüllt ist oder die gesetzliche Verpflichtung entfällt. Eine Ausnahme besteht, wenn eine weitere Speicherung zur Vertragserfüllung oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.</p>
            <p>Personenbezogene Daten, die wir zu Zwecken der Einwilligung verarbeiten, werden gelöscht, sobald die Einwilligung widerrufen wird, es sei denn, eine weitere Rechtsgrundlage erlaubt die weitere Verarbeitung.</p>
            <p>Personenbezogene Daten, die wir zu Zwecken der berechtigten Interessen verarbeiten, werden gelöscht, sobald die Gründe, die diese Verarbeitung rechtfertigen, entfallen, es sei denn, eine weitere Rechtsgrundlage erlaubt die weitere Verarbeitung.</p>

            <h2>14. Änderung dieser Datenschutzerklärung</h2>
            <p>Wir behalten uns vor, diese Datenschutzerklärung jederzeit mit Wirkung für die Zukunft anzupassen, sofern gesetzliche oder behördliche Vorgaben dies erfordern. Auch bei Änderungen unserer internen Abläufe oder technischen Weiterentwicklungen passen wir diese Datenschutzerklärung an.</p>

            <h2>15. Kontakt</h2>
            <p>Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br>
            E-Mail: privacy@nataliashow.com</p>
          `
        };
      case 'sr':
        return {
          title: t('privacy.title'),
          lastUpdated: `${t('privacy.lastUpdated')}: Januar 2025`,
          content: `
            <h2>1. Odgovorno lice</h2>
            <p>Odgovorno za obradu podataka na ovom sajtu je:</p>
            <p><strong>Natalia Show</strong><br>
            Zastupnik: Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Beograd<br>
            Srbija</p>
            <p>E-mail: privacy@nataliashow.com</p>

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
            
            <h3>2.2 Newsletter</h3>
            <p>Ako se prijavite za naš newsletter, koristićemo vašu e-mail adresu za slanje newslettera. Prijavljivanje se vrši u double-opt-in sistemu.</p>
            
            <h3>2.3 Kolačići</h3>
            <p>Naš sajt koristi kolačiće. Kolačići su male tekstualne datoteke koje se čuvaju na vašem uređaju. Koristimo različite vrste kolačića:</p>
            <ul>
              <li><strong>Neophodni kolačići:</strong> Potrebni za funkcionisanje sajta</li>
              <li><strong>Analitički kolačići:</strong> Za poboljšanje našeg sajta</li>
              <li><strong>Marketinški kolačići:</strong> Za personalizovanu reklamu</li>
            </ul>

            <h2>3. Pravna osnova</h2>
            <p>Obrada se vrši na osnovu:</p>
            <ul>
              <li>Člana 6. stav 1. tačka a DSGVO (pristanak)</li>
              <li>Člana 6. stav 1. tačka f DSGVO (opravdan interes)</li>
              <li>Člana 6. stav 1. tačka b DSGVO (ispunjenje ugovora)</li>
            </ul>

            <h2>4. Vaša prava</h2>
            <p>Imate sledeća prava u vezi sa vašim ličnim podacima:</p>
            <ul>
              <li>Pravo na pristup podacima (Član 15 DSGVO)</li>
              <li>Pravo na ispravku (Član 16 DSGVO)</li>
              <li>Pravo na brisanje (Član 17 DSGVO)</li>
              <li>Pravo na ograničavanje obrade (Član 18 DSGVO)</li>
              <li>Pravo na prenosivost podataka (Član 20 DSGVO)</li>
              <li>Pravo na prigovor (Član 21 DSGVO)</li>
            </ul>

            <h2>5. Bezbednosne mere</h2>
            <p>Primena odgovarajućih tehničkih i organizacionih mera za zaštitu vaših podataka u skladu sa stanjem tehnike.</p>

            <h2>6. Čuvanje podataka</h2>
            <p>Podaci se čuvaju samo onoliko koliko je neophodno za ispunjenje svrhe obrade ili dok to zahtevaju zakonske obaveze.</p>

            <h2>7. Kontakt</h2>
            <p>Za pitanja o privatnosti kontaktirajte nas:<br>
            E-mail: privacy@nataliashow.com</p>
          `
        };
      default:
        return {
          title: t('privacy.title'),
          lastUpdated: `${t('privacy.lastUpdated')}: January 2025`,
          content: `
            <h2>1. Data Controller</h2>
            <p>The data controller for this website is:</p>
            <p><strong>Natalia Show</strong><br>
            Represented by: Natalia Mitić<br>
            Knez Mihailova 42<br>
            11000 Belgrade<br>
            Serbia</p>
            <p>Email: privacy@nataliashow.com</p>

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
            
            <h3>2.2 Newsletter</h3>
            <p>If you subscribe to our newsletter, we use your email address to send the newsletter. Subscription is done using the double-opt-in method.</p>
            
            <h3>2.3 Cookies</h3>
            <p>Our website uses cookies. Cookies are small text files stored on your device. We use different types of cookies:</p>
            <ul>
              <li><strong>Necessary Cookies:</strong> Required for website operation</li>
              <li><strong>Analytical Cookies:</strong> To improve our website</li>
              <li><strong>Marketing Cookies:</strong> For personalized advertising</li>
            </ul>

            <h2>3. Legal Basis</h2>
            <p>Processing is based on:</p>
            <ul>
              <li>Art. 6 para. 1 lit. a GDPR (consent)</li>
              <li>Art. 6 para. 1 lit. f GDPR (legitimate interest)</li>
              <li>Art. 6 para. 1 lit. b GDPR (contract fulfillment)</li>
            </ul>

            <h2>4. Your Rights</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li>Right to access (Art. 15 GDPR)</li>
              <li>Right to rectification (Art. 16 GDPR)</li>
              <li>Right to erasure (Art. 17 GDPR)</li>
              <li>Right to restrict processing (Art. 18 GDPR)</li>
              <li>Right to data portability (Art. 20 GDPR)</li>
              <li>Right to object (Art. 21 GDPR)</li>
            </ul>

            <h2>5. Security Measures</h2>
            <p>Implementation of appropriate technical and organizational measures to protect your data according to the state of the art.</p>

            <h2>6. Data Storage</h2>
            <p>Data is stored only as long as necessary to fulfill the purpose of processing or as required by legal obligations.</p>

            <h2>7. Contact</h2>
            <p>For privacy questions, please contact:<br>
            Email: privacy@nataliashow.com</p>
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