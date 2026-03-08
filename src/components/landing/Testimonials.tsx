import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Ahmed Khan', role: 'Freelance Developer', company: 'Upwork Top Rated', avatar: 'AK', content: 'InvoicePK has completely transformed how I handle my freelance billing. The USD to PKR conversion is a lifesaver!', rating: 5 },
  { name: 'Sara Malik', role: 'UI/UX Designer', company: 'Fiverr Level 2 Seller', avatar: 'SM', content: 'Finally, an invoicing tool built for Pakistani freelancers. Clean, professional, and incredibly easy to use.', rating: 5 },
  { name: 'Hassan Ali', role: 'Content Writer', company: 'Remote Writer', avatar: 'HA', content: 'I used to spend hours on invoices. Now it takes me less than a minute. Highly recommend to all remote workers!', rating: 5 },
  { name: 'Fatima Zahra', role: 'Digital Marketer', company: 'Marketing Consultant', avatar: 'FZ', content: 'The automatic PKR conversion saves me so much time. I can focus on my work instead of currency calculations.', rating: 5 },
  { name: 'Omar Farooq', role: 'Full Stack Developer', company: 'Freelance Pro', avatar: 'OF', content: 'Been using InvoicePK for 6 months. The dashboard helps me track all payments. Essential for any Pakistani freelancer.', rating: 5 },
  { name: 'Ayesha Siddiqui', role: 'Virtual Assistant', company: 'VA Services', avatar: 'AS', content: 'Simple, clean, and does exactly what it promises. Creating professional invoices has never been easier!', rating: 5 },
];

export const Testimonials = () => {
  return (
    <section className="py-28 px-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-bold uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4 tracking-tight">
            Loved by <span className="text-gradient-primary">Freelancers</span>
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg">
            Join thousands of Pakistani freelancers who trust InvoicePK for their invoicing needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`group relative p-6 rounded-2xl glass glass-hover hover:-translate-y-1 ${
                index === 1 || index === 4 ? 'lg:translate-y-4' : ''
              }`}
            >
              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote className="w-12 h-12 text-primary" />
              </div>

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-chart-4 text-chart-4" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">"{testimonial.content}"</p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-primary font-medium">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass">
            <Star className="w-4 h-4 fill-chart-4 text-chart-4" />
            <span className="text-sm text-foreground font-semibold">4.9/5</span>
            <span className="text-sm text-muted-foreground">average from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};
