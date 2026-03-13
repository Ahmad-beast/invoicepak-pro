import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; // useSearchParams add kiya
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, ArrowLeft, Shield, Zap, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SEO } from '@/components/SEO';
import { useReferralTracker } from '@/hooks/useReferralTracker';

const Login = () => {
  useReferralTracker();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  
  const navigate = useNavigate();
  // Yahan hum URL se 'redirect' parameter nikal rahe hain
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Welcome back!');
      // Hardcoded '/dashboard' ki jagah redirectTo use kiya
      navigate(redirectTo);
    } else {
      toast.error(result.error || 'Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      toast.success('Welcome back!');
      // Yahan bhi redirectTo use kiya
      navigate(redirectTo);
    } else {
      toast.error(result.error || 'Failed to sign in with Google');
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
            <p className="text-sm text-muted-foreground font-medium">Signing you in...</p>
          </div>
        </div>
      )}

      <SEO
        title="Login - Access Your Dashboard"
        description="Log in to InvoicePak Pro to manage your clients, track payments, and download invoice history."
        canonical="/login"
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
              Welcome back to your invoicing hub
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pick up right where you left off. Your invoices, clients, and payment tracking — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Zap, text: 'Create invoices in under 2 minutes' },
              { icon: Globe, text: 'Auto USD to PKR conversion' },
              { icon: Shield, text: 'Your data is safe and secure' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{item.text}</span>
              </div>
            ))}
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
              <CardTitle className="text-2xl text-foreground">Sign in</CardTitle>
              <CardDescription>Access your invoicing dashboard</CardDescription>
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
                {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
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
                    className="bg-background border-border h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                {/* Note: App agar Signup se aayenge redirect link toot na jaye, isliye state me redirect pass karna better hai, but abhi simple rakhte hain */}
                <Link to={`/signup${redirectTo !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
