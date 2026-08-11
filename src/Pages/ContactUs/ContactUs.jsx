import { useState, useEffect } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  User,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { contactService } from '../../services/contactService'

const initialForm = { name: '', email: '', subject: '', message: '' }

const ContactUs = () => {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => setSubmitted(false), 5000)
      return () => clearTimeout(t)
    }
  }, [submitted])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await contactService.submitContactRequest(formData)
      setSubmitted(true)
      setFormData(initialForm)
      setErrors({})
    } catch (_err) {
      setSubmitError('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <section className="w-full bg-gradient-to-r from-slate-900 to-blue-700 py-20 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Get in Touch
          </h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="lg:order-1">
              {submitted && (
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-4 py-3 mb-6">
                  <CheckCircle size={18} />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}
              {submitError && (
                <div className="flex items-center gap-3 bg-red-50 text-red-800 border border-red-200 rounded-lg px-4 py-3 mb-6">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Send us a Message</h2>
                <p className="text-slate-500 text-sm mb-6">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1"
                    >
                      <User size={16} /> Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.name
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1"
                    >
                      <Mail size={16} /> Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1"
                    >
                      <MessageCircle size={16} /> Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.subject
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-300 focus:border-blue-600'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-red-600 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="message"
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1"
                  >
                    <Send size={16} /> Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-600 placeholder-slate-400 transition-colors resize-y focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                      errors.message
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-600'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-600 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-8 inline-flex items-center justify-center gap-2 bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="lg:order-2 space-y-8">
              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Contact Information</h2>
                <p className="text-slate-500 text-sm mb-6">
                  Reach out to us through any of these channels.
                </p>

                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Address</h4>
                      <p className="text-slate-600 text-sm">
                        123 Commerce Street, Tech Park
                        <br />
                        New York, NY 10001, USA
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Phone</h4>
                      <p className="text-slate-600 text-sm">
                        +1 (555) 123-4567
                        <br />
                        +1 (555) 987-6543
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Email</h4>
                      <p className="text-slate-600 text-sm">
                        support@virevo.com
                        <br />
                        sales@virevo.com
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">Working Hours</h4>
                      <p className="text-slate-600 text-sm">
                        Monday - Friday: 9AM - 6PM
                        <br />
                        Saturday: 10AM - 4PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <MapPin size={28} />
                  </div>
                  <p className="font-semibold text-slate-800">Interactive Map</p>
                  <span className="text-sm text-slate-600">
                    123 Commerce Street, New York, NY 10001
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
