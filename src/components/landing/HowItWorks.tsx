import { FileText, Send, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    step: '01',
    title: 'Create Invoice',
    description: 'Fill in client details, add line items, and set your rates in USD.',
  },
  {
    icon: Send,
    step: '02',
    title: 'Send to Client',
    description: 'Download as PDF or share directly with your client via email.',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Get Paid',
    description: 'Track payment status and see PKR conversion in real-time.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Get Paid in 3 Simple Steps
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Our streamlined process makes invoicing effortless so you can focus on what you do best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/10" />
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <span className="text-primary font-bold text-sm mb-2">{step.step}</span>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
