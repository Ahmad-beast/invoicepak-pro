import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the USD to PKR conversion work?',
    answer:
      'We fetch real-time exchange rates to automatically convert your invoice amounts from USD to PKR. This helps you and your clients understand the local currency equivalent.',
  },
  {
    question: 'Can I customize my invoices?',
    answer:
      'Yes! You can add your business details, logo, and customize the invoice layout. Pro and Business plans offer additional customization options.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use industry-standard encryption and security practices. Your invoice data is stored securely and never shared with third parties.',
  },
  {
    question: 'Can I export invoices as PDF?',
    answer:
      'Yes, all plans include PDF export functionality. You can download and share professional PDF invoices with your clients.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 7-day money-back guarantee on all paid plans. If you are not satisfied, contact our support team for a full refund.',
  },
];

export const FAQ = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4">
            Got questions? We have answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
