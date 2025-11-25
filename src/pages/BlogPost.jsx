import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import DOMPurify from 'dompurify'
import Loading from '../components/Loading'
import SEO from '../components/SEO'
import { blogApi } from '../utils/blogApi'
import { escapeHTML } from '../utils/security'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Validate slug to prevent XSS
      if (!slug || typeof slug !== 'string' || slug.length > 200) {
        throw new Error('Invalid blog post URL')
      }
      
      const data = await blogApi.getBlogBySlug(slug)
      
      if (data.success && data.blog) {
        // Sanitize blog data
        const sanitizedBlog = {
          ...data.blog,
          title: escapeHTML(data.blog.title || ''),
          excerpt: data.blog.excerpt ? escapeHTML(data.blog.excerpt) : null,
          content: data.blog.content || '', // ReactMarkdown handles sanitization
          meta_title: data.blog.meta_title ? escapeHTML(data.blog.meta_title) : null,
          meta_description: data.blog.meta_description ? escapeHTML(data.blog.meta_description) : null
        }
        setBlog(sanitizedBlog)
      } else {
        setError('Blog post not found')
      }
    } catch (err) {
      console.error('Error fetching blog:', err)
      setError(err.message || 'Failed to load blog post. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  // Use destination image as fallback if no featured image
  const imageUrl = blog.featured_image || 
                  (blog.destination && blog.destination.images && blog.destination.images[0]) ||
                  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90'

  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Draft'

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={blog.meta_title || blog.title}
        description={blog.meta_description || blog.excerpt}
        keywords={blog.meta_keywords}
        image={imageUrl}
        url={`/blog/${blog.slug}`}
        type="article"
        article={{
          published_at: blog.published_at,
          updated_at: blog.updated_at,
          tags: blog.tags
        }}
      />

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=90'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Breadcrumb on Image */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-white/90 text-sm mb-4">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-white">Blog</Link>
              <span>/</span>
              <span className="text-white">{blog.title}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Badge */}
        {blog.category && (
          <Link 
            to={`/blog?category=${blog.category}`}
            className="inline-block px-4 py-1 mb-4 text-sm font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition"
          >
            {blog.category}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight font-serif">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{formattedDate}</span>
          </div>

          {blog.views > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>{blog.views} views</span>
            </div>
          )}

          {blog.ai_generated && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
              </svg>
              AI-Assisted
            </span>
          )}
        </div>

        {/* Excerpt */}
        {blog.excerpt && (
          <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded font-light italic">
            {blog.excerpt}
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-900 font-serif" {...props} />,
              h2: ({node, ...props}) => <h3 className="text-2xl font-bold mt-6 mb-3 text-gray-800 font-serif" {...props} />,
              h3: ({node, ...props}) => <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-800 font-serif" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed font-light" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="text-gray-700 font-light" {...props} />,
              a: ({node, ...props}) => {
                // Validate URLs to prevent XSS
                const href = props.href
                if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                  return (
                    <a 
                      className="text-blue-600 hover:text-blue-800 underline font-medium" 
                      href={DOMPurify.sanitize(href)}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  )
                }
                return <a className="text-blue-600 hover:text-blue-800 underline font-medium" {...props} />
              },
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-green-500 pl-4 py-2 my-4 italic text-gray-700 bg-gray-50 font-light" {...props} />
              ),
              code: ({node, inline, ...props}) => 
                inline ? (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600 font-medium" {...props} />
                ) : (
                  <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm font-medium" {...props} />
                ),
              img: ({node, ...props}) => (
                <img 
                  {...props} 
                  className="rounded-lg my-6 shadow-lg w-full h-auto"
                  loading="lazy"
                  alt={props.alt || 'Blog image'}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=90'
                  }}
                />
              )
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => {
                // Sanitize tag to prevent XSS
                const sanitizedTag = typeof tag === 'string' ? escapeHTML(tag).slice(0, 50) : ''
                if (!sanitizedTag) return null
                
                return (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition cursor-pointer font-light"
                  >
                    #{sanitizedTag}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Posts
          </Link>
        </div>
      </article>
    </div>
  )
}

export default BlogPost