import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
const TermsAndConditions = () => {
  const sections = [{
    id: "acceptance",
    title: "1. Acceptance of Terms"
  }, {
    id: "eligibility",
    title: "2. User Eligibility"
  }, {
    id: "registration",
    title: "3. Account Registration & Security"
  }, {
    id: "content",
    title: "4. User Content"
  }, {
    id: "conduct",
    title: "5. Conduct Rules"
  }, {
    id: "collaboration",
    title: "6. Collaboration & Project Management"
  }, {
    id: "jobs",
    title: "7. Job Postings & Applications"
  }, {
    id: "intellectual",
    title: "8. Intellectual Property Rights"
  }, {
    id: "privacy",
    title: "9. Privacy"
  }, {
    id: "termination",
    title: "10. Termination"
  }, {
    id: "disclaimers",
    title: "11. Disclaimers & Limitation of Liability"
  }, {
    id: "governing",
    title: "12. Governing Law"
  }, {
    id: "changes",
    title: "13. Changes to Terms"
  }, {
    id: "contact",
    title: "14. Contact Information"
  }];
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 gold-gradient-text">Terms and Conditions</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Welcome to FilmCollab. Please read these Terms and Conditions carefully before using our platform.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {sections.map(section => <button key={section.id} onClick={() => scrollToSection(section.id)} className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded hover:bg-muted">
                      {section.title}
                    </button>)}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <ScrollArea className="h-full">
                  <div className="space-y-8">
                    {/* Section 1: Acceptance of Terms */}
                    <section id="acceptance">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">1. Acceptance of Terms</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                          By accessing and using FilmCollab ("Platform", "Service", "we", "us", or "our"), 
                          you accept and agree to be bound by the terms and provision of this agreement. 
                          If you do not agree to abide by the above, please do not use this service.
                        </p>
                        <p>
                          These Terms and Conditions constitute a legally binding agreement between you 
                          and FilmCollab regarding your use of the Platform and all its features and services.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 2: User Eligibility */}
                    <section id="eligibility">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">2. User Eligibility</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>To use FilmCollab, you must:</p>
                        <ul>
                          <li>Be at least 18 years of age or have parental/guardian consent if between 13-17 years old</li>
                          <li>Have the legal capacity to enter into this agreement</li>
                          <li>Not be prohibited from using the service under applicable laws</li>
                          <li>Provide accurate and truthful information during registration</li>
                        </ul>
                        <p>
                          Users under 18 must have their parent or legal guardian's permission to use FilmCollab 
                          and agree to these terms on their behalf.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 3: Account Registration & Security */}
                    <section id="registration">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">3. Account Registration & Security</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">Registration Requirements</h3>
                        <p>When creating an account, you agree to:</p>
                        <ul>
                          <li>Provide accurate, current, and complete information</li>
                          <li>Maintain and promptly update your account information</li>
                          <li>Use your real name and professional credentials</li>
                          <li>Create only one account per person</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Account Security</h3>
                        <p>You are responsible for:</p>
                        <ul>
                          <li>Maintaining the confidentiality of your login credentials</li>
                          <li>All activities that occur under your account</li>
                          <li>Immediately notifying us of unauthorized use of your account</li>
                          <li>Logging out of your account at the end of each session</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 4: User Content */}
                    <section id="content">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">4. User Content</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">Content Ownership</h3>
                        <p>
                          You retain ownership of all content you upload, post, or share on FilmCollab, 
                          including but not limited to videos, scripts, images, audio files, and written posts.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Content License</h3>
                        <p>
                          By posting content on FilmCollab, you grant us a non-exclusive, worldwide, 
                          royalty-free license to use, display, reproduce, and distribute your content 
                          solely for the purpose of operating and improving the Platform.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Content Responsibility</h3>
                        <p>You are solely responsible for:</p>
                        <ul>
                          <li>The accuracy and legality of your content</li>
                          <li>Ensuring you have rights to all uploaded material</li>
                          <li>Compliance with copyright and intellectual property laws</li>
                          <li>Any consequences arising from your content</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 5: Conduct Rules */}
                    <section id="conduct">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">5. Conduct Rules</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>Users must not engage in any of the following prohibited activities:</p>
                        
                        <h3 className="text-lg font-medium">Prohibited Content</h3>
                        <ul>
                          <li>Harassment, bullying, or threatening behavior</li>
                          <li>Hate speech or discriminatory content</li>
                          <li>Sexually explicit or inappropriate material</li>
                          <li>Spam, promotional content, or unauthorized advertising</li>
                          <li>False, misleading, or defamatory information</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Illegal Activities</h3>
                        <ul>
                          <li>Copyright or trademark infringement</li>
                          <li>Sharing pirated or unauthorized content</li>
                          <li>Any illegal or criminal activities</li>
                          <li>Violation of privacy rights</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Platform Integrity</h3>
                        <ul>
                          <li>Attempting to hack or compromise platform security</li>
                          <li>Creating fake accounts or impersonating others</li>
                          <li>Manipulating platform features or algorithms</li>
                          <li>Interfering with other users' experience</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 6: Collaboration & Project Management */}
                    <section id="collaboration">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">6. Collaboration & Project Management</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">Project Collaboration</h3>
                        <p>
                          FilmCollab facilitates connections between creative professionals but is not 
                          responsible for the outcome of collaborations or projects initiated through our platform.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Project Ownership</h3>
                        <ul>
                          <li>Project ownership and intellectual property rights are determined by collaborators</li>
                          <li>We recommend written agreements between collaborating parties</li>
                          <li>FilmCollab does not claim ownership of collaborative projects</li>
                          <li>Credit and compensation agreements are between collaborating users</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Dispute Resolution</h3>
                        <p>
                          FilmCollab is not responsible for disputes between collaborators. Users are 
                          encouraged to resolve conflicts independently or seek appropriate legal counsel.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 7: Job Postings & Applications */}
                    <section id="jobs">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">7. Job Postings & Applications</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">Platform Role</h3>
                        <p>
                          FilmCollab serves as a platform for connecting job seekers with potential employers 
                          in the film industry. We are not an employer, employment agency, or recruiter.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Job Posting Requirements</h3>
                        <ul>
                          <li>Job posts must be legitimate and film industry-related</li>
                          <li>Accurate job descriptions and requirements must be provided</li>
                          <li>Compensation details should be clearly stated when applicable</li>
                          <li>Contact information must be current and valid</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Application Process</h3>
                        <ul>
                          <li>Applications are submitted directly to job posters</li>
                          <li>FilmCollab does not guarantee responses or interview opportunities</li>
                          <li>Users are responsible for verifying job legitimacy</li>
                          <li>Employment terms are between the employer and candidate</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Disclaimer</h3>
                        <p>
                          FilmCollab is not responsible for employment decisions, workplace conditions, 
                          compensation disputes, or any employment-related issues arising from connections 
                          made through our platform.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 8: Intellectual Property Rights */}
                    <section id="intellectual">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">8. Intellectual Property Rights</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">FilmCollab Platform Rights</h3>
                        <p>
                          FilmCollab owns all rights to the platform design, functionality, features, 
                          trademarks, logos, and proprietary technology. Users may not copy, modify, 
                          or distribute any part of our platform without explicit permission.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">User Content Rights</h3>
                        <p>
                          Users retain full ownership of their original content uploaded to FilmCollab. 
                          However, users grant FilmCollab a license to display and distribute this 
                          content for platform operation purposes.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Copyright Protection</h3>
                        <ul>
                          <li>Users must respect intellectual property rights of others</li>
                          <li>Unauthorized use of copyrighted material is prohibited</li>
                          <li>DMCA takedown procedures are in place for copyright violations</li>
                          <li>Repeat offenders may face account termination</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Trademark Usage</h3>
                        <p>
                          The FilmCollab name, logo, and branding elements are protected trademarks. 
                          Unauthorized use is strictly prohibited without written consent.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 9: Privacy */}
                    <section id="privacy">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">9. Privacy</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                          Your privacy is important to us. Our collection, use, and protection of your 
                          personal information is governed by our Privacy Policy, which is incorporated 
                          into these Terms and Conditions by reference.
                        </p>
                        
                        <p>
                          By using FilmCollab, you consent to the collection and use of your information 
                          as outlined in our Privacy Policy. Please review our Privacy Policy to understand 
                          how we handle your data.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Data Security</h3>
                        <p>
                          We implement industry-standard security measures to protect your personal 
                          information. However, no method of transmission over the internet is 100% secure, 
                          and we cannot guarantee absolute security.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 10: Termination */}
                    <section id="termination">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">10. Termination</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">User-Initiated Termination</h3>
                        <p>
                          You may terminate your account at any time by contacting our support team 
                          or using the account deletion feature in your settings. Upon termination, 
                          your access to the platform will be immediately revoked.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Platform-Initiated Termination</h3>
                        <p>FilmCollab reserves the right to suspend or terminate accounts for:</p>
                        <ul>
                          <li>Violation of these Terms and Conditions</li>
                          <li>Suspected fraudulent or illegal activity</li>
                          <li>Harassment or abuse of other users</li>
                          <li>Multiple copyright violations</li>
                          <li>Prolonged inactivity (over 2 years)</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Effect of Termination</h3>
                        <p>
                          Upon account termination, your access to the platform ceases immediately. 
                          We may retain certain information as required by law or for legitimate business purposes.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 11: Disclaimers & Limitation of Liability */}
                    <section id="disclaimers">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">11. Disclaimers & Limitation of Liability</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">Service Disclaimer</h3>
                        <p>
                          FilmCollab is provided "as is" without warranties of any kind. We do not guarantee 
                          that the service will be uninterrupted, error-free, or meet your specific requirements.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">User Interaction Disclaimer</h3>
                        <p>
                          We are not responsible for interactions between users, including but not limited to:
                        </p>
                        <ul>
                          <li>Quality of collaborations or work produced</li>
                          <li>Payment disputes between users</li>
                          <li>Breach of agreements between collaborators</li>
                          <li>Personal or professional conflicts</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6">Limitation of Liability</h3>
                        <p>
                          FilmCollab's total liability for any claims arising from your use of the platform 
                          shall not exceed the amount you paid for premium services in the 12 months 
                          preceding the claim, or $100, whichever is greater.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Indemnification</h3>
                        <p>
                          You agree to indemnify and hold FilmCollab harmless from any claims, damages, 
                          or expenses arising from your use of the platform or violation of these terms.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 12: Governing Law */}
                    <section id="governing">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">12. Governing Law</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                          These Terms and Conditions are governed by and construed in accordance with 
                          the laws of [Jurisdiction], without regard to its conflict of law provisions.
                        </p>
                        
                        <p>
                          Any disputes arising from these terms or your use of FilmCollab shall be 
                          resolved in the courts of [Jurisdiction]. You consent to the personal 
                          jurisdiction of such courts.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">International Users</h3>
                        <p>
                          If you access FilmCollab from outside [Jurisdiction], you are responsible 
                          for compliance with local laws and regulations in your jurisdiction.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 13: Changes to Terms */}
                    <section id="changes">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">13. Changes to Terms</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                          FilmCollab reserves the right to modify these Terms and Conditions at any time. 
                          We will notify users of significant changes through:
                        </p>
                        <ul>
                          <li>Email notification to registered users</li>
                          <li>Platform announcements</li>
                          <li>Updated "Last Modified" date on this page</li>
                        </ul>
                        
                        <p>
                          Continued use of the platform after changes constitutes acceptance of the 
                          modified terms. If you disagree with changes, you should discontinue use 
                          of FilmCollab.
                        </p>
                        
                        <h3 className="text-lg font-medium mt-6">Notification Period</h3>
                        <p>
                          Material changes to these terms will be communicated at least 30 days 
                          before they take effect, giving users time to review and decide whether 
                          to continue using the platform.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 14: Contact Information */}
                    <section id="contact">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">14. Contact Information</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                          If you have questions about these Terms and Conditions or need to report 
                          violations, please contact us:
                        </p>
                        
                        <div className="bg-muted p-4 rounded-lg mt-4">
                          <p><strong>FilmCollab Support Team</strong></p>
                          <p>Email: support@filmcollab.com</p>
                          <p>Phone: +1 (555) 123-4567</p>
                          <p>Address: [Company Address]</p>
                          <p>Business Hours: Monday-Friday, 9:00 AM - 6:00 PM EST</p>
                        </div>
                        
                        <p className="mt-4">
                          For urgent matters involving harassment, copyright violations, or security 
                          concerns, please mark your communication as "URGENT" in the subject line.
                        </p>
                      </div>
                    </section>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground pt-8 border-t">
                      <p>
                        These Terms and Conditions were last updated on {new Date().toLocaleDateString()}
                      </p>
                      <p className="mt-2">
                        © {new Date().getFullYear()} FilmCollab. All rights reserved.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default TermsAndConditions;