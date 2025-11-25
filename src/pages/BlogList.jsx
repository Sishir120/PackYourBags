import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import Loading from '../components/Loading'
import SEO from '../components/SEO'
import { blogApi } from '../utils/blogApi'

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({})

  const selectedCategory = searchParams.get('category') || ''
  const currentPage = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    fetchBlogs()
    fetchCategories()
  }, [selectedCategory, currentPage])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const data = await blogApi.getBlogs({
        category: selectedCategory || undefined,
        page: currentPage,
        perPage: 12
      })
      
      if (data.success) {
        setBlogs(data.blogs)
        setPagination(data.pagination)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await blogApi.getCategories()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (err) {
      // Error handled silently
    }
  }

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    params.set('page', '1')
    setSearchParams(params)
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && blogs.length === 0) return <Loading />

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Travel Blog & Guides"
        description="Discover travel tips, destination guides, and adventure inspiration from PackYourBags blog."
        keywords="travel blog, destination guides, travel tips, adventure stories"
        url="/blog"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4 font-serif">Travel Blog</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover destinations, tips, and stories to inspire your next adventure
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              !selectedCategory
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            All Posts
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat.name
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Blog Grid */}
        {blogs.length === 0 && !loading ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No blogs found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_prev}
              className="px-4 py-2 rounded-lg bg-white shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {[...Array(pagination.pages)].map((_, i) => {
              const page = i + 1
              if (
                page === 1 ||
                page === pagination.pages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'bg-white hover:bg-gray-50'
                    } shadow`}
                  >
                    {page}
                  </button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>
              }
              return null
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next}
              className="px-4 py-2 rounded-lg bg-white shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList