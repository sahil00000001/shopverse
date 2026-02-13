import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CreditCard,
  Shield,
  Banknote,
  Smartphone,
} from "lucide-react";

const footerLinks = {
  about: {
    title: "About ShopVerse",
    links: [
      { name: "Our Story", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press & Media", href: "/press" },
      { name: "Affiliate Program", href: "/affiliates" },
      { name: "Sustainability", href: "/sustainability" },
    ],
  },
  quickLinks: {
    title: "Quick Links",
    links: [
      { name: "New Arrivals", href: "/new-arrivals" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Flash Deals", href: "/deals" },
      { name: "Gift Cards", href: "/gift-cards" },
      { name: "All Categories", href: "/products" },
    ],
  },
  customerService: {
    title: "Customer Service",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Track Your Order", href: "/track-order" },
      { name: "Returns & Refunds", href: "/returns" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div className="space-y-4">
            <Link href="/">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold text-transparent">
                ShopVerse
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your premium destination for curated products across electronics,
              fashion, home & garden, and more. Quality meets affordability at
              ShopVerse.
            </p>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span>support@shopverse.com</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.name}
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{footerLinks.quickLinks.title}</h3>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">
              {footerLinks.customerService.title}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.customerService.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for exclusive deals and new arrivals.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-9"
              />
              <Button size="sm" className="shrink-0 px-3">
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates.
            </p>
            {/* About Links */}
            <div className="pt-2">
              <h4 className="mb-2.5 text-sm font-semibold">
                {footerLinks.about.title}
              </h4>
              <ul className="space-y-2">
                {footerLinks.about.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          {/* Payment Methods */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              We Accept:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: "Visa", icon: CreditCard },
                { name: "Mastercard", icon: CreditCard },
                { name: "PayPal", icon: Banknote },
                { name: "Apple Pay", icon: Smartphone },
                { name: "Google Pay", icon: Shield },
              ].map((method) => (
                <div
                  key={method.name}
                  className="flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1"
                >
                  <method.icon className="size-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {method.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Separator className="mb-4" />
          {/* Copyright */}
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ShopVerse. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="transition-colors hover:text-foreground"
              >
                Cookie Policy
              </Link>
              <Link
                href="/accessibility"
                className="transition-colors hover:text-foreground"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
