'use client';

import Link from 'next/link';
import { Mail, Globe, Shield, FileText, Cookie } from 'lucide-react';
import CookiePreferences from './CookiePreferences';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">GlobalSpeedTrack</h3>
            <p className="text-muted-foreground text-sm">
              Professional internet speed testing tool. Get accurate download, upload speeds, 
              ping, and network quality analysis.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a 
                href="mailto:contact@globalspeedtrack.com"
                className="hover:text-primary transition-colors"
              >
                contact@globalspeedtrack.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Speed Test
                </Link>
              </li>
              <li>
                <Link href="/test-real" className="text-muted-foreground hover:text-primary transition-colors">
                  Real Speed Test
                </Link>
              </li>
              <li>
                <Link href="/test-real-speed" className="text-muted-foreground hover:text-primary transition-colors">
                  Advanced Test
                </Link>
              </li>
              <li>
                <Link href="/api-test" className="text-muted-foreground hover:text-primary transition-colors">
                  API Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2">
                  <Cookie className="h-4 w-4" />
                  <span>Cookie Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a 
                  href="mailto:contact@globalspeedtrack.com"
                  className="hover:text-primary transition-colors"
                >
                  Email Us
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>globalspeedtrack.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} GlobalSpeedTrack. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
            <CookiePreferences />
          </div>
        </div>
      </div>
    </footer>
  );
}
