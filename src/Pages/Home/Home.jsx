import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react'
import { useFeaturedProducts } from '../../hooks/useProducts'
import { useWishlist } from '../../hooks/useWishlist'
import { useCart } from '../../context/CartContext'
import { ProductCard } from '../ProductCard/ProductCard'
import { categories } from '../../data/products'

const categoryIcons = {
  Men: '👔',
  Women: '👗',
  Electronics: '📱',
  Footwear: '👟',
  Accessories: '⌚',
  Sports: '⚽'
}

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'Free shipping on all orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure payment methods' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support anytime you need' },
  { icon: CreditCard, title: 'Easy Returns', desc: '30-day money back guarantee' }
]

function Home() {
  const { products: featuredProducts, loading, error, refetch } = useFeaturedProducts(8)
  const { addToCart, setIsCartOpen } = useCart()
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    localStorage.setItem('newsletterEmail', email)
    alert('Subscribed!')
    setEmail('')
  }

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container relative z-10 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-white/20 backdrop-blur-xl text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                New Collection 2025
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Discover Your <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Style</span>
              </h1>
              <p className="text-lg text-white/80 max-w-xl mx-auto lg:mx-0 mb-8">
                Premium products at unbeatable prices. Shop the latest trends in fashion, electronics, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 backdrop-blur-xl"
                >
                  Explore
                </Link>
              </div>
              <div className="flex gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-white/70">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5K+</div>
                  <div className="text-sm text-white/70">Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.8</div>
                  <div className="text-sm text-white/70">Rating</div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                  <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white/20 flex items-center justify-center">
                    <img
                      src={featuredProducts.length > 0 ? featuredProducts[0].image : 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'}
                      alt="Featured Product"
                      className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white text-primary font-bold px-4 py-2 rounded-xl shadow-lg">
                  Best Seller
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-bg-light">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-text">Shop by Category</h2>
            <Link to="/shop" className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {categories.filter(c => c !== 'All').map(category => (
              <Link
                key={category}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="flex-shrink-0 bg-white hover:bg-primary hover:text-white text-text border border-border rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 min-w-[140px]"
              >
                <span className="text-4xl block mb-3">{categoryIcons[category] || '📦'}</span>
                <h3 className="font-semibold text-sm mb-1">{category}</h3>
                <span className="text-xs text-text-lighter group-hover:text-white/80">
                  {featuredProducts.filter(p => p.category === category).length || '-'} Products
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-text">Featured Products</h2>
            <Link to="/shop" className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors">
              View All <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="skeleton h-64 w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 w-20" />
                    <div className="skeleton h-5 w-full" />
                    <div className="skeleton h-4 w-24" />
                    <div className="flex items-center justify-between">
                      <div className="skeleton h-6 w-16" />
                      <div className="skeleton h-8 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-text mb-2">Something went wrong</h3>
              <p className="text-text-light mb-6">{error}</p>
              <button onClick={refetch} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-pink-500">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
                Limited Time Offer
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Summer Sale</h2>
              <p className="text-xl text-white/90 mb-6">Up to 50% Off on Selected Items</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white text-pink-500 hover:bg-gray-100 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg"
              >
                Shop Sale <ArrowRight size={18} />
              </Link>
            </div>
            <div className="flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400"
                alt="Summer Sale"
                className="w-64 h-64 object-cover rounded-full shadow-2xl border-4 border-white/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-bg-gray">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-light text-primary rounded-2xl mb-4">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-text-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Subscribe to our newsletter</h2>
              <p className="text-gray-400">Get the latest updates on new products and upcoming sales</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:w-80 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
              >
                Subscribe <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
