import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How does the USD to PKR conversion work?',
    answer:
      'We provide default exchange rates that are regularly updated. You can also set a custom exchange rate on Pro plans for maximum accuracy. The conversion is shown on both the invoice preview and the exported PDF.',
  },
  {
    question: 'Can I customize my invoices?',
    answer:
      'Yes! All plans let you add client details, line items, notes, and choose from 8 currencies. Pro users can additionally add their company logo, custom branding, invoice templates, and remove InvoicePK watermarks.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use industry-standard encryption and Firebase security. Your invoice data is stored securely and never shared with third parties.',
  },
  {
    question: 'Can I export invoices as PDF?',
    answer:
      'Yes, all plans include PDF export functionality. You can download professional PDF invoices with itemized billing, currency conversion, and your branding (Pro).',
  },
  {
    question: 'Which currencies are supported?',
    answer:
      'We support 8 currencies: USD, PKR, GBP, EUR, AED, SAR, CAD, and AUD. Each currency is properly formatted with its symbol and locale.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 7-day money-back guarantee on all paid plans. If you are not satisfied, contact our support team for a full refund.',
  },
];

export const FAQ = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Got questions? We have answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-xl px-6 bg-card hover:border-primary/30 transition-colors"
            >
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
