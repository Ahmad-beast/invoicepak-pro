import { Users, FileText, DollarSign, Globe, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '5,000+',
    label: 'Active Freelancers',
    description: 'Trust InvoicePK for their billing',
    trend: '+23% this month',
  },
  {
    icon: FileText,
    value: '50,000+',
    label: 'Invoices Created',
    description: 'Professional invoices generated',
    trend: '+156 today',
  },
  {
    icon: DollarSign,
    value: '$2M+',
    label: 'Processed',
    description: 'Total invoice value handled',
    trend: '+$50K this week',
  },
  {
    icon: Globe,
    value: '30+',
    label: 'Countries',
    description: 'Clients served worldwide',
    trend: '5 new this month',
  },
];

export const Stats = () => {
  return (
    <section className="py-16 px-4 bg-primary/5 border-y border-primary/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="group text-center p-4 rounded-2xl hover:bg-card/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 group-hover:scale-110 transform">
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {stat.description}
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
