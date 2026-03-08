import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  message?: string;
  onComplete: () => void;
}

export const SuccessAnimation = ({ message = 'Invoice Created!', onComplete }: SuccessAnimationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-500">
        <div className="w-20 h-20 rounded-full bg-chart-2/15 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-chart-2 animate-in zoom-in-0 duration-700" />
        </div>
        <p className="text-xl font-bold text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};
