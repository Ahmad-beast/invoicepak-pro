import { 
  FileText, 
  DollarSign, 
  Download, 
  Clock, 
  Shield, 
  Globe,
  Smartphone,
  BarChart3,
  Zap,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Professional Invoices',
    description: 'Create stunning, professional invoices that impress your clients and get you paid faster.',
    highlight: 'Most Popular',
  },
  {
    icon: DollarSign,
    title: 'USD to PKR Conversion',
    description: 'Automatic real-time currency conversion so you always know your earnings in PKR.',
    highlight: 'Live Rates',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download beautiful PDF invoices ready to share with clients via email or messaging.',
    highlight: null,
  },
  {
    icon: Clock,
    title: 'Quick Creation',
    description: 'Create complete invoices in under a minute with our intuitive, streamlined interface.',
    highlight: '< 60 seconds',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared. We take your privacy seriously.',
    highlight: 'SSL Encrypted',
  },
  {
    icon: Globe,
    title: 'Work Globally',
    description: 'Invoice clients worldwide with multi-currency support and professional formatting.',
    highlight: null,
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your invoices anywhere. Fully responsive design works on all devices.',
    highlight: null,
  },
  {
    icon: BarChart3,
    title: 'Track Payments',
    description: 'Monitor invoice status and track your earnings with a simple dashboard.',
    highlight: 'Analytics',
  },
];

const highlights = [
  'Free forever plan available',
  'No hidden fees or charges',
  'Cancel anytime, no lock-in',
  '24/7 customer support',
];

export const Features = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" />
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Everything You Need to Get Paid
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Powerful features designed specifically for Pakistani freelancers and remote workers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              {feature.highlight && (
                <span className="absolute -top-2 right-4 px-2 py-0.5 text-[10px] font-medium bg-primary text-primary-foreground rounded-full">
                  {feature.highlight}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Highlights bar */}
        <div className="bg-card/50 border border-border rounded-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
