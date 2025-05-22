import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 space-y-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="space-y-6 text-foreground/80">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gold">Overview</h2>
              <p>
                At FilmCollab, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website and use our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gold">
                Information We Collect
              </h2>
              <p>
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Create an account or user profile</li>
                <li>Submit casting calls or applications</li>
                <li>Upload portfolios, resumes, or other content</li>
                <li>Communicate with other users</li>
                <li>Contact our support team</li>
                <li>Participate in surveys or promotions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gold">
                How We Use Your Information
              </h2>
              <p>
                We may use the information we collect for various purposes,
                including to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>
                  Send administrative messages, updates, and security alerts
                </li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Facilitate connections between industry professionals</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Personalize and improve your experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gold">
                Sharing Your Information
              </h2>
              <p>We may share information as follows:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  With other users as part of the normal operation of the
                  platform
                </li>
                <li>With vendors, consultants, and service providers</li>
                <li>In response to legal process or governmental request</li>
                <li>
                  To protect the rights, property, and safety of our users and
                  the public
                </li>
                <li>
                  In connection with a business transaction such as a merger or
                  acquisition
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gold">
                Your Choices
              </h2>
              <p>
                You can access and update certain information about you through
                your account settings. You may also opt-out of receiving
                promotional emails by following the instructions in those
                emails.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gold">Security</h2>
              <p>
                We take reasonable measures to help protect information about
                you from loss, theft, misuse, unauthorized access, disclosure,
                alteration, and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gold">
                Changes to This Policy
              </h2>
              <p>
                We may change this Privacy Policy from time to time. If we make
                changes, we will notify you by revising the date at the top of
                the policy and, in some cases, provide you with additional
                notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gold">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
                <a
                  href="mailto:privacy@FilmCollab.com"
                  className="text-gold ml-1 hover:underline"
                >
                  privacy@FilmCollab.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
