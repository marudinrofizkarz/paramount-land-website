"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { MenuTreeItem } from "@/types/website-menu";
import { getPublicWebsiteMenus } from "@/lib/website-menu-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/images/paramount-logo-light.png");
  const [isMounted, setIsMounted] = useState(false);
  const [menus, setMenus] = useState<MenuTreeItem[]>([]);
  const [menusLoading, setMenusLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setLogoSrc(
        resolvedTheme === "dark"
          ? "/images/paramount-logo-light.png"
          : "/images/paramount-logo-dark.png"
      );
    }
  }, [resolvedTheme, isMounted]);

  // Fetch website menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const { data = [], success } = await getPublicWebsiteMenus();
        if (success) {
          setMenus(data);
        }
      } catch (error) {
        console.error("Error fetching footer menus:", error);
      } finally {
        setMenusLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send this to your API
      console.log("Subscribing email:", email);
      setSubscribeStatus("success");
      setTimeout(() => {
        setSubscribeStatus("idle");
        setEmail("");
      }, 3000);
    }
  };

  if (!isMounted) {
    return (
      <footer className="bg-card text-card-foreground" aria-label="Footer">
        <div className="container mx-auto py-8">
          <div className="h-20"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="bg-card text-card-foreground relative"
      aria-label="Footer"
    >
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Paramount Land",
            url: "https://www.rizalparamountland.com",
            logo: "https://www.rizalparamountland.com/images/paramount-logo-dark.png",
            sameAs: [
              "https://www.facebook.com/rizalparamountland",
              "https://www.instagram.com/rizalparamountland",
              "https://www.youtube.com/rizalparamountland",
              "https://www.linkedin.com/company/rizal-paramount-land",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+6281387118533",
              email: "rijal.sutanto@paramount-land.com",
              contactType: "customer service",
            },
          }),
        }}
      />

      {/* Main Footer Content */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info Section */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="inline-block"
              aria-label="Paramount Land Home"
            >
              <Image
                src={logoSrc}
                alt="Paramount Land logo"
                width={180}
                height={50}
                className="transition-all duration-200 hover:opacity-90"
                priority
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Building Homes and People with Heart Across the Nation.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Jl. Boulevard Gading Serpong, Tangerang, Indonesia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href="tel:+6281387118533"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  081387118533
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:rijal.sutanto@paramount-land.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  rijal.sutanto@paramount-land.com
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h2 className="text-lg font-semibold mb-5 text-foreground">
              Quick Links
            </h2>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {!menusLoading &&
                  menus.slice(0, 6).map((menu) => (
                    <li key={menu.id}>
                      <Link
                        href={menu.url || "#"}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group"
                      >
                        <ArrowRight className="h-3 w-0 mr-0 opacity-0 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                        {menu.title}
                      </Link>
                    </li>
                  ))}
                {menusLoading && (
                  <>
                    <li>
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </li>
                    <li>
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                    </li>
                    <li>
                      <div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>

          {/* Projects Section */}
          <div>
            <h2 className="text-lg font-semibold mb-5 text-foreground">
              Our Projects
            </h2>
            <nav aria-label="Projects navigation">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#projects"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ArrowRight className="h-3 w-0 mr-0 opacity-0 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                    All Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects/residential"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ArrowRight className="h-3 w-0 mr-0 opacity-0 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                    Residential
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects/commercial"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ArrowRight className="h-3 w-0 mr-0 opacity-0 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                    Commercial
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Newsletter Subscription */}
            {/* <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                Newsletter
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                Stay updated with our latest projects and news
              </p>
              <form onSubmit={handleSubscribe} className="mt-2 space-y-2">
                <div className="flex">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    aria-label="Email for newsletter"
                    className="rounded-r-none focus-visible:ring-primary"
                    required
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {subscribeStatus === "success" && (
                  <p className="text-xs text-green-500">
                    Thank you for subscribing!
                  </p>
                )}
                {subscribeStatus === "error" && (
                  <p className="text-xs text-red-500">
                    An error occurred. Please try again.
                  </p>
                )}
              </form>
            </div> */}
          </div>

          {/* Social & About Section */}
          <div>
            <h2 className="text-lg font-semibold mb-5 text-foreground">
              Connect With Us
            </h2>

            {/* Social Media Links */}
            <div className="flex space-x-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            {/* About Links */}
            {/* <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4 text-foreground">
                About Us
              </h2>
              <nav aria-label="About navigation">
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/about"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-0 mr-0 opacity-0 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-0 mr-0 opacity-0 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact-us"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-0 mr-0 opacity-0 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </nav>
            </div> */}
          </div>
        </div>

        {/* Bottom Section with Copyright and Legal Links */}
        <div className="mt-12 pt-8 border-t border-muted flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Paramount Land. All rights
            reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/sitemap.xml"
              className="hover:text-primary transition-colors"
            >
              Sitemap
            </Link>
            {/* <a
              href="https://www.paramount-land.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              Official Website <ExternalLink className="h-3 w-3" />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
