import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BlogCard from './BlogCard'
import { blogApi } from '../utils/blogApi'

const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedBlogs()
  }, [])

  const fetchFeaturedBlogs = async () => {
    try {
      const data = await blogApi.getFeaturedBlogs()
      if (data.success) {
        setBlogs(data.blogs)
      }
    } catch (err) {
      // Error handled - user sees empty state
    } finally {
      setLoading(false)
    }
  }

  if (loading || blogs.length === 0) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Travel Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover inspiring destinations and travel tips from our latest blog posts
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} featured={true} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <span>Explore All Travel Blogs</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedBlogs
