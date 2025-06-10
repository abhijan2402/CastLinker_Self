import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Clock, CheckCircle, XCircle } from "lucide-react";
const CancellationRefundPolicy = () => {
  const sections = [{
    id: "scope",
    title: "1. Scope of Policy"
  }, {
    id: "cancellation",
    title: "2. Cancellation Terms"
  }, {
    id: "eligibility",
    title: "3. Refund Eligibility"
  }, {
    id: "process",
    title: "4. Refund Process"
  }, {
    id: "non-refundable",
    title: "5. Non-Refundable Items"
  }, {
    id: "partial",
    title: "6. Partial Refunds"
  }, {
    id: "disputes",
    title: "7. Disputes and Resolution"
  }, {
    id: "modifications",
    title: "8. Policy Modifications"
  }, {
    id: "contact",
    title: "9. Contact Information"
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
          <h1 className="text-4xl font-bold mb-4 gold-gradient-text">Cancellation and Refund Policy</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our commitment to fair and transparent cancellation and refund procedures for all FilmCollab services.
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
                <CardTitle className="text-lg">Quick Navigation</CardTitle>
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
                    {/* Section 1: Scope of Policy */}
                    <section id="scope">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">1. Scope of Policy</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                          This Cancellation and Refund Policy applies to all paid services and transactions 
                          conducted through FilmCollab, including but not limited to:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="font-semibold text-gold mb-2">Covered Services</h3>
                            <ul className="space-y-1 text-sm">
                              <li>• Premium subscription plans</li>
                              <li>• Featured job posting fees</li>
                              <li>• Project collaboration tools</li>
                              <li>• Enhanced profile features</li>
                              <li>• Industry course access</li>
                              <li>• Event registration fees</li>
                            </ul>
                          </div>
                          
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="font-semibold text-gold mb-2">Transaction Types</h3>
                            <ul className="space-y-1 text-sm">
                              <li>• One-time payments</li>
                              <li>• Recurring subscriptions</li>
                              <li>• Project milestone payments</li>
                              <li>• Service upgrades</li>
                              <li>• Additional feature purchases</li>
                              <li>• Workshop and training fees</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 2: Cancellation Terms */}
                    <section id="cancellation">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">2. Cancellation Terms</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">User-Initiated Cancellations</h3>
                        <p>Users may cancel services under the following conditions:</p>
                        
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 my-4">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800 dark:text-green-200">Subscription Cancellations</h4>
                              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                Cancel anytime before your next billing cycle. Access continues until the end of the current period.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                          <div className="flex items-start space-x-3">
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-800 dark:text-blue-200">Project Cancellations</h4>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Cancel ongoing projects with 48-hour notice. Partial work completed may be subject to pro-rated charges.
                              </p>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium mt-6">FilmCollab-Initiated Cancellations</h3>
                        <p>We may cancel services in cases of:</p>
                        <ul>
                          <li>Violation of Terms and Conditions</li>
                          <li>Fraudulent payment activities</li>
                          <li>Misuse of platform features</li>
                          <li>Breach of community guidelines</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 3: Refund Eligibility */}
                    <section id="eligibility">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">3. Refund Eligibility</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>Refunds may be granted under the following circumstances:</p>
                        
                        <div className="space-y-4 my-6">
                          <div className="border border-muted rounded-lg p-4">
                            <h3 className="font-semibold text-gold mb-2">Service Not Delivered</h3>
                            <p className="text-sm">
                              If FilmCollab fails to provide the service or feature you paid for within the agreed timeframe.
                            </p>
                          </div>
                          
                          <div className="border border-muted rounded-lg p-4">
                            <h3 className="font-semibold text-gold mb-2">Payment Processing Errors</h3>
                            <p className="text-sm">
                              Duplicate charges, incorrect amounts, or unauthorized transactions due to technical errors.
                            </p>
                          </div>
                          
                          <div className="border border-muted rounded-lg p-4">
                            <h3 className="font-semibold text-gold mb-2">Service Dissatisfaction</h3>
                            <p className="text-sm">
                              Refund requests within 14 days of purchase if the service significantly differs from description.
                            </p>
                          </div>
                          
                          <div className="border border-muted rounded-lg p-4">
                            <h3 className="font-semibold text-gold mb-2">Platform Downtime</h3>
                            <p className="text-sm">
                              Extended service interruptions exceeding 72 hours may qualify for pro-rated refunds.
                            </p>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium">Refund Timeframes</h3>
                        <ul>
                          <li><strong>Subscription Services:</strong> 14-day satisfaction guarantee</li>
                          <li><strong>One-time Purchases:</strong> 7-day return window</li>
                          <li><strong>Event Registrations:</strong> Up to 48 hours before event start</li>
                          <li><strong>Course Purchases:</strong> Before accessing 25% of content</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 4: Refund Process */}
                    <section id="process">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">4. Refund Process</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">Step-by-Step Refund Request</h3>
                        
                        <div className="bg-muted p-6 rounded-lg my-6">
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                              <div>
                                <h4 className="font-medium">Submit Request</h4>
                                <p className="text-sm text-muted-foreground">Contact our support team via email at support@filmcollab.com</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                              <div>
                                <h4 className="font-medium">Provide Information</h4>
                                <p className="text-sm text-muted-foreground">Include your account email, transaction ID, and reason for refund</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                              <div>
                                <h4 className="font-medium">Review Process</h4>
                                <p className="text-sm text-muted-foreground">Our team reviews your request within 3-5 business days</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                              <div>
                                <h4 className="font-medium">Refund Processing</h4>
                                <p className="text-sm text-muted-foreground">Approved refunds processed within 7-10 business days</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium">Required Information for Refund Requests</h3>
                        <ul>
                          <li>Account email address</li>
                          <li>Transaction or payment ID</li>
                          <li>Date of purchase</li>
                          <li>Detailed reason for refund request</li>
                          <li>Supporting documentation (if applicable)</li>
                        </ul>

                        <h3 className="text-lg font-medium mt-6">Processing Times</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200">Credit Card Refunds</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">3-5 business days</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <h4 className="font-medium text-green-800 dark:text-green-200">PayPal Refunds</h4>
                            <p className="text-sm text-green-700 dark:text-green-300">1-3 business days</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 5: Non-Refundable Items */}
                    <section id="non-refundable">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">5. Non-Refundable Items</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>The following fees and services are non-refundable:</p>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-6">
                          <div className="flex items-start space-x-3">
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Non-Refundable Services</h3>
                              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                <li>• Payment processing fees</li>
                                <li>• Administrative and service charges</li>
                                <li>• Completed services or delivered content</li>
                                <li>• Custom development work already performed</li>
                                <li>• Third-party integration costs</li>
                                <li>• Account setup and onboarding fees</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium">Time-Sensitive Exclusions</h3>
                        <ul>
                          <li>Services used beyond the refund eligibility period</li>
                          <li>Courses with more than 25% content accessed</li>
                          <li>Event registrations within 48 hours of event start</li>
                          <li>Subscription renewals after 14 days</li>
                        </ul>

                        <h3 className="text-lg font-medium mt-6">Special Circumstances</h3>
                        <p>
                          In exceptional cases involving platform errors or service failures, 
                          we may consider refunding typically non-refundable items on a case-by-case basis.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 6: Partial Refunds */}
                    <section id="partial">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">6. Partial Refunds</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>Partial refunds may be applicable in the following situations:</p>
                        
                        <div className="space-y-4 my-6">
                          <div className="border-l-4 border-gold pl-4">
                            <h3 className="font-semibold">Project Milestone Completion</h3>
                            <p className="text-sm text-muted-foreground">
                              If a project is cancelled after certain milestones are completed, 
                              refunds will be calculated based on remaining work.
                            </p>
                          </div>
                          
                          <div className="border-l-4 border-gold pl-4">
                            <h3 className="font-semibold">Subscription Mid-Cycle Cancellation</h3>
                            <p className="text-sm text-muted-foreground">
                              Annual subscriptions cancelled within the first 30 days may receive 
                              pro-rated refunds for unused months.
                            </p>
                          </div>
                          
                          <div className="border-l-4 border-gold pl-4">
                            <h3 className="font-semibold">Service Downgrade</h3>
                            <p className="text-sm text-muted-foreground">
                              When downgrading from premium to basic plans, the price difference 
                              may be refunded for the remaining billing period.
                            </p>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium">Calculation Method</h3>
                        <p>
                          Partial refunds are calculated based on:
                        </p>
                        <ul>
                          <li>Unused portion of the service period</li>
                          <li>Percentage of project completion</li>
                          <li>Value of delivered vs. remaining services</li>
                          <li>Applicable processing fees and administrative costs</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 7: Disputes and Resolution */}
                    <section id="disputes">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">7. Disputes and Resolution</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">Dispute Resolution Process</h3>
                        <p>
                          If you disagree with a refund decision, we offer a structured resolution process:
                        </p>
                        
                        <div className="bg-muted p-6 rounded-lg my-6">
                          <h4 className="font-semibold mb-4">Resolution Steps</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-gold rounded-full"></div>
                              <span className="text-sm"><strong>Level 1:</strong> Customer Support Review</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-gold rounded-full"></div>
                              <span className="text-sm"><strong>Level 2:</strong> Supervisor Escalation</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-gold rounded-full"></div>
                              <span className="text-sm"><strong>Level 3:</strong> Management Review</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-gold rounded-full"></div>
                              <span className="text-sm"><strong>Level 4:</strong> Third-Party Mediation</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium">Appeal Process</h3>
                        <p>
                          You have 30 days from the refund decision to file an appeal. Appeals must include:
                        </p>
                        <ul>
                          <li>Original refund request reference number</li>
                          <li>Additional evidence or documentation</li>
                          <li>Clear explanation of why the decision should be reconsidered</li>
                        </ul>

                        <h3 className="text-lg font-medium mt-6">External Resolution</h3>
                        <p>
                          For unresolved disputes, users may seek resolution through:
                        </p>
                        <ul>
                          <li>Credit card chargeback procedures</li>
                          <li>PayPal dispute resolution</li>
                          <li>Consumer protection agencies</li>
                          <li>Legal arbitration services</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 8: Policy Modifications */}
                    <section id="modifications">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">8. Policy Modifications</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h3 className="text-lg font-medium">Updates and Changes</h3>
                        <p>
                          FilmCollab reserves the right to modify this Cancellation and Refund Policy 
                          at any time. Changes will be communicated through:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Notification Methods</h4>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                              <li>• Email notifications</li>
                              <li>• Platform announcements</li>
                              <li>• Website banner alerts</li>
                              <li>• In-app notifications</li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 dark:text-green-200">Advance Notice</h4>
                            <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                              <li>• 30 days for major changes</li>
                              <li>• 14 days for minor updates</li>
                              <li>• Immediate for legal requirements</li>
                              <li>• 7 days for fee adjustments</li>
                            </ul>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium">Grandfathering Policy</h3>
                        <p>
                          Existing transactions and active subscriptions will be governed by the 
                          policy terms in effect at the time of purchase, unless legally required otherwise.
                        </p>

                        <h3 className="text-lg font-medium mt-6">User Consent</h3>
                        <p>
                          Continued use of FilmCollab services after policy changes constitutes 
                          acceptance of the updated terms. Users who disagree with changes may 
                          cancel their services before the effective date.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    {/* Section 9: Contact Information */}
                    <section id="contact">
                      <h2 className="text-2xl font-semibold mb-4 text-gold">9. Contact Information</h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p>
                          For cancellation requests, refund inquiries, or questions about this policy, 
                          please contact our dedicated support team:
                        </p>
                        
                        <div className="bg-muted p-6 rounded-lg my-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold text-gold mb-3">Refund Support</h3>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">support@filmcollab.com</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Response within 24 hours</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-gold mb-3">General Support</h3>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">support@filmcollab.com</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Mon-Fri, 9AM-6PM EST</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium">Priority Support</h3>
                        <p>
                          For urgent refund matters involving:
                        </p>
                        <ul>
                          <li>Unauthorized transactions</li>
                          <li>Billing errors</li>
                          <li>Service disruptions</li>
                          <li>Account security issues</li>
                        </ul>
                        <p>
                          Please mark your email subject line with <strong>"URGENT REFUND REQUEST"</strong> 
                          for priority handling within 4 business hours.
                        </p>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Tip for Faster Processing</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Include your account email, transaction ID, and specific reason for refund 
                            in your initial contact to expedite the review process.
                          </p>
                        </div>
                    </div>
                    </section>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground pt-8 border-t">
                      <p>
                        This Cancellation and Refund Policy was last updated on {new Date().toLocaleDateString()}
                      </p>
                      <p className="mt-2">
                        © {new Date().getFullYear()} FilmCollab. All rights reserved.
                      </p>
                      <p className="mt-2">
                        Questions about this policy? Contact us at <strong>support@filmcollab.com</strong>
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
export default CancellationRefundPolicy;