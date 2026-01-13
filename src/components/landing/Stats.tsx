import { Users, FileText, DollarSign, Globe } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '5,000+',
    label: 'Active Freelancers',
    description: 'Trust InvoicePK for their billing',
  },
  {
    icon: FileText,
    value: '50,000+',
    label: 'Invoices Created',
    description: 'Professional invoices generated',
  },
  {
    icon: DollarSign,
    value: '$2M+',
    label: 'Processed',
    description: 'Total invoice value handled',
  },
  {
    icon: Globe,
    value: '30+',
    label: 'Countries',
    description: 'Clients served worldwide',
  },
];

export const Stats = () => {
  return (
    <section className="py-16 px-4 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
