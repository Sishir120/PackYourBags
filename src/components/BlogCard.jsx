import { Link } from 'react-router-dom'

const BlogCard = ({ blog, featured = false }) => {
  const formattedDate = blog.published_at 
    ? new Date(blog.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Draft'

  // Use destination image as fallback if no featured image
  const imageUrl = blog.featured_image || 
                  (blog.destination && blog.destination.images && blog.destination.images[0]) ||
                  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=90'

  const cardClass = featured
    ? 'group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-96'
    : 'group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-80'

  return (
    <Link to={`/blog/${blog.slug}`} className={cardClass}>
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=90'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        {/* Category Badge */}
        {blog.category && (
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-sm w-fit">
            {blog.category}
          </span>
        )}

        {/* Title */}
        <h3 className={`font-bold mb-2 group-hover:text-yellow-300 transition-colors ${
          featured ? 'text-3xl' : 'text-xl'
        }`}>
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-white/90 text-sm mb-4 line-clamp-2 font-light">
          {blog.excerpt || 'Discover more about this amazing destination in our detailed travel guide.'}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>{formattedDate}</span>
          {blog.views > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {blog.views}
            </span>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs text-white/70">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default BlogCard