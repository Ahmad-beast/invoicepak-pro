import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed Khan',
    role: 'Freelance Developer',
    company: 'Upwork Top Rated',
    avatar: 'AK',
    content: 'InvoicePK has completely transformed how I handle my freelance billing. The USD to PKR conversion is a lifesaver! I used to spend hours calculating exchange rates.',
    rating: 5,
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    name: 'Sara Malik',
    role: 'UI/UX Designer',
    company: 'Fiverr Level 2 Seller',
    avatar: 'SM',
    content: 'Finally, an invoicing tool built for Pakistani freelancers. Clean, professional, and incredibly easy to use. My clients love the professional-looking invoices!',
    rating: 5,
    gradient: 'from-chart-2/20 to-chart-2/5',
  },
  {
    name: 'Hassan Ali',
    role: 'Content Writer',
    company: 'Remote Writer',
    avatar: 'HA',
    content: 'I used to spend hours on invoices. Now it takes me less than a minute. Highly recommend to all remote workers! The PDF export feature is perfect.',
    rating: 5,
    gradient: 'from-chart-1/20 to-chart-1/5',
  },
  {
    name: 'Fatima Zahra',
    role: 'Digital Marketer',
    company: 'Marketing Consultant',
    avatar: 'FZ',
    content: 'The automatic PKR conversion saves me so much time. I can focus on my work instead of worrying about currency calculations. Brilliant tool!',
    rating: 5,
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    name: 'Omar Farooq',
    role: 'Full Stack Developer',
    company: 'Freelance Pro',
    avatar: 'OF',
    content: 'Been using InvoicePK for 6 months now. The dashboard helps me track all my payments and I never miss a due date. Essential for any Pakistani freelancer.',
    rating: 5,
    gradient: 'from-chart-2/20 to-chart-2/5',
  },
  {
    name: 'Ayesha Siddiqui',
    role: 'Virtual Assistant',
    company: 'VA Services',
    avatar: 'AS',
    content: 'Simple, clean, and does exactly what it promises. Creating professional invoices has never been easier. Love the dark theme too!',
    rating: 5,
    gradient: 'from-chart-1/20 to-chart-1/5',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Loved by Freelancers
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Join thousands of Pakistani freelancers who trust InvoicePK for their invoicing needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 ${
                index === 1 ? 'md:translate-y-4' : ''
              }`}
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center border border-border`}>
                  <span className="text-foreground font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-primary">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            <span className="text-foreground font-semibold">4.9/5</span> average rating from 500+ reviews
          </p>
        </div>
      </div>
    </section>
  );
};
