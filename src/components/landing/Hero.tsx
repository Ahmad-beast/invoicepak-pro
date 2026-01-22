import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, DollarSign, Zap, CheckCircle, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      
      {/* Floating elements */}
      <div className="absolute top-32 right-20 hidden lg:block animate-bounce" style={{ animationDuration: '3s' }}>
        <div className="p-3 rounded-xl bg-card/80 backdrop-blur border border-border shadow-lg">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 hidden lg:block animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
        <div className="p-3 rounded-xl bg-card/80 backdrop-blur border border-border shadow-lg">
          <FileText className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Built for Pakistani Freelancers</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          The Easiest Way to Create
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Invoices for Pakistani Freelancers</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Create stunning invoices in seconds with automatic USD to PKR conversion. 
          Perfect for freelancers and remote workers in Pakistan.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 group">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-16">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Free forever plan
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Set up in 30 seconds
          </span>
        </div>
        
        {/* Mock Invoice Preview */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-card border border-border shadow-2xl shadow-primary/10 p-6 md:p-8 hover:shadow-primary/20 transition-shadow duration-500">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              Live Preview
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - Invoice info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Invoice #001</p>
                    <p className="text-xs text-muted-foreground">Jan 13, 2026</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
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
                    <span className="text-primary">$800.00</span>
                  </div>
                </div>
              </div>
              
              {/* Right side - PKR conversion */}
              <div className="flex-1 bg-primary/5 rounded-xl p-4 text-left border border-primary/10">
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
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                    Real-time rates
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
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
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">5,000+ Users</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">$2M+ Processed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
