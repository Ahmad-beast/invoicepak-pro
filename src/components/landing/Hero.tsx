import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, DollarSign, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Built for Pakistani Freelancers</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Professional Invoices,
          <br />
          <span className="text-primary">Made Simple</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Create stunning invoices in seconds with automatic USD to PKR conversion. 
          Perfect for freelancers and remote workers in Pakistan.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Sign In
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard
            icon={<FileText className="w-6 h-6" />}
            title="Quick Invoices"
            description="Create professional invoices in under a minute"
          />
          <FeatureCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Auto Conversion"
            description="Real-time USD to PKR rate conversion"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Fast & Reliable"
            description="Lightning fast with zero learning curve"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 mx-auto">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);
