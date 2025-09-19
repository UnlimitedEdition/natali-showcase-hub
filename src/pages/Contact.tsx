import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Mic } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  page_key: string;
  section_key: string;
  language_code: string;
  content_text: string | null;
  content_html: string | null;
  media_url: string | null;
  media_type: string | null;
  is_published: boolean;
}

interface GuestRequest {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  reason: string;
  message: string;
  language_code: string;
  created_at?: string;
}

const Contact = () => {
  const { t, language } = useLanguage();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<GuestRequest>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    reason: t('contact.form.reasonOptions.guest'),
    message: '',
    language_code: language
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [language]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('page_key', 'contact')
        .eq('language_code', language)
        .eq('is_published', true);

      if (error) throw error;
      setContent(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const getContentBySection = (sectionKey: string) => {
    const item = content.find(item => item.section_key === sectionKey);
    return item ? item.content_text : null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReasonSelect = (reasonValue: string) => {
    setFormData(prev => ({
      ...prev,
      reason: reasonValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('guest_requests')
        .insert({
          ...formData,
          language_code: language
        });

      if (error) throw error;
      
      toast.success(t('contact.form.success'));
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        reason: t('contact.form.reasonOptions.guest'),
        message: '',
        language_code: language
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.email.title'),
      info: "hello@Nataliashow.rs",
      description: t('contact.email.description')
    },
    {
      icon: Phone,
      title: t('contact.phone.title'),
      info: "+381 11 123 4567",
      description: t('contact.phone.description')
    },
    {
      icon: MapPin,
      title: t('contact.address.title'),
      info: "Knez Mihailova 42, Beograd",
      description: t('contact.address.description')
    },
    {
      icon: Clock,
      title: t('contact.hours.title'),
      info: "Pon-Pet: 9:00-17:00",
      description: t('contact.hours.description')
    }
  ];

  const reasons = [
    {
      title: t('contact.reasons.guest.title'),
      description: t('contact.reasons.guest.description'),
      icon: "🎙️",
      value: t('contact.form.reasonOptions.guest')
    },
    {
      title: t('contact.reasons.media.title'),
      description: t('contact.reasons.media.description'),
      icon: "📺",
      value: t('contact.form.reasonOptions.media')
    },
    {
      title: t('contact.reasons.cooking.title'),
      description: t('contact.reasons.cooking.description'),
      icon: "👩‍🍳",
      value: t('contact.form.reasonOptions.cooking')
    },
    {
      title: t('contact.reasons.support.title'),
      description: t('contact.reasons.support.description'),
      icon: "🔧",
      value: t('contact.form.reasonOptions.support')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-pulse h-16 bg-gray-200 rounded w-64 mx-auto mb-6"></div>
            <div className="animate-pulse h-6 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pageTitle = getContentBySection('page_title') || t('contact.hero.title');
  const pageSubtitle = getContentBySection('page_subtitle') || t('contact.hero.subtitle');
  const heroTitle = getContentBySection('hero_title') || t('contact.hero.title');
  const heroSubtitle = getContentBySection('hero_subtitle') || t('contact.hero.subtitle');

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <img 
              src="/logo.png" 
              alt="Natalia Show Logo" 
              className="w-16 h-16 rounded-full object-contain mr-4"
            />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              {heroTitle}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {heroSubtitle}
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
                <h2 className="text-3xl font-bold mb-4">{t('contact.form.title')}</h2>
                <p className="text-muted-foreground">
                  {t('contact.form.subtitle')}
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.form.firstName')}</label>
                    <Input 
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder={t('contact.form.firstNamePlaceholder')} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.form.lastName')}</label>
                    <Input 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder={t('contact.form.lastNamePlaceholder')} 
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="vas.email@example.com" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('contact.form.phone')}</label>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+381 XX XXX XXXX" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('contact.form.reason')}</label>
                  <select 
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={t('contact.form.reasonOptions.guest')}>{t('contact.form.reasonOptions.guest')}</option>
                    <option value={t('contact.form.reasonOptions.media')}>{t('contact.form.reasonOptions.media')}</option>
                    <option value={t('contact.form.reasonOptions.cooking')}>{t('contact.form.reasonOptions.cooking')}</option>
                    <option value={t('contact.form.reasonOptions.support')}>{t('contact.form.reasonOptions.support')}</option>
                    <option value={t('contact.form.reasonOptions.other')}>{t('contact.form.reasonOptions.other')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('contact.form.message')}</label>
                  <Textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={6}
                    required
                  />
                </div>
                
                <Button variant="hero" size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      {t('contact.form.submitting')}
                    </span>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Reasons to Contact & Map */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">{t('contact.reasons.title')}</h2>
                <div className="space-y-4">
                  {reasons.map((reason, index) => (
                    <div 
                      key={index} 
                      className="premium-card p-4 rounded-lg animate-fade-in cursor-pointer hover:bg-primary/10 transition-colors"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => handleReasonSelect(reason.value)}
                    >
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
                <h3 className="text-xl font-semibold mb-2">{t('contact.map.title')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('contact.map.description')}
                </p>
                <Button variant="outline">
                  {t('contact.map.button')}
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
              {t('contact.faq.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('contact.faq.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: t('contact.faq.questions.guest.question'),
                answer: t('contact.faq.questions.guest.answer')
              },
              {
                question: t('contact.faq.questions.response.question'),
                answer: t('contact.faq.questions.response.answer')
              },
              {
                question: t('contact.faq.questions.recipe.question'),
                answer: t('contact.faq.questions.recipe.answer')
              },
              {
                question: t('contact.faq.questions.consulting.question'),
                answer: t('contact.faq.questions.consulting.answer')
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