import { Flame, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  company: [
    { label: 'Blog', href: '/blog', isRoute: true },
    { label: 'My Story', href: '/my-story', isRoute: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy', isRoute: true },
    { label: 'Terms of Service', href: '/terms', isRoute: true },
    { label: 'Cookie Settings', href: '/cookies', isRoute: true },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@invoicepk.com', label: 'Email' },
];

export const Footer = React.forwardRef<HTMLElement>((_, ref) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer ref={ref} className="py-16 px-4 border-t border-border/30 bg-card/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">InvoicePK</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-5 max-w-xs leading-relaxed">
              The simplest way for Pakistani freelancers to create professional invoices with automatic USD to PKR conversion.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-accent border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {'isRoute' in link && link.isRoute ? (
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground/60 text-sm">
            © {new Date().getFullYear()} InvoicePK. All rights reserved.
          </p>
          <p className="text-muted-foreground/60 text-sm">
            Made with ❤️ for Pakistani Freelancers
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
