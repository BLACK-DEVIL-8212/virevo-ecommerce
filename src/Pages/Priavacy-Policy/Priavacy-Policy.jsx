import { Calendar, Shield, Lock } from 'lucide-react'

const lastUpdated = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const PrivacyPolicy = () => {
  return (
    <div className="w-full">
      <section className="w-full bg-gradient-to-r from-slate-900 to-blue-700 py-16 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg opacity-90">
            Your privacy is important to us. This policy explains how we collect, use, and
            protect your personal information.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-10">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-8 pb-4 border-b border-slate-200">
              <Calendar size={16} />
              <span>Effective Date: {lastUpdated}</span>
            </div>

            <div className="prose prose-slate max-w-none">
              <h2>
                <Shield className="inline mr-2" size={22} />
                Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us when you create an account,
                make a purchase, or contact our support team. This may include your name, email
                address, phone number, shipping address, and payment details.
              </p>
              <p>
                We also automatically collect certain information when you visit our website,
                including your IP address, browser type, device information, pages visited, and
                time spent on our site.
              </p>

              <h2>
                <Lock className="inline mr-2" size={22} /> How We Use Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your account and orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our website, products, and services</li>
                <li>Send you promotional communications (with your consent)</li>
                <li>Detect and prevent fraud or unauthorized activity</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>
                <Shield className="inline mr-2" size={22} /> Data Protection
              </h2>
              <p>
                We implement industry-standard security measures to protect your personal
                information from unauthorized access, alteration, disclosure, or destruction.
                This includes encryption, secure servers, and regular security audits.
              </p>
              <p>
                While we strive to protect your personal data, no method of transmission over the
                Internet or electronic storage is 100% secure. We cannot guarantee absolute
                security but continuously work to improve our security practices.
              </p>
              <p>
                We retain your personal information only for as long as necessary to fulfill the
                purposes outlined in this policy, unless a longer retention period is required or
                permitted by law.
              </p>

              <h2 id="your-rights">Your Rights</h2>
              <p>
                Depending on your location, you may have the following rights regarding your
                personal data:
              </p>
              <ul>
                <li>
                  <strong>Right to Access:</strong> Request a copy of the personal data we hold
                  about you.
                </li>
                <li>
                  <strong>Right to Correction:</strong> Request that we correct any inaccurate or
                  incomplete data.
                </li>
                <li>
                  <strong>Right to Deletion:</strong> Request that we delete your personal data
                  under certain circumstances.
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> Request that we limit how we use
                  your data.
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Request that we transfer your data
                  to another organization.
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to our processing of your personal data
                  in certain situations.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@virevo.com">privacy@virevo.com</a>.
              </p>

              <h2>Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. For
                detailed information about how we use cookies, please refer to our{' '}
                <a href="/cookie-policy">Cookie Policy</a>.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                We may use third-party services to help us operate our business and improve our
                services. These third parties have access to your personal information only to
                perform specific tasks on our behalf and are obligated not to disclose or use it
                for any other purpose.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                material changes by posting the new policy on this page with an updated effective
                date. Your continued use of our services after any changes indicates your
                acceptance of the new policy.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please
                contact our Data Protection Officer at{' '}
                <a href="mailto:privacy@virevo.com">privacy@virevo.com</a> or visit our{' '}
                <a href="/contact">Contact Us</a> page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
