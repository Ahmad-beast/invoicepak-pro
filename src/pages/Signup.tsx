import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SEO } from '@/components/SEO';
import { useReferralTracker } from '@/hooks/useReferralTracker';

const Signup = () => {
  useReferralTracker();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  
  const navigate = useNavigate();
  // URL se redirect parameter nikal rahe hain
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);

    const result = await signup(email, password, name);
    
    if (result.success) {
      toast.success('Account created successfully!');
      // Hardcoded /dashboard ki jagah redirectTo par bhej rahe hain
      navigate(redirectTo);
    } else {
      toast.error(result.error || 'Failed to create account');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      toast.success('Account created successfully!');
      // Yahan bhi redirectTo use kar rahe hain
      navigate(redirectTo);
    } else {
      toast.error(result.error || 'Failed to sign up with Google');
    }
    
    setIsGoogleLoading(false);
  };

  const isProcessing = isLoading || isGoogleLoading;

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Creating your account...</p>
          </div>
        </div>
      )}

      <SEO
        title="Sign Up - Start Invoicing for Free"
        description="Join thousands of Pakistani freelancers. Sign up for InvoicePak Pro to create unlimited professional invoices."
        canonical="/signup"
      />

      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-card relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="relative z-10 max-w-md space-y-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-primary">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">InvoicePK</span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Start invoicing like a pro in minutes
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Join hundreds of Pakistani freelancers who trust InvoicePK for professional invoicing with automatic currency conversion.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Free forever — no credit card needed',
              'Professional PDF invoices in seconds',
              'Automatic USD → PKR conversion',
              'Share invoices with a single link',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-chart-2/15 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-chart-2" />
                </div>
                <span className="text-sm text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 pt-4 border-t border-border/50">
            <div className="flex -space-x-2">
              {['A', 'S', 'M', 'K'].map((letter, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{letter}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-foreground font-medium">Trusted by freelancers</p>
              <p className="text-xs text-muted-foreground">across Pakistan 🇵🇰</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InvoicePK</span>
          </div>
          
          <Card className="bg-card border-border/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-foreground">Create your account</CardTitle>
              <CardDescription>Start creating professional invoices in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-11 gap-2" 
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isGoogleLoading ? 'Signing up...' : 'Continue with Google'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="bg-background border-border h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="bg-background border-border h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="bg-background border-border h-11"
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>
                <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to={`/login${redirectTo !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
