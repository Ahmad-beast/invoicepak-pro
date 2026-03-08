import { FileText, Send, CreditCard, ArrowRight } from 'lucide-react';

const steps = [
  { icon: FileText, step: '01', title: 'Create Invoice', description: 'Fill in client details, add line items, and set your rates in any currency.', color: 'text-primary bg-primary/10 border-primary/20' },
  { icon: Send, step: '02', title: 'Send to Client', description: 'Download a beautiful PDF or share directly via a secure link.', color: 'text-chart-5 bg-chart-5/10 border-chart-5/20' },
  { icon: CreditCard, step: '03', title: 'Get Paid', description: 'Track payment status and see PKR conversion in real-time on your dashboard.', color: 'text-chart-2 bg-chart-2/10 border-chart-2/20' },
];

export const HowItWorks = () => {
  return (
    <section className="py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-bold uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4 tracking-tight">
            Get Paid in <span className="text-gradient-primary">3 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg">
            Our streamlined process makes invoicing effortless so you can focus on what you do best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-14 left-[calc(50%+60px)] w-[calc(100%-120px)] items-center justify-center">
                  <div className="w-full h-px bg-gradient-to-r from-primary/40 to-primary/10" />
                  <ArrowRight className="w-4 h-4 text-primary/40 -ml-1 flex-shrink-0" />
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className={`w-28 h-28 rounded-3xl ${step.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 glow-primary`}>
                  <step.icon className="w-12 h-12" />
                </div>
                <span className="text-primary font-extrabold text-xs mb-2 tracking-[0.2em] uppercase">{step.step}</span>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
