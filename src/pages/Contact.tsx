import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Adresa",
      info: "hello@natalishow.rs",
      description: "Pošaljite nam poruku, odgovorićemo u roku od 24 sata"
    },
    {
      icon: Phone,
      title: "Telefon",
      info: "+381 11 123 4567",
      description: "Pozovite nas radnim danima od 9:00 do 17:00"
    },
    {
      icon: MapPin,
      title: "Adresa",
      info: "Knez Mihailova 42, Beograd",
      description: "Možete nas posjetiti u našem studiju"
    },
    {
      icon: Clock,
      title: "Radno Vrijeme",
      info: "Pon-Pet: 9:00-17:00",
      description: "Vikendima po dogovoru"
    }
  ];

  const reasons = [
    {
      title: "Budite Gost Podkasta",
      description: "Imate inspirativnu priču? Želimo je čuti!",
      icon: "🎙️"
    },
    {
      title: "Medijska Saradnja",
      description: "Partnerin za intervjue, gostovanja i saradnju",
      icon: "📺"
    },
    {
      title: "Kulinarska Savjetovanja",
      description: "Potreban vam je savjet za vaš recept?",
      icon: "👩‍🍳"
    },
    {
      title: "Tehnička Podrška",
      description: "Problemi sa pristupom sadržaju ili stranici",
      icon: "🔧"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent">
            Kontaktirajte Nas
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uvijek smo tu za vas! Bilo da želite biti gost, imate pitanje ili jednostavno želite reći zdravo.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((item, index) => (
              <Card key={index} className="premium-card text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary-glow" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-primary-glow mb-2">{item.info}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Pošaljite Poruku</h2>
                <p className="text-muted-foreground">
                  Popunite formu ispod i kontaktiraćemo vas što prije.
                </p>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ime</label>
                    <Input placeholder="Vaše ime" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prezime</label>
                    <Input placeholder="Vaše prezime" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="vas.email@example.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Telefon (opcionalno)</label>
                  <Input placeholder="+381 XX XXX XXXX" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Razlog kontakta</label>
                  <select className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Želim biti gost podkasta</option>
                    <option>Medijska saradnja</option>
                    <option>Kulinarski savjeti</option>
                    <option>Tehnička podrška</option>
                    <option>Ostalo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Poruka</label>
                  <Textarea 
                    placeholder="Opišite detaljno razlog vašeg kontakta..."
                    rows={6}
                  />
                </div>
                
                <Button variant="hero" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Pošalji Poruku
                </Button>
              </form>
            </div>

            {/* Reasons to Contact & Map */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Zašto Nas Kontaktirati?</h2>
                <div className="space-y-4">
                  {reasons.map((reason, index) => (
                    <div key={index} className="premium-card p-4 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{reason.icon}</div>
                        <div>
                          <h3 className="font-semibold text-primary-glow mb-1">{reason.title}</h3>
                          <p className="text-muted-foreground text-sm">{reason.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="premium-card p-8 rounded-xl text-center">
                <MapPin className="w-16 h-16 text-primary-glow mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Naš Studio</h3>
                <p className="text-muted-foreground mb-4">
                  Nalazimo se u srcu Beograda, na Knez Mihailovoj ulici.
                </p>
                <Button variant="outline">
                  Otvori u Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Često Postavljena Pitanja
            </h2>
            <p className="text-lg text-muted-foreground">
              Odgovori na najčešća pitanja naših slušalaca.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Kako mogu biti gost u podkastu?",
                answer: "Pošaljite nam poruku kroz kontakt formu sa kratkim opisom vaše priče ili ekspertize. Naš tim će vas kontaktirati ukoliko se vaš profil uklapa u naš sadržaj."
              },
              {
                question: "Da li odgovarate na sve poruke?",
                answer: "Da! Trudimo se da odgovorimo na sve poruke u roku od 24-48 sati. Ukoliko ne čujete od nas, provjerite spam folder."
              },
              {
                question: "Mogu li poslati recept za objavljanje?",
                answer: "Apsolutno! Volimo da dijelimo recepte naše zajednice. Pošaljite recept sa slikama i kratkom pričom o njemu."
              },
              {
                question: "Da li nudite privatne kulinarske savjete?",
                answer: "Da, Natali nudi individualne konsultacije za posebne prilike. Kontaktirajte nas za više informacija o dostupnosti i cijenama."
              }
            ].map((faq, index) => (
              <div key={index} className="premium-card p-6 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="font-semibold text-primary-glow mb-3 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;