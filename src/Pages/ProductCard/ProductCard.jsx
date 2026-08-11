import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Eye, Search, ChevronRight, Package, SlidersHorizontal } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../hooks/useWishlist'
import { useProducts } from '../../hooks/useProducts'
import { categories } from '../../data/products'
import { ProductCardSkeleton } from '../../Components/ui/Skeletons'
import { EmptyState, ErrorState } from '../../Components/ui/States'

function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    setIsCartOpen(true)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <div className="group bg-white rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlist}
            className="bg-white/90 backdrop-blur-xl rounded-full p-2 shadow-md hover:scale-110 transition-transform"
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              className={isInWishlist(product.id) ? 'fill-danger text-danger' : 'text-text'}
            />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="bg-white/90 backdrop-blur-xl rounded-full p-2 shadow-md hover:scale-110 transition-transform"
            aria-label="Quick view"
          >
            <Eye size={18} className="text-text" />
          </Link>
        </div>
      </div>

      <div className="p-4">
        <span className="text-xs font-medium text-primary">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-text mt-1 hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <Star size={14} className="fill-accent text-accent" />
          <span className="text-sm font-medium text-text">{product.rating}</span>
          <span className="text-xs text-text-lighter">({product.reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-text">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-text-lighter line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

function ProductCardPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')

  const { products, loading, error, refetch } = useProducts()

  const filteredProducts = products
    .filter(product => activeCategory === 'All' || product.category === activeCategory)
    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-text">Shop All Products</h1>
          <p className="text-text-light mt-2">Discover our latest collection of premium products</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 w-full lg:w-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-text-light border border-border hover:border-primary hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-lighter" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full lg:w-64 pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-text-lighter" size={18} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-lg border border-border bg-white focus:border-primary outline-none appearance-none cursor-pointer"
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Failed to load products" message={error} onRetry={refetch} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={<Package size={48} />}
            title="No products found"
            description="Try adjusting your search or filter to find what you're looking for."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCardPage
export { ProductCard }
