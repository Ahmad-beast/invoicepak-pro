import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, PartyPopper, AlertCircle, Clock, LinkIcon } from 'lucide-react';
import { format } from 'date-fns';

const DURATION_LABELS: Record<string, string> = {
  '7days': '7-Day',
  '14days': '14-Day',
  '1month': '1-Month',
  '3months': '3-Month',
  '6months': '6-Month',
  '1year': '1-Year',
  'lifetime': 'Lifetime',
};

const DURATION_DAYS: Record<string, number> = {
  '7days': 7,
  '14days': 14,
  '1month': 30,
  '3months': 90,
  '6months': 180,
  '1year': 365,
  'lifetime': 36500,
};

type ActivationState = 'loading' | 'success' | 'already-used' | 'expired' | 'invalid' | 'redirecting';

const Activate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth(); // Yahan isAuthLoading add kiya hai
  const token = searchParams.get('token');

  const [state, setState] = useState<ActivationState>('loading');
  const [durationLabel, setDurationLabel] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  useEffect(() => {
    // Firebase ki auth state check hone tak wait karein
    if (isAuthLoading) return;

    if (!token) {
      setState('invalid');
      return;
    }

    if (!user) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(`/activate?token=${token}`)}`;
      navigate(redirectUrl, { replace: true });
      setState('redirecting');
      return;
    }

    const activate = async () => {
      try {
        const linkRef = doc(db, 'giftLinks', token);
        const linkSnap = await getDoc(linkRef);

        if (!linkSnap.exists()) {
          setState('invalid');
          return;
        }

        const data = linkSnap.data();

        if (data.used) {
          setState('already-used');
          return;
        }

        const expiresAt = data.expiresAt?.toDate();
        if (expiresAt && expiresAt < new Date()) {
          setState('expired');
          return;
        }

        // Calculate trial end date
        const days = DURATION_DAYS[data.duration] || 30;
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + days);

        // Activate pro plan
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          plan: 'pro',
          isTrial: true,
          trialStartDate: Timestamp.now(),
          trialEndDate: Timestamp.fromDate(trialEnd),
          proExpiresAt: Timestamp.fromDate(trialEnd),
          subscriptionStatus: 'active',
          updatedAt: Timestamp.now(),
        });

        // Mark token as used
        await updateDoc(linkRef, {
          used: true,
          usedAt: Timestamp.now(),
          usedBy: user.uid,
        });

        setDurationLabel(DURATION_LABELS[data.duration] || data.duration);
        setExpiryDate(trialEnd);
        setState('success');
      } catch (err) {
        console.error('Activation error:', err);
        setState('invalid');
      }
    };

    activate();
  }, [token, user, navigate, isAuthLoading]); // Dependency array mein isAuthLoading add kiya

  if (state === 'loading' || state === 'redirecting') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state === 'success') {
    return <SuccessScreen duration={durationLabel} expiryDate={expiryDate} />;
  }

  return <ErrorScreen state={state} />;
};

/* ===== Success Celebration ===== */
const SuccessScreen = ({ duration, expiryDate }: { duration: string; expiryDate: Date | null }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-amber-950/20 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            background: `hsl(${40 + Math.random() * 20}, 90%, ${50 + Math.random() * 20}%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      <Card className="relative z-10 w-full max-w-md border-amber-500/30 bg-card/95 backdrop-blur-sm shadow-2xl shadow-amber-500/10 animate-scale-in">
        <CardContent className="p-8 text-center space-y-6">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/15 mx-auto animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <PartyPopper className="w-10 h-10 text-amber-500" />
          </div>

          <div className="space-y-2" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-2xl font-bold text-foreground animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              🎉 Pro Plan Activated!
            </h1>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              Your <span className="text-amber-500 font-semibold">{duration} Pro</span> access is now live!
            </p>
          </div>

          {expiryDate && (
            <div
              className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 animate-fade-in"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Valid Until</p>
              <p className="text-lg font-bold text-foreground">{format(expiryDate, 'MMMM d, yyyy')}</p>
            </div>
          )}

          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full h-11 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25 animate-fade-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            Start Using Pro →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/* ===== Error States ===== */
const ErrorScreen = ({ state }: { state: ActivationState }) => {
  const navigate = useNavigate();

  const config = {
    'already-used': {
      icon: LinkIcon,
      title: 'Link Already Used',
      description: 'This activation link has already been used. Each link can only be used once.',
      color: 'text-amber-500',
    },
    expired: {
      icon: Clock,
      title: 'Link Expired',
      description: 'This activation link has expired. Please contact the admin for a new one.',
      color: 'text-orange-500',
    },
    invalid: {
      icon: AlertCircle,
      title: 'Invalid Link',
      description: 'This activation link is not valid. Please check the URL and try again.',
      color: 'text-destructive',
    },
  }[state as 'already-used' | 'expired' | 'invalid'] || {
    icon: AlertCircle,
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred.',
    color: 'text-destructive',
  };

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-border/50 animate-scale-in">
        <CardContent className="p-8 text-center space-y-5">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mx-auto`}>
            <Icon className={`w-8 h-8 ${config.color}`} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">{config.title}</h1>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activate;
