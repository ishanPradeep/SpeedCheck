import type { Metadata } from 'next';
import { Cookie, Settings, Shield, Eye, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy - GlobalSpeedTrack',
  description: 'Cookie policy and information about how we use cookies on GlobalSpeedTrack.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Cookie className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Cookie className="h-6 w-6" />
                <span>1. What Are Cookies?</span>
              </h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are deleted as soon as you close your web browser.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Eye className="h-6 w-6" />
                <span>2. How We Use Cookies</span>
              </h2>
              <p>GlobalSpeedTrack uses cookies for several purposes:</p>
              
              <h3 className="text-xl font-semibold">2.1 Essential Cookies</h3>
              <p>These cookies are necessary for the website to function properly:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining your session during speed tests</li>
                <li>Storing your preferences and settings</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Remembering your test history locally</li>
              </ul>

              <h3 className="text-xl font-semibold">2.2 Analytics Cookies</h3>
              <p>These cookies help us understand how visitors interact with our website:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics cookies to track usage patterns</li>
                <li>Performance monitoring and optimization</li>
                <li>Understanding user behavior and preferences</li>
                <li>Improving website functionality and user experience</li>
              </ul>

              <h3 className="text-xl font-semibold">2.3 Advertising Cookies</h3>
              <p>These cookies are used to deliver relevant advertisements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Ads cookies for targeted advertising</li>
                <li>Displaying relevant ads based on your interests</li>
                <li>Measuring the effectiveness of advertising campaigns</li>
                <li>Preventing the same ad from appearing repeatedly</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Database className="h-6 w-6" />
                <span>3. Types of Cookies We Use</span>
              </h2>
              
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold text-lg">First-Party Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    These are cookies that we set directly on our website. They are used to:
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                    <li>Remember your speed test preferences</li>
                    <li>Store your test history locally</li>
                    <li>Maintain your session during testing</li>
                    <li>Remember your language and region settings</li>
                  </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold text-lg">Third-Party Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    These are cookies set by third-party services we use:
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                    <li><strong>Google Analytics:</strong> _ga, _gid, _gat for website analytics</li>
                    <li><strong>Google Ads:</strong> _gcl_au, _gcl_dc for advertising</li>
                    <li><strong>Google Tag Manager:</strong> _dc_gtm for tag management</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Settings className="h-6 w-6" />
                <span>4. Managing Your Cookie Preferences</span>
              </h2>
              <p>You have several options for managing cookies:</p>
              
              <h3 className="text-xl font-semibold">4.1 Browser Settings</h3>
              <p>You can control cookies through your browser settings:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>

              <h3 className="text-xl font-semibold">4.2 Cookie Consent</h3>
              <p>
                When you first visit our website, you'll see a cookie consent banner. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your cookie preferences</li>
                <li>Change your preferences at any time</li>
              </ul>

              <h3 className="text-xl font-semibold">4.3 Third-Party Opt-Outs</h3>
              <p>You can opt out of third-party cookies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                <li><strong>Google Ads:</strong> <a href="https://adssettings.google.com/" className="text-primary hover:underline">Google Ads Settings</a></li>
                <li><strong>Network Advertising Initiative:</strong> <a href="http://optout.networkadvertising.org/" className="text-primary hover:underline">NAI Opt-out</a></li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span>5. Impact of Disabling Cookies</span>
              </h2>
              <p>If you choose to disable cookies, please be aware that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Some features of our website may not function properly</li>
                <li>Your speed test preferences may not be saved</li>
                <li>You may need to re-enter information repeatedly</li>
                <li>Some content may not be personalized for you</li>
                <li>Analytics and performance monitoring may be limited</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Cookie Retention Periods</h2>
              <p>Different types of cookies are stored for different periods:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for up to 2 years</li>
                <li><strong>Analytics Cookies:</strong> Typically stored for 1-2 years</li>
                <li><strong>Advertising Cookies:</strong> Usually stored for 1-3 months</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Updates to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">Email: contact@globalspeedtrack.com</p>
                <p className="font-medium">Website: globalspeedtrack.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
