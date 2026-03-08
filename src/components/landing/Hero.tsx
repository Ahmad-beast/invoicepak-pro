import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, DollarSign, Zap, CheckCircle, Shield, Users, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-chart-4/5 rounded-full blur-[80px]" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(hsl(210 40% 98%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 40% 98%) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Floating elements */}
      <div className="absolute top-28 right-20 hidden lg:block animate-bounce" style={{ animationDuration: '4s' }}>
        <div className="p-3 rounded-xl glass glow-primary">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-36 left-20 hidden lg:block animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
        <div className="p-3 rounded-xl glass glow-primary">
          <FileText className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute top-48 left-32 hidden xl:block animate-bounce" style={{ animationDuration: '6s', animationDelay: '0.5s' }}>
        <div className="p-2 rounded-lg glass">
          <Sparkles className="w-4 h-4 text-chart-4" />
        </div>
      </div>
      
      <div className="container mx-auto text-center relative z-10 max-w-5xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/10 mb-8 glow-primary">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-foreground font-medium">Built for Pakistani Freelancers</span>
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-foreground mb-6 leading-[1.05] tracking-tight">
          Create Professional
          <br />
          <span className="text-gradient-primary">Invoices in Seconds</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          The fastest way to create stunning invoices with automatic USD to PKR conversion. 
          Built for freelancers and remote workers in Pakistan.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-10 py-7 glow-primary-strong hover:scale-[1.03] transition-all duration-300 group font-semibold">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="text-lg px-10 py-7 hover:scale-[1.03] transition-all duration-300 border-border/60 hover:border-primary/40 hover:bg-primary/5">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground mb-20">
          {['Free forever plan', 'No credit card required', 'Set up in 30 seconds'].map((text) => (
            <span key={text} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              {text}
            </span>
          ))}
        </div>
        
        {/* Mock Invoice Preview Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl glass p-6 md:p-8 glow-primary hover:glow-primary-strong transition-all duration-500">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full tracking-wide uppercase">
              Live Preview
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left - Invoice info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Invoice #INV-001</p>
                    <p className="text-xs text-muted-foreground">Jan 13, 2026</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Web Development</span>
                    <span className="text-foreground font-semibold">$500.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">UI/UX Design</span>
                    <span className="text-foreground font-semibold">$300.00</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Total (USD)</span>
                    <span className="text-primary text-xl">$800.00</span>
                  </div>
                </div>
              </div>
              
              {/* Right - PKR conversion */}
              <div className="flex-1 bg-primary/5 rounded-xl p-6 text-left border border-primary/15">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">PKR Conversion</span>
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
                  Rs 223,200
                </p>
                <p className="text-xs text-muted-foreground mb-5">
                  @ Rate: 1 USD = 279 PKR
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 text-xs rounded-full bg-chart-2/10 text-chart-2 border border-chart-2/20 font-semibold">
                    Real-time rates
                  </span>
                  <span className="px-3 py-1.5 text-xs rounded-full bg-chart-4/10 text-chart-4 border border-chart-4/20 font-semibold">
                    Auto-updated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-20 pt-12 border-t border-border/30">
          <p className="text-sm text-muted-foreground/60 mb-8 uppercase tracking-wider font-medium">Trusted by freelancers across Pakistan</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14">
            {[
              { icon: Shield, label: 'SSL Secured' },
              { icon: Users, label: '5,000+ Users' },
              { icon: Star, label: '4.9/5 Rating' },
              { icon: DollarSign, label: '$2M+ Processed' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-muted-foreground/40 hover:text-primary transition-colors duration-300 group">
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
