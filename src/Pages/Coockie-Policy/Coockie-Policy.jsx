import { Calendar } from 'lucide-react'

const lastUpdated = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const cookieTypes = [
  {
    name: 'Essential Cookies',
    description:
      'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.',
  },
  {
    name: 'Performance Cookies',
    description:
      'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve how our website works.',
  },
  {
    name: 'Functionality Cookies',
    description:
      'These cookies allow the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
  },
  {
    name: 'Targeting / Advertising Cookies',
    description:
      'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.',
  },
]

const CookiePolicy = () => {
  return (
    <div className="w-full">
      <section className="w-full bg-gradient-to-r from-slate-900 to-blue-700 py-16 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg opacity-90">
            Learn how we use cookies to improve your browsing experience.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-10">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-8 pb-4 border-b border-slate-200">
              <Calendar size={16} />
              <span>Last updated: {lastUpdated}</span>
            </div>

            <div className="prose prose-slate max-w-none">
              <h2>What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website.
                They are widely used to make websites work more efficiently, to remember user
                preferences, and to provide information to the website owners.
              </p>
              <p>
                Cookies are not harmful and do not contain any personal information that could
                identify you directly. They are designed to be a reliable mechanism for websites to
                remember stateful information or to record the user's browsing activity.
              </p>

              <h2>How We Use Cookies</h2>
              <p>
                Virevo uses cookies to enhance your browsing experience, analyze site traffic, and
                personalize content. By using our website, you consent to our use of cookies in
                accordance with this policy.
              </p>
              <p>Specifically, we use cookies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Understand how you interact with our website</li>
                <li>Improve the performance and functionality of our site</li>
                <li>Deliver personalized content and advertisements</li>
                <li>Prevent fraud and enhance security</li>
              </ul>

              <h2>Types of Cookies We Use</h2>
              <p>We use the following types of cookies on our website:</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {cookieTypes.map((type) => (
                  <div
                    key={type.name}
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                  >
                    <h4 className="font-semibold text-slate-800 mb-1">{type.name}</h4>
                    <p className="text-slate-600 text-sm">{type.description}</p>
                  </div>
                ))}
              </div>

              <h2 id="managing-cookies">Managing Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings preferences.
                However, limiting the ability of websites to set cookies may worsen your overall
                user experience and may prevent you from accessing certain features of our website.
              </p>
              <p>To manage cookies in your browser:</p>
              <ul>
                <li>
                  <strong>Chrome:</strong> Settings &rarr; Privacy and security &rarr; Cookies and
                  other site data
                </li>
                <li>
                  <strong>Firefox:</strong> Options &rarr; Privacy &amp; Security &rarr; Cookies
                  and Site Data
                </li>
                <li>
                  <strong>Safari:</strong> Preferences &rarr; Privacy &rarr; Cookies and website
                  data
                </li>
                <li>
                  <strong>Edge:</strong> Settings &rarr; Cookies and site permissions
                </li>
              </ul>
              <p>
                For more information about cookies, including how to see what cookies have been set
                and how to manage and delete them, visit{' '}
                <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">
                  www.aboutcookies.org
                </a>
                .
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect changes to
                the cookies we use or for other operational, legal, or regulatory reasons. Please
                revisit this Cookie Policy regularly to stay informed of the latest version.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please
                contact us at{' '}
                <a href="mailto:privacy@virevo.com">privacy@virevo.com</a> or through our{' '}
                <a href="/contact">Contact Us</a> page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CookiePolicy
