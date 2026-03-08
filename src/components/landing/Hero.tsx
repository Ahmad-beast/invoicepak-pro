import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, DollarSign, Zap, CheckCircle, Shield, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-background" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating cards */}
      <div className="absolute top-32 right-16 hidden lg:block animate-bounce" style={{ animationDuration: '3s' }}>
        <div className="p-3 rounded-xl bg-card/90 backdrop-blur border border-border shadow-lg">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-40 left-16 hidden lg:block animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
        <div className="p-3 rounded-xl bg-card/90 backdrop-blur border border-border shadow-lg">
          <FileText className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <div className="container mx-auto text-center relative z-10 max-w-5xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Built for Pakistani Freelancers</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
          Create Professional
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Invoices in Seconds</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          The fastest way to create stunning invoices with automatic USD to PKR conversion. 
          Built for freelancers and remote workers in Pakistan.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] group">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover:scale-[1.02] transition-all">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-16">
          {['Free forever plan', 'No credit card required', 'Set up in 30 seconds'].map((text) => (
            <span key={text} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              {text}
            </span>
          ))}
        </div>
        
        {/* Mock Invoice Preview Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-card border border-border shadow-2xl shadow-primary/10 p-6 md:p-8 hover:shadow-primary/15 transition-shadow duration-500">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              Live Preview
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left - Invoice info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Invoice #INV-001</p>
                    <p className="text-xs text-muted-foreground">Jan 13, 2026</p>
                  </div>
                </div>
                
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Web Development</span>
                    <span className="text-foreground font-medium">$500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UI/UX Design</span>
                    <span className="text-foreground font-medium">$300.00</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total (USD)</span>
                    <span className="text-primary text-lg">$800.00</span>
                  </div>
                </div>
              </div>
              
              {/* Right - PKR conversion */}
              <div className="flex-1 bg-primary/5 rounded-xl p-5 text-left border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">PKR Conversion</span>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  Rs 223,200
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  @ Rate: 1 USD = 279 PKR
                </p>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-primary/15 text-primary border border-primary/20 font-medium">
                    Real-time rates
                  </span>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-primary/15 text-primary border border-primary/20 font-medium">
                    Auto-updated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-8">Trusted by freelancers across Pakistan</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { icon: Shield, label: 'SSL Secured' },
              { icon: Users, label: '5,000+ Users' },
              { icon: Star, label: '4.9/5 Rating' },
              { icon: DollarSign, label: '$2M+ Processed' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
