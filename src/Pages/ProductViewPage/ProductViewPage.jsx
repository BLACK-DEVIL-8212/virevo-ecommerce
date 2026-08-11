import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Heart, Truck, Shield, ArrowLeft, Check, Minus, Plus } from 'lucide-react'
import { useProduct } from '../../hooks/useProducts'
import { useProducts } from '../../hooks/useProducts'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../hooks/useWishlist'
import { reviewService } from '../../services/reviewService'
import { formatPrice } from '../../utils/constants'

function StarRating({ rating, size = 16 }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} size={size} fill="#f59e0b" stroke="#f59e0b" />)
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <span key={i} className="relative inline-flex">
          <Star size={size} fill="#f59e0b" stroke="#f59e0b" />
          <Star size={size} stroke="#e2e8f0" className="absolute left-0" />
        </span>
      )
    } else {
      stars.push(<Star key={i} size={size} stroke="#e2e8f0" />)
    }
  }
  return <div className="flex gap-0.5">{stars}</div>
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-slate-200 rounded-2xl" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-16 h-16 bg-slate-200 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-10 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="flex gap-3 pt-4">
            <div className="h-10 bg-slate-200 rounded w-10" />
            <div className="h-10 bg-slate-200 rounded w-10" />
            <div className="h-10 bg-slate-200 rounded w-10" />
          </div>
          <div className="h-12 bg-slate-200 rounded w-full" />
        </div>
      </div>
    </div>
  )
}

