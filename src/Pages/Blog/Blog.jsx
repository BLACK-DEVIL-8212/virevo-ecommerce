import { useState } from 'react'
import { Calendar, Tag, Search } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    date: 'Aug 10, 2026',
    category: 'Lifestyle',
    title: 'Top 10 Summer Essentials You Need This Season',
    excerpt:
      'From sun protection to stylish accessories, here are the must-have items to make your summer unforgettable.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
    date: 'Aug 5, 2026',
    category: 'Technology',
    title: 'The Future of Smart Home Devices in 2026',
    excerpt:
      'Explore how AI-powered smart home gadgets are transforming the way we live and interact with our spaces.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop',
    date: 'Jul 28, 2026',
    category: 'Fashion',
    title: 'Sustainable Fashion: Trends That Matter',
    excerpt:
      'Why sustainable fashion is more than a trend and how you can make eco-friendly choices without sacrificing style.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    date: 'Jul 20, 2026',
    category: 'Audio',
    title: 'How to Choose the Perfect Headphones for You',
    excerpt:
      'A comprehensive guide to finding the right headphones based on your listening habits, budget, and preferences.',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
    date: 'Jul 12, 2026',
    category: 'Lifestyle',
    title: 'Minimalist Living: Less Is More',
    excerpt:
      'Discover the art of minimalist living and how owning fewer, better things can improve your quality of life.',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop',
    date: 'Jul 5, 2026',
    category: 'Wellness',
    title: 'Wellness Trends That Actually Work',
    excerpt:
      'Separating the hype from the help: wellness trends that have been proven to make a real difference.',
  },
]

const categories = ['All', 'Lifestyle', 'Technology', 'Fashion', 'Audio', 'Wellness']
const tags = ['Summer', 'Tech', 'Style', 'Health', 'Home', 'Travel', 'Work', 'Minimalism']

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const recentPosts = blogPosts.slice(0, 3)

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="w-full">
      <section className="w-full bg-gradient-to-r from-slate-900 to-blue-700 py-20 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Our Blog</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and stories from the world of ecommerce
            and lifestyle.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            <main className="space-y-8">
              {filteredPosts.length === 0 ? (
                <p className="text-slate-500">No posts found. Try adjusting your search or filter.</p>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                    >
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-0.5 bg-white/90 text-slate-700 rounded-full backdrop-blur">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag size={12} /> {post.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        <a
                          href="#"
                          className="mt-auto inline-flex items-center gap-1 text-blue-700 font-semibold text-sm hover:text-blue-800 transition-colors"
                        >
                          Read More →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </main>

            <aside className="space-y-8 lg:sticky lg:top-24 lg:h-fit">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Search</h3>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Categories</h3>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          activeCategory === cat
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Posts</h3>
                <ul className="space-y-4">
                  {recentPosts.map((post) => (
                    <li key={post.id} className="flex gap-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <span className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                          <Calendar size={10} /> {post.date}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full cursor-pointer transition-colors hover:bg-blue-100 hover:text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog
