import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Cookie, Settings, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const CookieBanner: React.FC = () => {
  const { t, language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('natali-show-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const saved = JSON.parse(consent);
      setPreferences(saved);
    }
  }, []);

  const saveConsent = async (consentData: typeof preferences) => {
    try {
      // Save to localStorage
      localStorage.setItem('natali-show-cookie-consent', JSON.stringify(consentData));
      
      // Save to database for GDPR compliance
      const userIdentifier = localStorage.getItem('user-identifier') || 
        crypto.getRandomValues(new Uint32Array(1))[0].toString();
      
      if (!localStorage.getItem('user-identifier')) {
        localStorage.setItem('user-identifier', userIdentifier);
      }

      for (const [type, consent] of Object.entries(consentData)) {
        await supabase
          .from('gdpr_consents')
          .insert({
            user_identifier: userIdentifier,
            consent_type: type,
            consent_given: consent,
            language_code: language
          });
      }

      setShowBanner(false);
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  const acceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setPreferences(allConsent);
    saveConsent(allConsent);
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  const updatePreference = (type: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      <Card className="fixed bottom-4 left-4 right-4 z-50 p-6 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm max-w-md mx-auto lg:max-w-lg lg:left-6 lg:right-auto">
        <div className="flex items-start gap-4">
          <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{t('gdpr.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('gdpr.message')}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button 
                onClick={acceptAll}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {t('gdpr.accept')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(true)}
                className="border-primary/20"
              >
                <Settings className="h-4 w-4 mr-2" />
                {t('gdpr.settings')}
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBanner(false)}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('gdpr.settings')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    {t('gdpr.necessary')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Required for basic website functionality
                  </p>
                </div>
                <Switch 
                  checked={preferences.necessary} 
                  disabled={true}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    {t('gdpr.analytics')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Help us improve our website
                  </p>
                </div>
                <Switch 
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => updatePreference('analytics', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    {t('gdpr.marketing')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Personalized ads and content
                  </p>
                </div>
                <Switch 
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => updatePreference('marketing', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Preferences
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Remember your settings
                  </p>
                </div>
                <Switch 
                  checked={preferences.preferences}
                  onCheckedChange={(checked) => updatePreference('preferences', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={savePreferences} className="bg-gradient-to-r from-primary to-accent">
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};