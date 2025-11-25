import { useState, useEffect } from 'react'
import { blogApi } from '../utils/blogApi'
import { destinationApi } from '../utils/api'

const AdminBlogGenerator = () => {
  const [destinations, setDestinations] = useState([])
  const [selectedDestination, setSelectedDestination] = useState('')
  const [category, setCategory] = useState('Adventure')
  const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const categories = ['Adventure', 'Luxury', 'Family', 'Solo', 'Budget']

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const data = await destinationApi.getDestinations()
      if (data.success) {
        setDestinations(data.destinations)
      }
    } catch (err) {
      // Error handled silently
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const dest = destinations.find(d => d.destination_id === selectedDestination)
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k)

      const data = await blogApi.generateBlog({
        destination_name: dest.name,
        destination_id: dest.destination_id,
        category,
        keywords: keywordArray,
        auto_publish: false
      })

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to generate blog')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            AI Blog Generator
          </h1>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Destination Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose a destination...</option>
                {destinations.map((dest) => (
                  <option key={dest.destination_id} value={dest.destination_id}>
                    {dest.name}, {dest.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      category === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (optional, comma-separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., beach, culture, nightlife"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading || !selectedDestination}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Generating...' : '✨ Generate Blog Post'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Success Result */}
          {result && result.blog && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-green-900 mb-4">
                ✓ Blog Generated Successfully!
              </h2>
              <div className="space-y-3 text-sm">
                <p><strong>Title:</strong> {result.blog.title}</p>
                <p><strong>Slug:</strong> {result.blog.slug}</p>
                <p><strong>Category:</strong> {result.blog.category}</p>
                <p><strong>Status:</strong> {result.blog.status}</p>
                <p><strong>Tags:</strong> {result.blog.tags?.join(', ')}</p>
                <div className="mt-4 pt-4 border-t border-green-300">
                  <p className="text-xs text-green-700">
                    Blog saved as draft. You can view it in the blog list.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminBlogGenerator
