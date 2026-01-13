import { 
  FileText, 
  DollarSign, 
  Download, 
  Clock, 
  Shield, 
  Globe,
  Smartphone,
  BarChart3
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Professional Invoices',
    description: 'Create stunning, professional invoices that impress your clients and get you paid faster.',
  },
  {
    icon: DollarSign,
    title: 'USD to PKR Conversion',
    description: 'Automatic real-time currency conversion so you always know your earnings in PKR.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download beautiful PDF invoices ready to share with clients via email or messaging.',
  },
  {
    icon: Clock,
    title: 'Quick Creation',
    description: 'Create complete invoices in under a minute with our intuitive, streamlined interface.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared. We take your privacy seriously.',
  },
  {
    icon: Globe,
    title: 'Work Globally',
    description: 'Invoice clients worldwide with multi-currency support and professional formatting.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your invoices anywhere. Fully responsive design works on all devices.',
  },
  {
    icon: BarChart3,
    title: 'Track Payments',
    description: 'Monitor invoice status and track your earnings with a simple dashboard.',
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Everything You Need to Get Paid
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Powerful features designed specifically for Pakistani freelancers and remote workers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
