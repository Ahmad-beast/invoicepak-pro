import { 
  FileText, DollarSign, Download, Clock, Shield, Globe, Smartphone, BarChart3, Zap, CheckCircle
} from 'lucide-react';

const features = [
  { icon: FileText, title: 'Professional Invoices', description: 'Create stunning, professional invoices that impress your clients and get you paid faster.', highlight: 'Most Popular' },
  { icon: DollarSign, title: 'USD to PKR Conversion', description: 'Automatic real-time currency conversion so you always know your earnings in PKR.', highlight: 'Live Rates' },
  { icon: Download, title: 'PDF Export', description: 'Download beautiful PDF invoices ready to share with clients via email or messaging.', highlight: null },
  { icon: Clock, title: 'Quick Creation', description: 'Create complete invoices in under a minute with our intuitive, streamlined interface.', highlight: '< 60 seconds' },
  { icon: Shield, title: 'Secure & Private', description: 'Your data is encrypted and never shared. We take your privacy seriously.', highlight: 'SSL Encrypted' },
  { icon: Globe, title: 'Multi-Currency', description: 'Invoice clients worldwide with support for USD, PKR, GBP, EUR, AED, SAR, CAD, and AUD.', highlight: '8 Currencies' },
  { icon: Smartphone, title: 'Mobile Friendly', description: 'Access your invoices anywhere. Fully responsive design works on all devices.', highlight: null },
  { icon: BarChart3, title: 'Track Payments', description: 'Monitor invoice status and track your earnings with a simple, clean dashboard.', highlight: 'Analytics' },
];

const highlights = [
  'Free forever plan available',
  'No hidden fees or charges',
  'Cancel anytime, no lock-in',
  '24/7 customer support',
];

export const Features = () => {
  return (
    <section className="py-28 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-chart-5/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-2 tracking-tight">
            Everything You Need to <span className="text-gradient-primary">Get Paid</span>
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl mx-auto text-lg">
            Powerful features designed specifically for Pakistani freelancers and remote workers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl glass glass-hover hover:-translate-y-1.5 hover:glow-primary"
            >
              {feature.highlight && (
                <span className="absolute -top-2.5 right-4 px-3 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full uppercase tracking-wider">
                  {feature.highlight}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 group-hover:scale-110">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Highlights bar */}
        <div className="glass rounded-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-2.5 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 flex-shrink-0" />
                <span className="text-muted-foreground">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
