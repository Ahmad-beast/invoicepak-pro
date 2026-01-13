import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ahmed Khan',
    role: 'Freelance Developer',
    avatar: 'AK',
    content: 'InvoicePK has completely transformed how I handle my freelance billing. The USD to PKR conversion is a lifesaver!',
    rating: 5,
  },
  {
    name: 'Sara Malik',
    role: 'UI/UX Designer',
    avatar: 'SM',
    content: 'Finally, an invoicing tool built for Pakistani freelancers. Clean, professional, and incredibly easy to use.',
    rating: 5,
  },
  {
    name: 'Hassan Ali',
    role: 'Content Writer',
    avatar: 'HA',
    content: 'I used to spend hours on invoices. Now it takes me less than a minute. Highly recommend to all remote workers!',
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
