import { Calendar, FileText, Shield, Truck, RefreshCw, AlertTriangle } from 'lucide-react'

const lastUpdated = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const TermsAndConditions = () => {
  return (
    <div className="w-full">
      <section className="w-full bg-gradient-to-r from-slate-900 to-blue-700 py-16 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg opacity-90">
            Please read these terms carefully before using our services. By accessing Virevo,
            you agree to be bound by these terms.
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
                <FileText className="inline mr-2" size={22} /> Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Virevo website and services, you agree to comply with
                and be bound by these Terms & Conditions. If you do not agree to these terms,
                please do not use our services.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting on this page. Your continued use of our services
                following any changes indicates your acceptance of the new terms.
              </p>

              <h2>
                <FileText className="inline mr-2" size={22} /> Product Information
              </h2>
              <p>
                We strive to display accurate product information, including descriptions,
                specifications, and pricing. However, we do not warrant that product descriptions,
                specifications, or other content is accurate, complete, reliable, current, or
                error-free.
              </p>
              <p>
                Colors and measurements shown on our website may vary slightly from actual
                products due to screen settings, lighting, and manufacturing tolerances. We
                reserve the right to discontinue any product or service at any time without
                notice.
              </p>

              <h2>Pricing</h2>
              <p>
                All prices displayed on our website are in US Dollars (USD) unless otherwise
                stated. Prices are subject to change without notice. We reserve the right to
                modify pricing, suspend sales, or refuse any order at any time without liability.
              </p>
              <p>
                The price displayed at checkout is the final price you will be charged, including
                applicable taxes and shipping costs. We are not responsible for pricing errors and
                reserve the right to cancel orders resulting from such errors.
              </p>

              <h2>
                <Shield className="inline mr-2" size={22} /> Payment
              </h2>
              <p>
                We accept major credit cards, debit cards, and other payment methods as specified
                at checkout. By providing payment information, you represent and warrant that you
                are authorized to use the payment method and authorize us to charge the applicable
                amount.
              </p>
              <p>
                All payment transactions are processed securely using industry-standard
                encryption. We do not store your full credit card details on our servers. Payment
                processing is handled by trusted third-party payment providers.
              </p>

              <h2>
                <Truck className="inline mr-2" size={22} /> Shipping
              </h2>
              <p>
                We ship to addresses within the United States and select international locations.
                Shipping costs and delivery times vary based on location, product availability, and
                shipping method selected at checkout.
              </p>
              <p>
                Risk of loss and title for items purchased pass to you upon delivery to the
                carrier. We are not responsible for delays or damages caused by carriers. Please
                inspect all packages upon delivery and report any issues immediately.
              </p>

              <h2>
                <RefreshCw className="inline mr-2" size={22} /> Returns
              </h2>
              <p>
                We want you to be completely satisfied with your purchase. If you are not happy
                with your order, you may return most items within 30 days of delivery for a full
                refund or exchange, provided they are in original condition with all packaging and
                accessories.
              </p>
              <p>
                To initiate a return, please contact our customer support team. Return shipping
                costs may be the responsibility of the customer unless the return is due to a
                defect or error on our part. Refunds are typically processed within 5-10 business
                days after we receive the returned item.
              </p>

              <h2>
                <AlertTriangle className="inline mr-2" size={22} /> Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, Virevo shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages, including
                but not limited to loss of profits, data, or goodwill, arising from your use of
                our services or products.
              </p>
              <p>
                In no event shall our total liability to you for all claims arising out of or
                relating to the use of our services exceed the amount paid by you to us during the
                twelve (12) months prior to the event giving rise to the claim.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms & Conditions are governed by and construed in accordance with the laws
                of the State of New York, United States, without regard to conflict of law
                principles. Any disputes arising under these terms shall be resolved in the courts
                located in New York County, New York.
              </p>

              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms & Conditions, please contact us at{' '}
                <a href="mailto:legal@virevo.com">legal@virevo.com</a> or through our{' '}
                <a href="/contact">Contact Us</a> page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsAndConditions
