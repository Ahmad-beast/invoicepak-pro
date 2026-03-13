import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Clock, Rocket, Target, DollarSign, GraduationCap, Briefcase, TrendingUp, CheckCircle, Star, Zap, Globe } from "lucide-react";

const tableOfContents = [
  { id: "why-now", label: "Why 2026 Is the Best Time" },
  { id: "step-1", label: "Step 1: Pick Your Skill" },
  { id: "step-2", label: "Step 2: Learn for Free" },
  { id: "step-3", label: "Step 3: Build a Portfolio" },
  { id: "step-4", label: "Step 4: Create Profiles" },
  { id: "step-5", label: "Step 5: Win Your First Client" },
  { id: "step-6", label: "Step 6: Get Paid in Pakistan" },
  { id: "step-7", label: "Step 7: Send Professional Invoices" },
  { id: "income-roadmap", label: "Income Roadmap" },
  { id: "mistakes", label: "Biggest Mistakes to Avoid" },
  { id: "faq", label: "FAQ" },
];

const StartFreelancingPakistan2026 = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const shareUrl = encodeURIComponent("https://invoicepak-pro.vercel.app/blog/start-freelancing-pakistan-2026");
  const shareText = encodeURIComponent("How to Start Freelancing in Pakistan in 2026 — Complete Step-by-Step Guide 🚀🇵🇰");

  return (
    <>
      <SEO
        title="How to Start Freelancing in Pakistan 2026 — Complete Beginner Guide"
        description="Step-by-step guide to start freelancing in Pakistan in 2026. Learn which skills to pick, where to find clients, how to get paid, and earn $500-$3000/month from home."
        keywords="how to start freelancing in pakistan, freelancing for beginners pakistan, online earning pakistan 2026, earn money online pakistan, freelancing pakistan guide, upwork pakistan, fiverr pakistan, how to earn dollars in pakistan, freelance skills pakistan 2026, remote work pakistan"
        canonical="/blog/start-freelancing-pakistan-2026"
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

              {/* Sidebar TOC */}
              <aside className="hidden lg:block lg:w-64 shrink-0">
                <div className="sticky top-24">
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm text-foreground mb-3">Table of Contents</h3>
                      <nav className="space-y-1">
                        {tableOfContents.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="block w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded hover:bg-muted/50"
                          >
                            {item.label}
                          </button>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>

                  {/* Share */}
                  <Card className="border-border/50 mt-4">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm text-foreground mb-3">Share This Guide</h3>
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center text-xs bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition-colors"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center text-xs bg-blue-700 text-white py-2 px-3 rounded-md hover:bg-blue-800 transition-colors"
                        >
                          LinkedIn
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>

              {/* Main Content */}
              <article className="flex-1 max-w-3xl">

                {/* Mobile TOC */}
                <Card className="lg:hidden mb-8 border-border/50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-foreground mb-3">Quick Navigation</h3>
                    <div className="flex flex-wrap gap-2">
                      {tableOfContents.slice(0, 6).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className="text-xs text-muted-foreground hover:text-primary bg-muted/50 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Header */}
                <header className="mb-10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span>18 min read</span>
                    <span className="mx-2">•</span>
                    <span>Updated March 2026</span>
                  </div>
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                    How to Start Freelancing in Pakistan in 2026: The Complete Step-by-Step Guide for Beginners
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    From zero experience to earning $500–$3,000/month from home. Everything a Pakistani beginner needs to know — skills, platforms, payments, and invoicing.
                  </p>
                </header>

                {/* Why Now */}
                <section id="why-now" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Rocket className="h-7 w-7 text-primary" />
                    Why 2026 Is the Best Time to Start Freelancing in Pakistan
                  </h2>

                  <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-muted-foreground mb-6">
                    "Pakistani freelancers earned a record $557 million in just the first half of FY2026 — a 58% increase. The industry is exploding, and there's never been a better time to start."
                  </blockquote>

                  <p className="text-foreground leading-relaxed mb-4">
                    Pakistan is now one of the <strong>top 4 freelancing countries in the world</strong>. With over <strong>3 million active freelancers</strong>, the government actively supporting IT exports, and the dollar rate making USD earnings incredibly valuable, starting your freelance career in 2026 could genuinely change your life.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 my-8">
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-5 text-center">
                        <p className="text-3xl font-bold text-primary">$1.1B+</p>
                        <p className="text-sm text-muted-foreground mt-1">Projected freelance exports in FY2026</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-5 text-center">
                        <p className="text-3xl font-bold text-primary">58%</p>
                        <p className="text-sm text-muted-foreground mt-1">Year-over-year growth rate</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-5 text-center">
                        <p className="text-3xl font-bold text-primary">Rs 280K+</p>
                        <p className="text-sm text-muted-foreground mt-1">Average monthly income for skilled freelancers</p>
                      </CardContent>
                    </Card>
                  </div>

                  <p className="text-foreground leading-relaxed">
                    Here's the best part: <strong>you don't need a degree, an office, or startup capital</strong>. All you need is a laptop, internet, and this guide. Let's walk through every step.
                  </p>
                </section>

                {/* Step 1 */}
                <section id="step-1" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Target className="h-7 w-7 text-primary" />
                    Step 1: Pick the Right Freelance Skill (Don't Skip This)
                  </h2>

                  <p className="text-foreground leading-relaxed mb-4">
                    The #1 mistake beginners make? Trying to learn everything at once. Pick <strong>one skill</strong>, master it, and start earning. You can always expand later.
                  </p>

                  <p className="text-foreground leading-relaxed mb-6">
                    Here are the <strong>highest-paying freelance skills in Pakistan for 2026</strong>, ranked by demand and earning potential:
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Skill</TableHead>
                          <TableHead>Hourly Rate (USD)</TableHead>
                          <TableHead>Monthly Potential (PKR)</TableHead>
                          <TableHead>Difficulty to Learn</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          ["AI & Machine Learning", "$40–$100", "Rs 500K–1.2M", "Hard"],
                          ["Full-Stack Web Dev", "$25–$60", "Rs 300K–700K", "Medium"],
                          ["UI/UX Design", "$20–$50", "Rs 250K–600K", "Medium"],
                          ["Video Editing", "$15–$40", "Rs 180K–480K", "Easy-Medium"],
                          ["Copywriting & SEO", "$15–$35", "Rs 180K–420K", "Easy"],
                          ["WordPress Development", "$15–$30", "Rs 180K–360K", "Easy"],
                          ["Social Media Marketing", "$10–$30", "Rs 120K–360K", "Easy"],
                          ["Virtual Assistant", "$8–$20", "Rs 100K–240K", "Easy"],
                          ["Graphic Design", "$10–$25", "Rs 120K–300K", "Easy-Medium"],
                          ["Data Entry & Admin", "$5–$12", "Rs 60K–145K", "Very Easy"],
                        ].map(([skill, rate, monthly, difficulty]) => (
                          <TableRow key={skill}>
                            <TableCell className="font-medium">{skill}</TableCell>
                            <TableCell>{rate}</TableCell>
                            <TableCell className="text-primary font-semibold">{monthly}</TableCell>
                            <TableCell>{difficulty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Card className="bg-muted/50 border-border/50">
                    <CardContent className="p-5">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span><strong>Pro Tip:</strong> If you're a complete beginner, start with <strong>WordPress Development</strong>, <strong>Copywriting</strong>, or <strong>Virtual Assistant</strong> work. These skills are easiest to learn and have the most available jobs. You can move to higher-paying skills as you gain experience.</span>
                      </p>
                    </CardContent>
                  </Card>
                </section>

                {/* Step 2 */}
                <section id="step-2" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <GraduationCap className="h-7 w-7 text-primary" />
                    Step 2: Learn Your Skill for Free (Best Resources)
                  </h2>

                  <p className="text-foreground leading-relaxed mb-6">
                    You do NOT need expensive courses. Here are the <strong>best free resources</strong> available to Pakistani freelancers in 2026:
                  </p>

                  <div className="space-y-4 mb-6">
                    {[
                      { title: "DigiSkills.pk (Government Program)", desc: "Free courses in WordPress, graphic design, SEO, and freelancing — with certificates. Perfect for beginners.", icon: "🇵🇰" },
                      { title: "YouTube University", desc: "Channels like Hisham Sarwar, Noman Said, and international creators offer complete roadmaps for free.", icon: "📺" },
                      { title: "Google Skillshop", desc: "Free Google Ads, Analytics, and digital marketing certifications that clients actually value.", icon: "🎓" },
                      { title: "freeCodeCamp & The Odin Project", desc: "World-class web development training, 100% free. These alone can make you job-ready.", icon: "💻" },
                      { title: "Canva Design School", desc: "Learn graphic design fundamentals free. Canva is also a tool many clients use.", icon: "🎨" },
                    ].map((resource) => (
                      <Card key={resource.title} className="border-border/50">
                        <CardContent className="p-4 flex items-start gap-4">
                          <span className="text-2xl">{resource.icon}</span>
                          <div>
                            <h4 className="font-semibold text-foreground">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{resource.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-muted/50 border-border/50">
                    <CardContent className="p-5">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span><strong>Speed Hack:</strong> Don't try to "finish" a course before starting. Learn for 2-3 weeks, then start applying for jobs. You'll learn 10x faster with real projects.</span>
                      </p>
                    </CardContent>
                  </Card>
                </section>

                {/* Step 3 */}
                <section id="step-3" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Briefcase className="h-7 w-7 text-primary" />
                    Step 3: Build a Portfolio (Even Without Clients)
                  </h2>

                  <p className="text-foreground leading-relaxed mb-4">
                    No experience? No problem. Here's how to build a portfolio from scratch:
                  </p>

                  <div className="space-y-4 mb-6">
                    {[
                      { title: "Create Sample Projects", desc: "Build 3-5 projects as if they were for real clients. A WordPress site for a fictional restaurant. A logo for a made-up brand. A blog post for an imaginary startup." },
                      { title: "Do Free Work Strategically", desc: "Offer free work to 1-2 local businesses or NGOs. This gives you real testimonials and portfolio pieces. Don't overdo it — 2 free projects max." },
                      { title: "Document Everything", desc: "Take before/after screenshots, write case studies explaining your process, and save all client feedback." },
                      { title: "Build Your Online Presence", desc: "Create a simple portfolio on Behance (design), GitHub (development), or a free WordPress site. This makes you look professional instantly." },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                        <span className="flex items-center justify-center h-8 w-8 bg-primary text-primary-foreground rounded-full text-sm font-bold shrink-0">{i + 1}</span>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Step 4 */}
                <section id="step-4" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Globe className="h-7 w-7 text-primary" />
                    Step 4: Create Profiles on Freelance Platforms
                  </h2>

                  <p className="text-foreground leading-relaxed mb-6">
                    Don't limit yourself to one platform. Create profiles on multiple platforms and focus on 1-2 that work best for your skill:
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Platform</TableHead>
                          <TableHead>Best For</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Pakistan Friendly?</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          ["Upwork", "Long-term projects, all skills", "10%", "✅ Excellent"],
                          ["Fiverr", "Quick gigs, creative work", "20%", "✅ Excellent"],
                          ["Toptal", "Senior devs & designers", "0% (premium)", "✅ Yes"],
                          ["PeoplePerHour", "Marketing & writing", "20%", "✅ Yes"],
                          ["LinkedIn", "B2B, high-ticket clients", "Free", "✅ Best for networking"],
                          ["Direct Outreach", "Cold email, maximum rate", "0%", "✅ No limitations"],
                        ].map(([platform, best, fee, pk]) => (
                          <TableRow key={platform}>
                            <TableCell className="font-semibold">{platform}</TableCell>
                            <TableCell>{best}</TableCell>
                            <TableCell>{fee}</TableCell>
                            <TableCell>{pk}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Card className="bg-muted/50 border-border/50">
                    <CardContent className="p-5">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span><strong>Winning Strategy:</strong> Start with <strong>Fiverr</strong> (easier to get first orders) + <strong>Upwork</strong> (better long-term income). Once you have reviews, clients will come to YOU.</span>
                      </p>
                    </CardContent>
                  </Card>
                </section>

                {/* Step 5 */}
                <section id="step-5" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <TrendingUp className="h-7 w-7 text-primary" />
                    Step 5: Win Your First Client (Proven Proposal Template)
                  </h2>

                  <p className="text-foreground leading-relaxed mb-6">
                    Getting your first client is the hardest part. After that, it gets exponentially easier. Here's a <strong>copy-paste proposal template</strong> that actually works:
                  </p>

                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-foreground mb-3">📝 Winning Proposal Template</h4>
                      <div className="bg-background rounded-lg p-4 text-sm text-foreground space-y-3 font-mono">
                        <p>Hi [Client Name],</p>
                        <p>I read your project description carefully, and I noticed you need [specific thing they mentioned]. I've done similar work for [type of client] — here's a relevant example: [link to portfolio piece].</p>
                        <p>Here's how I'd approach your project:</p>
                        <p>1. [Specific step 1]<br/>2. [Specific step 2]<br/>3. [Specific step 3]</p>
                        <p>I can deliver this within [timeline] and I'm available to start immediately.</p>
                        <p>Would you like to discuss the details?</p>
                        <p>Best,<br/>[Your Name]</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-foreground">Key Rules for Proposals:</h4>
                    {[
                      "Never use generic templates — customize every proposal",
                      "Mention something specific from the job post to show you read it",
                      "Keep it under 150 words — clients are busy",
                      "Include ONE relevant portfolio link (not five)",
                      "Apply to 5-10 jobs daily for the first month",
                    ].map((rule, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-foreground text-sm">{rule}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CTA */}
                <div className="my-10 text-center">
                  <Link to="/">
                    <Button size="lg" className="text-lg px-8 py-6 h-auto">
                      Create Your First Professional Invoice
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                {/* Step 6 */}
                <section id="step-6" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <DollarSign className="h-7 w-7 text-primary" />
                    Step 6: How to Get Paid in Pakistan (Complete Payment Guide)
                  </h2>

                  <p className="text-foreground leading-relaxed mb-4">
                    This is where most beginners get confused. Since <strong>PayPal doesn't work in Pakistan</strong>, here are your best options:
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Method</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Speed</TableHead>
                          <TableHead>Best For</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          ["Payoneer", "2% + withdrawal fee", "2-5 days", "Upwork & large payments"],
                          ["Wise (TransferWise)", "0.5-1.5%", "1-2 days", "Best exchange rates"],
                          ["Direct Bank Transfer", "Varies by bank", "3-7 days", "Recurring clients"],
                          ["Sadapay", "Low fees", "Instant (domestic)", "Spending & holding USD"],
                          ["Crypto (USDT)", "~1%", "Minutes", "Tech-savvy clients"],
                        ].map(([method, fee, speed, best]) => (
                          <TableRow key={method}>
                            <TableCell className="font-semibold">{method}</TableCell>
                            <TableCell>{fee}</TableCell>
                            <TableCell>{speed}</TableCell>
                            <TableCell>{best}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Card className="bg-muted/50 border-border/50">
                    <CardContent className="p-5">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <DollarSign className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span><strong>Best Setup for Beginners:</strong> Open a <strong>Payoneer</strong> account (works with Upwork & Fiverr) + a <strong>Sadapay</strong> account for easy spending. Use <strong>Wise</strong> when you start earning $1000+/month for the best exchange rates.</span>
                      </p>
                    </CardContent>
                  </Card>
                </section>

                {/* Step 7 */}
                <section id="step-7" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Briefcase className="h-7 w-7 text-primary" />
                    Step 7: Send Professional Invoices (Get Paid Faster)
                  </h2>

                  <p className="text-foreground leading-relaxed mb-4">
                    Once you land clients — especially off-platform clients — you need to send <strong>professional invoices</strong>. This is crucial because:
                  </p>

                  <div className="space-y-3 mb-6">
                    {[
                      "Professional invoices make clients pay faster (studies show 2x faster payment)",
                      "You need invoice records for FBR tax filing",
                      "It builds trust and makes you look established",
                      "It protects you in case of disputes",
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-foreground text-sm">{point}</p>
                      </div>
                    ))}
                  </div>

                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-foreground mb-2">What Your Invoice Must Include:</h4>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>✅ Your name, email, and contact info</li>
                        <li>✅ Client's name and company</li>
                        <li>✅ Unique invoice number (e.g., INV-2026-001)</li>
                        <li>✅ Itemized list of services with rates</li>
                        <li>✅ Total amount in USD (with PKR reference)</li>
                        <li>✅ Payment method details (Payoneer email, bank IBAN)</li>
                        <li>✅ Due date and payment terms</li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <strong>InvoicePak</strong> generates all of this automatically — with live USD to PKR conversion, PDF export, and professional templates. <Link to="/" className="text-primary hover:underline">Try it free →</Link>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Income Roadmap */}
                <section id="income-roadmap" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <TrendingUp className="h-7 w-7 text-primary" />
                    Realistic Income Roadmap: Month 1 to Month 12
                  </h2>

                  <p className="text-foreground leading-relaxed mb-6">
                    Here's what a realistic freelancing journey looks like for a dedicated Pakistani beginner:
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timeline</TableHead>
                          <TableHead>What You're Doing</TableHead>
                          <TableHead>Expected Earning</TableHead>
                          <TableHead>PKR Equivalent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          ["Month 1-2", "Learning + building portfolio", "$0-100", "Rs 0-28K"],
                          ["Month 3-4", "First clients + reviews", "$200-500", "Rs 56K-140K"],
                          ["Month 5-6", "Building reputation", "$500-1,000", "Rs 140K-280K"],
                          ["Month 7-9", "Repeat clients + referrals", "$1,000-2,000", "Rs 280K-560K"],
                          ["Month 10-12", "Premium pricing + scaling", "$2,000-3,000+", "Rs 560K-840K+"],
                        ].map(([time, doing, earn, pkr]) => (
                          <TableRow key={time}>
                            <TableCell className="font-semibold">{time}</TableCell>
                            <TableCell>{doing}</TableCell>
                            <TableCell>{earn}</TableCell>
                            <TableCell className="text-primary font-semibold">{pkr}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Card className="bg-muted/50 border-border/50">
                    <CardContent className="p-5">
                      <p className="text-sm text-foreground flex items-start gap-2">
                        <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span><strong>Reality Check:</strong> Most successful freelancers didn't earn much in the first 2 months. The key is consistency. Apply every day, improve your skills every week, and don't give up after 10 rejections — it's normal.</span>
                      </p>
                    </CardContent>
                  </Card>
                </section>

                {/* Mistakes */}
                <section id="mistakes" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                    🚫 10 Biggest Mistakes Pakistani Freelancers Make (Avoid These!)
                  </h2>

                  <div className="space-y-4">
                    {[
                      { mistake: "Charging too low to 'compete'", fix: "Low prices attract bad clients. Start at market rate — even for beginners." },
                      { mistake: "Not specializing", fix: "A 'WordPress developer' earns more than a 'I do everything' freelancer." },
                      { mistake: "Ignoring your profile/portfolio", fix: "Your Upwork profile IS your resume. Spend time making it perfect." },
                      { mistake: "Not following up with clients", fix: "A polite follow-up after 3 days can recover 40% of lost deals." },
                      { mistake: "Working without a contract", fix: "Always agree on scope, timeline, and payment terms in writing." },
                      { mistake: "Not saving for taxes", fix: "Set aside 10-15% of earnings for FBR tax filing." },
                      { mistake: "Sending unprofessional invoices", fix: "Use a proper invoicing tool like InvoicePak — it's free to start." },
                      { mistake: "Not asking for reviews", fix: "After every successful project, ask the client for a review. It's your most valuable asset." },
                      { mistake: "Relying on one platform", fix: "Diversify between platforms and direct clients for income stability." },
                      { mistake: "Giving up too early", fix: "The first 90 days are the hardest. Most people who succeed pushed through this phase." },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 border border-border/50 rounded-lg">
                        <span className="flex items-center justify-center h-8 w-8 bg-destructive/10 text-destructive rounded-full text-sm font-bold shrink-0">{i + 1}</span>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.mistake}</h4>
                          <p className="text-sm text-muted-foreground mt-1">✅ <strong>Fix:</strong> {item.fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="mb-12 scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Frequently Asked Questions
                  </h2>

                  <div className="space-y-6">
                    {[
                      { q: "Can I start freelancing without a degree?", a: "Absolutely. Most international clients don't care about degrees — they care about your portfolio and reviews. Some of Pakistan's top freelancers never went to university." },
                      { q: "How much money do I need to start?", a: "Almost nothing. A laptop (even a basic one), internet connection, and free accounts on Upwork/Fiverr. Total cost: Rs 0 if you already have a laptop." },
                      { q: "Is freelancing legal in Pakistan?", a: "100% legal. The government actively encourages it. The Pakistan Software Export Board (PSEB) provides IT export certifications, and freelance income is taxable under FBR rules." },
                      { q: "How long until I earn my first dollar?", a: "With dedicated effort, most people land their first client within 2-6 weeks. Some get lucky in the first week, others take 2 months. Consistency is key." },
                      { q: "Do I need to register as a business?", a: "Not initially. You can start as an individual. Once you're earning consistently, consider registering with PSEB and FBR for tax benefits and credibility." },
                      { q: "Can women freelance from home in Pakistan?", a: "Yes! In fact, freelancing is one of the most empowering opportunities for Pakistani women. Many of Pakistan's top-rated freelancers are women working from home." },
                    ].map((item, i) => (
                      <div key={i} className="border-b border-border/50 pb-4">
                        <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                        <p className="text-sm text-muted-foreground">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Final CTA */}
                <section className="mb-12 text-center">
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-8">
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                        Ready to Start Your Freelancing Journey?
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        When you land your first client, you'll need professional invoices. InvoicePak makes it dead simple — create, send, and track invoices with automatic USD to PKR conversion.
                      </p>
                      <Link to="/signup">
                        <Button size="lg" className="text-lg px-8 py-6 h-auto">
                          Start Creating Free Invoices
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </section>

                {/* Mobile Share */}
                <div className="lg:hidden mb-8">
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm text-foreground mb-3">Share This Guide</h3>
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center text-sm bg-green-600 text-white py-2.5 px-3 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Share on WhatsApp
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center text-sm bg-blue-700 text-white py-2.5 px-3 rounded-md hover:bg-blue-800 transition-colors"
                        >
                          Share on LinkedIn
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </article>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default StartFreelancingPakistan2026;