export default function ProductViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  const { products: allProducts } = useProducts()
  const { addToCart, setIsCartOpen } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [mainImage, setMainImage] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (product) {
      setMainImage(product.image)
      setSelectedSize(null)
      setSelectedColor(null)
      setQuantity(1)
      setImageLoaded(false)

      const stored = localStorage.getItem('recentlyViewed')
      if (stored) {
        const viewed = JSON.parse(stored).filter(p => p.id !== product.id)
        viewed.unshift(product)
        const trimmed = viewed.slice(0, 8)
        localStorage.setItem('recentlyViewed', JSON.stringify(trimmed))
        setRecentlyViewed(trimmed.slice(1, 5))
      } else {
        localStorage.setItem('recentlyViewed', JSON.stringify([product]))
        setRecentlyViewed([])
      }
    }
  }, [product])

  useEffect(() => {
    if (product && activeTab === 'reviews') {
      setReviewsLoading(true)
      reviewService.getProductReviews(product.id)
        .then(data => setReviews(data))
        .catch(() => setReviews([]))
        .finally(() => setReviewsLoading(false))
    }
  }, [product, activeTab])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-6 animate-pulse" />
          <ProductSkeleton />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowLeft size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Product Not Found</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const images = product.images && product.images.length > 0 ? product.images : [product.image]

  const handleAddToCart = () => {
    const size = product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' ? selectedSize || product.sizes[0] : null
    const color = product.colors && product.colors.length > 0 ? selectedColor || product.colors[0] : null
    addToCart(product, quantity, size, color)
    setIsCartOpen(true)
  }

  const handleBuyNow = () => {
    const size = product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' ? selectedSize || product.sizes[0] : null
    const color = product.colors && product.colors.length > 0 ? selectedColor || product.colors[0] : null
    addToCart(product, quantity, size, color)
    setIsCartOpen(true)
    navigate('/checkout')
  }

  const reviewCount = reviews.length > 0 ? reviews.length : product.reviews || 0
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : product.rating || 0

  const breakdown = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length
    const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0
    return { star, count, pct }
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-slate-400">/</span>
          <Link to="/shop" className="text-slate-500 hover:text-blue-600 transition-colors">Shop</Link>
          <span className="text-slate-400">/</span>
          <Link to={`/shop?category=${product.category}`} className="text-slate-500 hover:text-blue-600 transition-colors capitalize">
            {product.category}
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative rounded-2xl overflow-hidden bg-white aspect-square mb-4 group">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  {product.badge}
                </span>
              )}
              <div className="w-full h-full overflow-hidden">
                <img
                  src={mainImage}
                  alt={product.name}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                )}
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setMainImage(img); setImageLoaded(false) }}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${mainImage === img ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={product.rating} />
                <span className="font-semibold text-slate-900">{product.rating}</span>
                <span className="text-slate-500 text-sm">({reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</span>
              <span className="text-lg text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="bg-red-50 text-red-600 text-sm font-semibold px-2.5 py-1 rounded-md">
                -{discount}%
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-900">Size</label>
                  {selectedSize && <span className="text-sm text-blue-600 font-medium capitalize">{selectedSize}</span>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-10 px-4 rounded-lg border text-sm font-medium transition-all duration-200 ${selectedSize === size ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-900">Color</label>
                  {selectedColor && <span className="text-sm text-blue-600 font-medium capitalize">{selectedColor}</span>}
                </div>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${selectedColor === color ? 'border-blue-600 shadow-md scale-110' : 'border-transparent hover:scale-110'}`}
                    >
                      <span
                        className="w-7 h-7 rounded-full border border-slate-200 block"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-semibold text-slate-900 mb-3 block">Quantity</label>
              <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="h-12 px-6 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-200 ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400'}`}
              >
                <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Truck size={18} className="text-blue-600" />
                <div>
                  <strong className="block text-slate-900">Free Shipping</strong>
                  <span className="text-xs text-slate-500">On orders over $50</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield size={18} className="text-blue-600" />
                <div>
                  <strong className="block text-slate-900">Secure Payment</strong>
                  <span className="text-xs text-slate-500">100% protected</span>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">SKU</span>
                <span className="text-slate-900 font-medium">SKU-{product.id.toString().padStart(5, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category</span>
                <Link to={`/shop?category=${product.category}`} className="text-blue-600 hover:text-blue-700 capitalize">{product.category}</Link>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tags</span>
                <span className="text-slate-900 capitalize">{product.category.toLowerCase()}, premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-16">
          <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide">
            {['description', 'features', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab === 'reviews' ? `Reviews (${reviewCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-6 lg:p-8">
            {activeTab === 'description' && (
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(product.features || []).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Check size={18} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-slate-100 mb-8">
                  <div className="text-center sm:text-left sm:w-48 flex-shrink-0">
                    <div className="text-5xl font-bold text-slate-900 leading-none mb-2">{avgRating.toFixed(1)}</div>
                    <StarRating rating={avgRating} size={20} />
                    <p className="text-sm text-slate-500 mt-1">{reviewCount} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {breakdown.map(({ star, count, pct }) => (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="w-3 text-slate-600">{star}</span>
                        <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-slate-500 text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse p-5 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-full" />
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-32" />
                            <div className="h-3 bg-slate-200 rounded w-20" />
                          </div>
                        </div>
                        <div className="h-3 bg-slate-200 rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="p-5 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {(review.userName || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <strong className="block text-sm text-slate-900">{review.userName || 'Anonymous'}</strong>
                              <p className="text-xs text-slate-500">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                              </p>
                            </div>
                          </div>
                          <StarRating rating={review.rating || 0} size={14} />
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 relative inline-block">
              You May Also Like
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-blue-600 rounded-full" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={related.image} alt={related.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {related.badge && (
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {related.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{related.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-blue-600">{formatPrice(related.price)}</span>
                      <span className="text-sm text-slate-400 line-through">{formatPrice(related.originalPrice)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={related.rating} size={14} />
                      <span className="text-xs text-slate-500">({related.reviews})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 relative inline-block">
              Recently Viewed
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-blue-600 rounded-full" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map(item => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">{formatPrice(item.price)}</span>
                      <span className="text-sm text-slate-400 line-through">{formatPrice(item.originalPrice)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
