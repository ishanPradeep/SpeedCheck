import type { Metadata } from 'next';
import { FileText, AlertTriangle, Shield, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions - GlobalSpeedTrack',
  description: 'Terms and conditions for using GlobalSpeedTrack speed test service.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Terms & Conditions</h1>
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
                <Globe className="h-6 w-6" />
                <span>1. Acceptance of Terms</span>
              </h2>
              <p>
                By accessing and using GlobalSpeedTrack ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>2. Use License</span>
              </h2>
              <p>
                Permission is granted to temporarily use GlobalSpeedTrack for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on GlobalSpeedTrack</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span>3. Disclaimer</span>
              </h2>
              <p>
                The materials on GlobalSpeedTrack are provided on an 'as is' basis. GlobalSpeedTrack makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>4. Limitations</span>
              </h2>
              <p>
                In no event shall GlobalSpeedTrack or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GlobalSpeedTrack, even if GlobalSpeedTrack or a GlobalSpeedTrack authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on GlobalSpeedTrack could include technical, typographical, or photographic errors. GlobalSpeedTrack does not warrant that any of the materials on its website are accurate, complete, or current. GlobalSpeedTrack may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Links</h2>
              <p>
                GlobalSpeedTrack has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by GlobalSpeedTrack of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Modifications</h2>
              <p>
                GlobalSpeedTrack may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Speed Test Results</h2>
              <p>
                Speed test results provided by GlobalSpeedTrack are estimates and may vary based on various factors including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Network conditions and congestion</li>
                <li>Device performance and capabilities</li>
                <li>Server location and load</li>
                <li>Time of day and network usage</li>
                <li>ISP throttling or network management</li>
              </ul>
              <p>
                GlobalSpeedTrack does not guarantee the accuracy of speed test results and users should not rely solely on these results for critical decisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Contact Information</h2>
              <p>
                If you have any questions about these Terms & Conditions, please contact us at:
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
