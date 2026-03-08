import { Users, FileText, DollarSign, Globe, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: '5,000+', label: 'Active Freelancers', trend: '+23% this month', color: 'text-primary bg-primary/10 border-primary/20' },
  { icon: FileText, value: '50,000+', label: 'Invoices Created', trend: '+156 today', color: 'text-chart-5 bg-chart-5/10 border-chart-5/20' },
  { icon: DollarSign, value: '$2M+', label: 'Processed', trend: '+$50K this week', color: 'text-chart-2 bg-chart-2/10 border-chart-2/20' },
  { icon: Globe, value: '30+', label: 'Countries', trend: '5 new this month', color: 'text-chart-4 bg-chart-4/10 border-chart-4/20' },
];

export const Stats = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3" />
      <div className="absolute inset-0 border-y border-border/30" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="group text-center p-6 rounded-2xl glass glass-hover"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.color} border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-1 group-hover:text-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground mb-2">
                {stat.label}
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-chart-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
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
