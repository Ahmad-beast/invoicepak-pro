import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight, Lightbulb, CheckCircle2, XCircle, FileText, Clock, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";

const InvoiceGuide = () => {
  const [activeSection, setActiveSection] = useState("");

  const tocItems = [
    { id: "what-is-invoice", label: "What Is an Invoice?" },
    { id: "why-invoices-matter", label: "Why Invoices Matter" },
    { id: "essential-components", label: "Essential Components" },
    { id: "step-by-step", label: "Step-by-Step Guide" },
    { id: "industry-templates", label: "Industry Templates" },
    { id: "tips-faster-payment", label: "Tips for Faster Payment" },
    { id: "common-mistakes", label: "Common Mistakes" },
    { id: "payment-terms", label: "Payment Terms Explained" },
    { id: "late-payments", label: "Handling Late Payments" },
    { id: "faq", label: "FAQ" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title="How to Create a Professional Invoice: Ultimate Guide 2026"
        description="Learn how to create professional invoices that get you paid faster. Complete guide covering invoice components, templates, payment terms, and tips for freelancers & small businesses."
        keywords="how to create invoice, professional invoice, invoice template, invoice generator, freelancer invoice, small business invoice, invoice tips, get paid faster, invoice payment terms"
        canonical="/blog/invoice-guide"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-12 md:py-16 border-b bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4">
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/blog">Blog</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Invoice Guide</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  January 27, 2026
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  InvoicePak Team
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  12 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                How to Create a Professional Invoice: The Ultimate Guide for Freelancers & Small Businesses (2026)
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Creating professional invoices is essential for running a successful business. Whether you're a freelancer, small business owner, or entrepreneur, knowing how to create an invoice properly ensures you get paid on time and maintain a professional image.
              </p>
            </div>
          </section>

          {/* Content with TOC */}
          <section className="py-12">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Table of Contents - Desktop Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0">
                  <div className="sticky top-24">
                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {tocItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block text-left text-sm py-1 transition-colors w-full ${
                            activeSection === item.id
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </nav>

                    <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <FileText className="h-6 w-6 text-primary mb-2" />
                      <p className="text-sm font-medium mb-2">Ready to create your invoice?</p>
                      <Button size="sm" className="w-full" asChild>
                        <Link to="/">
                          Try Free Generator
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </aside>

                {/* Main Content */}
                <article className="flex-1 max-w-3xl">
                  {/* Mobile TOC */}
                  <div className="lg:hidden mb-8 p-4 bg-muted/50 rounded-lg border">
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                      Quick Navigation
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tocItems.slice(0, 5).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className="text-xs px-3 py-1.5 bg-background rounded-full border hover:border-primary transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none">
                    {/* What Is an Invoice */}
                    <section id="what-is-invoice" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">What Is an Invoice?</h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        An invoice is a document sent by a seller to a buyer that lists the products or services provided along with the amount owed. It serves as a formal payment request and creates a record of the transaction for both parties.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Think of an invoice as a bridge between completing your work and receiving payment. A well-crafted invoice not only requests payment but also reflects your professionalism and attention to detail.
                      </p>

                      <h3 className="text-xl font-semibold mb-4">Invoice vs. Bill vs. Receipt: What's the Difference?</h3>
                      <p className="text-muted-foreground mb-4">
                        Many people confuse these three documents, but they serve different purposes:
                      </p>
                      <div className="overflow-x-auto mb-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-semibold">Document</TableHead>
                              <TableHead className="font-semibold">Purpose</TableHead>
                              <TableHead className="font-semibold">When It's Used</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Invoice</TableCell>
                              <TableCell>A request for payment</TableCell>
                              <TableCell>Sent before payment is received</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Bill</TableCell>
                              <TableCell>A statement of amount owed</TableCell>
                              <TableCell>Similar to invoice, often used interchangeably</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Receipt</TableCell>
                              <TableCell>Proof of payment</TableCell>
                              <TableCell>Issued after payment is received</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </section>

                    {/* Why Professional Invoices Matter */}
                    <section id="why-invoices-matter" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Professional Invoices Matter</h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Professional invoices do more than just request payment. Here's why they're important:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span><strong>Faster Payments:</strong> Clear, professional invoices are easier to process, leading to quicker payments</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span><strong>Legal Protection:</strong> Invoices serve as legal documents that can be used in disputes</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span><strong>Tax Compliance:</strong> Proper invoices help with accurate tax reporting</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span><strong>Brand Image:</strong> Well-designed invoices reinforce your professional reputation</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span><strong>Financial Tracking:</strong> Invoices help you monitor cash flow and outstanding payments</span>
                        </li>
                      </ul>
                    </section>

                    {/* Essential Components */}
                    <section id="essential-components" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Essential Components of a Professional Invoice</h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Every professional invoice must include these key elements:
                      </p>

                      <div className="space-y-6">
                        <div className="p-4 border rounded-lg bg-card">
                          <h3 className="text-lg font-semibold mb-2">1. Your Business Information</h3>
                          <p className="text-muted-foreground mb-3">Place your business details prominently at the top:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                            <li>Business name or your full name (for freelancers)</li>
                            <li>Logo (if you have one)</li>
                            <li>Address, phone number, email address</li>
                            <li>Website URL and tax identification number (if applicable)</li>
                          </ul>
                        </div>

                        <div className="p-4 border rounded-lg bg-card">
                          <h3 className="text-lg font-semibold mb-2">2. Client Information</h3>
                          <p className="text-muted-foreground mb-3">Include your client's complete details:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                            <li>Company name or individual's name</li>
                            <li>Billing address</li>
                            <li>Contact person's name and email address</li>
                          </ul>
                        </div>

                        <div className="p-4 border rounded-lg bg-card">
                          <h3 className="text-lg font-semibold mb-2">3. Invoice Details</h3>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                            <li><strong>Invoice Number:</strong> Use a unique, sequential numbering system (e.g., INV-001, INV-002)</li>
                            <li><strong>Invoice Date:</strong> The date you're issuing the invoice</li>
                            <li><strong>Due Date:</strong> When payment is expected</li>
                            <li><strong>Payment Terms:</strong> Net 15, Net 30, or custom terms</li>
                          </ul>
                        </div>

                        <div className="p-4 border rounded-lg bg-card">
                          <h3 className="text-lg font-semibold mb-2">4. Itemized List of Products or Services</h3>
                          <p className="text-muted-foreground mb-3">This is the heart of your invoice. Include:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                            <li>Clear description of each item or service</li>
                            <li>Quantity or hours worked</li>
                            <li>Rate or unit price</li>
                            <li>Line total for each item</li>
                          </ul>
                        </div>

                        <div className="p-4 border rounded-lg bg-card">
                          <h3 className="text-lg font-semibold mb-2">5. Payment Summary & Instructions</h3>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                            <li>Subtotal (before taxes), tax amount and rate</li>
                            <li>Discounts (if any) and <strong>Total Amount Due</strong></li>
                            <li>Accepted payment methods and bank account details</li>
                            <li>Late payment policy and thank you message</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Pro Tip Box */}
                    <div className="my-8 p-6 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground mb-2">Pro Tip: Make Payment Easy</p>
                          <p className="text-muted-foreground">
                            Offer multiple payment options and include direct payment links when possible. The easier you make it to pay, the faster you'll receive payment. Consider adding QR codes for instant mobile payments!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Guide */}
                    <section id="step-by-step" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">How to Create an Invoice: Step-by-Step Guide</h2>
                      
                      <h3 className="text-xl font-semibold mb-4">Method 1: Using a Free Online Invoice Generator</h3>
                      <p className="text-muted-foreground mb-4">
                        The fastest and easiest way to create professional invoices is using a free invoice generator:
                      </p>
                      <ol className="space-y-3 mb-6 list-decimal ml-6">
                        <li className="text-muted-foreground">Choose a reliable invoice generator tool</li>
                        <li className="text-muted-foreground">Enter your business information (name, logo, address, contact details)</li>
                        <li className="text-muted-foreground">Add your client's information</li>
                        <li className="text-muted-foreground">Input a unique invoice number and dates</li>
                        <li className="text-muted-foreground">List your products or services with descriptions and prices</li>
                        <li className="text-muted-foreground">Add taxes, discounts, and calculate the total</li>
                        <li className="text-muted-foreground">Include payment terms and instructions</li>
                        <li className="text-muted-foreground">Review for accuracy</li>
                        <li className="text-muted-foreground">Download as PDF or send directly via email</li>
                      </ol>

                      <h3 className="text-xl font-semibold mb-4">Method 2: Creating an Invoice from Scratch</h3>
                      <p className="text-muted-foreground mb-4">
                        If you prefer manual creation, you can use Microsoft Word, Excel, or Google Docs. However, this method is more time-consuming and prone to errors.
                      </p>
                    </section>

                    {/* CTA Button */}
                    <div className="my-10 text-center p-8 bg-muted/50 rounded-xl border">
                      <h3 className="text-xl font-bold mb-2">Create Your Professional Invoice Now</h3>
                      <p className="text-muted-foreground mb-4">
                        No signup required. Generate and download your invoice in minutes.
                      </p>
                      <Button size="lg" asChild>
                        <Link to="/">
                          Create Free Invoice
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>

                    {/* Industry Templates */}
                    <section id="industry-templates" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Invoice Templates for Different Industries</h2>
                      <p className="text-muted-foreground mb-4">
                        Different businesses have different invoicing needs. Here are some common invoice types:
                      </p>
                      <div className="overflow-x-auto mb-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-semibold">Industry</TableHead>
                              <TableHead className="font-semibold">Key Elements to Include</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Freelancers</TableCell>
                              <TableCell>Hourly rates, project milestones, revision fees</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Consultants</TableCell>
                              <TableCell>Consultation hours, travel expenses, materials</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Contractors</TableCell>
                              <TableCell>Labor costs, materials, permits, change orders</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Retail</TableCell>
                              <TableCell>Product SKUs, quantities, shipping costs</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Service Businesses</TableCell>
                              <TableCell>Service descriptions, packages, recurring fees</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </section>

                    {/* Tips for Faster Payment */}
                    <section id="tips-faster-payment" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Tips for Creating Invoices That Get Paid Faster</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">1. Send Invoices Promptly</h3>
                          <p className="text-muted-foreground">
                            Don't wait weeks after completing work. Send your invoice immediately while the project is fresh in the client's mind.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">2. Use Clear, Professional Language</h3>
                          <p className="text-muted-foreground">
                            Avoid jargon and be specific about what you're charging for. Instead of "Design work - $500," write "Logo design including 3 concepts and 2 revisions - $500."
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">3. Set Clear Payment Terms</h3>
                          <p className="text-muted-foreground">
                            Specify exactly when payment is due. "Net 30" means payment is due 30 days from the invoice date. Consider offering early payment discounts like "2% off if paid within 10 days."
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">4. Include Late Payment Fees</h3>
                          <p className="text-muted-foreground">
                            Mention any late payment penalties upfront. For example: "A 2% late fee will be applied to payments received after the due date."
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">5. Keep Consistent Branding</h3>
                          <p className="text-muted-foreground">
                            Use your logo, brand colors, and fonts consistently across all invoices. This builds recognition and trust.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Common Mistakes */}
                    <section id="common-mistakes" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Common Invoicing Mistakes to Avoid</h2>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <span><strong>Forgetting to include invoice numbers</strong> – Makes tracking and follow-up difficult</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <span><strong>Vague descriptions</strong> – Leads to client confusion and payment delays</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <span><strong>Missing contact information</strong> – Clients can't reach you with questions</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <span><strong>Incorrect calculations</strong> – Damages your credibility</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <span><strong>Not specifying payment terms</strong> – Creates ambiguity about when payment is due</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <span><strong>Sending invoices late</strong> – Out of sight, out of mind</span>
                        </div>
                      </div>
                    </section>

                    {/* Payment Terms */}
                    <section id="payment-terms" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Invoice Payment Terms Explained</h2>
                      <p className="text-muted-foreground mb-4">
                        Understanding payment terms helps you communicate clearly with clients:
                      </p>
                      <div className="overflow-x-auto mb-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-semibold">Term</TableHead>
                              <TableHead className="font-semibold">Meaning</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Due on Receipt</TableCell>
                              <TableCell>Payment expected immediately</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Net 15</TableCell>
                              <TableCell>Payment due within 15 days</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Net 30</TableCell>
                              <TableCell>Payment due within 30 days</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Net 60</TableCell>
                              <TableCell>Payment due within 60 days</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">2/10 Net 30</TableCell>
                              <TableCell>2% discount if paid within 10 days, otherwise due in 30 days</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">50% Upfront</TableCell>
                              <TableCell>Half payment before work begins</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </section>

                    {/* Late Payments */}
                    <section id="late-payments" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">How to Handle Late Payments</h2>
                      <p className="text-muted-foreground mb-4">
                        Late payments are frustrating but common. Here's how to handle them professionally:
                      </p>
                      <ol className="space-y-3 list-decimal ml-6">
                        <li className="text-muted-foreground"><strong>Send a friendly reminder</strong> on the due date</li>
                        <li className="text-muted-foreground"><strong>Follow up</strong> 7 days after the due date with a second reminder</li>
                        <li className="text-muted-foreground"><strong>Make a phone call</strong> if the invoice is 14+ days overdue</li>
                        <li className="text-muted-foreground"><strong>Send a final notice</strong> stating potential consequences</li>
                        <li className="text-muted-foreground"><strong>Consider a collection agency</strong> as a last resort</li>
                      </ol>
                    </section>

                    {/* Pro Tip Box 2 */}
                    <div className="my-8 p-6 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground mb-2">Pro Tip: Automate Your Follow-ups</p>
                          <p className="text-muted-foreground">
                            Use invoicing tools that can automatically send payment reminders. This removes the awkwardness of chasing payments and ensures you never forget to follow up.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ Section */}
                    <section id="faq" className="scroll-mt-24 mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">What information is legally required on an invoice?</h3>
                          <p className="text-muted-foreground">
                            At minimum, an invoice should include: your business name and contact info, client details, unique invoice number, date, description of goods/services, amounts, and total due. Tax requirements vary by country.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">How do I number my invoices?</h3>
                          <p className="text-muted-foreground">
                            Use a sequential numbering system starting with multiple digits (e.g., INV-0001). You can also incorporate dates or client codes for easier organization.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">Should I charge tax on my invoices?</h3>
                          <p className="text-muted-foreground">
                            This depends on your location, business type, and whether you're registered for taxes like GST, VAT, or sales tax. Consult with a tax professional for guidance specific to your situation.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">What's the best format for sending invoices?</h3>
                          <p className="text-muted-foreground">
                            PDF is the most professional and universally accepted format. It preserves your formatting and prevents accidental edits.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2">How long should I keep invoice records?</h3>
                          <p className="text-muted-foreground">
                            Most tax authorities recommend keeping invoices for at least 5-7 years. Digital storage makes this easy and cost-effective.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Conclusion */}
                    <section className="mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Conclusion</h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Creating professional invoices doesn't have to be complicated. With the right tools and knowledge, you can create invoices that get you paid faster and enhance your professional image.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Remember the key elements: clear business and client information, unique invoice numbers, detailed descriptions, accurate calculations, and straightforward payment terms. Whether you use a free invoice generator or create invoices manually, consistency and professionalism are what matter most.
                      </p>
                    </section>

                    {/* Final CTA */}
                    <div className="my-10 text-center p-8 bg-primary text-primary-foreground rounded-xl">
                      <h3 className="text-2xl font-bold mb-3">Ready to Create Professional Invoices?</h3>
                      <p className="mb-6 opacity-90">
                        Start creating professional invoices today—no signup required. Our free invoice generator makes it simple.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button size="lg" variant="secondary" asChild>
                          <Link to="/">
                            Create Your Free Invoice Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                      <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm opacity-80">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> No signup required
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Professional templates
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Instant PDF download
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default InvoiceGuide;
