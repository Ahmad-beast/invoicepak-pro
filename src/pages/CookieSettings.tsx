import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieSettings = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: true,
  });

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // In a real app, this would save to localStorage or send to backend
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    toast.success('Cookie preferences saved successfully!');
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allEnabled);
    localStorage.setItem('cookiePreferences', JSON.stringify(allEnabled));
    toast.success('All cookies accepted!');
  };

  const handleRejectOptional = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyEssential);
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyEssential));
    toast.success('Only essential cookies enabled!');
  };

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.',
      required: true,
    },
    {
      key: 'functional' as const,
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
      required: false,
    },
    {
      key: 'analytics' as const,
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the site experience.',
      required: false,
    },
    {
      key: 'marketing' as const,
      title: 'Marketing Cookies',
      description: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InvoicePK</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <Cookie className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Cookie Settings</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Manage your cookie preferences below. You can enable or disable different types of cookies according to your preferences.
        </p>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={handleAcceptAll} className="bg-primary hover:bg-primary/90">
            Accept All Cookies
          </Button>
          <Button onClick={handleRejectOptional} variant="outline">
            Reject Optional Cookies
          </Button>
        </div>

        {/* Cookie Categories */}
        <div className="space-y-4 mb-8">
          {cookieTypes.map((cookie) => (
            <Card key={cookie.key} className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">{cookie.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {cookie.required && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        Always Active
                      </span>
                    )}
                    <Switch
                      id={cookie.key}
                      checked={preferences[cookie.key]}
                      onCheckedChange={() => handleToggle(cookie.key)}
                      disabled={cookie.required}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {cookie.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Preferences
          </Button>
        </div>

        {/* Additional Information */}
        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to the website owners. 
              Cookies help us remember your preferences, understand how you use our site, and improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              InvoicePK uses cookies for various purposes including authentication, remembering your preferences, 
              analyzing site traffic, and personalizing content. We also use cookies from trusted third-party 
              services like Google Analytics to understand how visitors use our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies in Your Browser</h2>
            <p className="text-muted-foreground leading-relaxed">
              Most web browsers allow you to control cookies through their settings. You can set your browser to 
              refuse all cookies, accept only certain cookies, or notify you when a cookie is set. Please note that 
              if you disable cookies, some features of our website may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at{' '}
              <a href="mailto:privacy@invoicepk.com" className="text-primary hover:underline">
                privacy@invoicepk.com
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} InvoicePK. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CookieSettings;
