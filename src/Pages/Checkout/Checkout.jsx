import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { orderService } from '../../services/orderService'
import { ArrowLeft, CreditCard, Truck, Shield, Check, Loader2, AlertCircle } from 'lucide-react'
import { formatPrice } from '../../utils/constants'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [showSuccess, setShowSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [isAuthenticated, loading, navigate, location.pathname])

  useEffect(() => {
    if (loading) return
    if (cartItems.length === 0 && isAuthenticated) {
      navigate('/cart')
    }
  }, [cartItems.length, navigate, isAuthenticated, loading])

  if (!isAuthenticated || cartItems.length === 0) {
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setSubmitError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required'
    if (!formData.country) newErrors.country = 'Country is required'

    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
      else if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Card number is invalid'
      if (!formData.expiry.trim()) newErrors.expiry = 'Expiry date is required'
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Use MM/YY format'
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required'
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const shipping = cartTotal >= 100 ? 0 : 9.99
      const tax = cartTotal * 0.08
      const total = cartTotal + shipping + tax

      await orderService.createOrder(cartItems[0].id || 'user', {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          category: item.category
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        paymentMethod,
        subtotal: cartTotal,
        shipping,
        tax,
        total
      })

      await clearCart()
      setShowSuccess(true)
    } catch (err) {
      setSubmitError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Order Placed Successfully!</h2>
          <p className="text-slate-500 mb-8">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  const shipping = cartTotal >= 100 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shipping + tax

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          <div className="flex flex-wrap gap-4 mt-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
              <Truck size={16} className="text-blue-600" /> Free Shipping over $100
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
              <Shield size={16} className="text-blue-600" /> Secure Payment
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
              <CreditCard size={16} className="text-blue-600" /> Easy Checkout
            </span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.fullName ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.email ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.phone ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.address ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.city ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.state ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-slate-700 mb-1.5">ZIP Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="10001"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.zip ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                  />
                  {errors.zip && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.zip}</p>}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                  <div className="relative">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all duration-200 ${errors.country ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IN">India</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </div>
                  {errors.country && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.country}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <CreditCard size={20} className={paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'} />
                  <span className={`font-medium ${paymentMethod === 'card' ? 'text-blue-700' : 'text-slate-600'}`}>Credit / Debit Card</span>
                </label>
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <Truck size={20} className={paymentMethod === 'cod' ? 'text-blue-600' : 'text-slate-400'} />
                  <span className={`font-medium ${paymentMethod === 'cod' ? 'text-blue-700' : 'text-slate-600'}`}>Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1.5">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.cardNumber ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.expiry ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                    />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.expiry}</p>}
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 mb-1.5">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="4"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${errors.cvv ? 'border-red-500 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-100'} focus:outline-none focus:ring-4`}
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.cvv}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-1">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="relative w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 truncate">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> · </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax (8%)</span>
                  <span className="font-medium text-slate-900">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>

              {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-start gap-2">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              <Link
                to="/cart"
                className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
