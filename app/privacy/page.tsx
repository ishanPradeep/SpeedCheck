import type { Metadata } from 'next';
import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - GlobalSpeedTrack',
  description: 'Privacy policy and data protection information for GlobalSpeedTrack speed test service.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
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
                <Eye className="h-6 w-6" />
                <span>1. Information We Collect</span>
              </h2>
              <p>
                GlobalSpeedTrack ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our speed test service.
              </p>
              
              <h3 className="text-xl font-semibold">1.1 Information You Provide</h3>
              <p>We may collect information you provide directly to us, such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information (email address) if you choose to contact us</li>
                <li>Feedback and comments you submit</li>
                <li>Information you provide when reporting issues</li>
              </ul>

              <h3 className="text-xl font-semibold">1.2 Automatically Collected Information</h3>
              <p>When you use our service, we automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and general location information</li>
                <li>Browser type and version</li>
                <li>Device information (operating system, screen resolution)</li>
                <li>Speed test results and performance data</li>
                <li>Usage patterns and interaction with our service</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Database className="h-6 w-6" />
                <span>2. How We Use Your Information</span>
              </h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our speed test service</li>
                <li>To improve and optimize our service performance</li>
                <li>To analyze usage patterns and trends</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To detect and prevent fraud or abuse</li>
                <li>To comply with legal obligations</li>
                <li>To send you updates and notifications (with your consent)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>3. Information Sharing</span>
              </h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our service</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                <li><strong>Analytics:</strong> We use Google Analytics and other analytics services to understand usage patterns</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Lock className="h-6 w-6" />
                <span>4. Data Security</span>
              </h2>
              <p>
                We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve our service functionality</li>
              </ul>
              <p>You can control cookie settings through your browser preferences.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Third-Party Services</h2>
              <p>Our service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and comply with legal obligations. Speed test results may be stored locally on your device for your convenience.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Mail className="h-6 w-6" />
                <span>12. Contact Us</span>
              </h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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
