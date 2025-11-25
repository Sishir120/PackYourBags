import { API_BASE_URL } from '../config'
import { mockBlogs } from '../data/mockBlogs'

/**
 * Blog API utilities
 */

export const blogApi = {
  /**
   * Get all blogs with filters
   */
  async getBlogs({ category, tag, featured, page = 1, perPage = 12 } = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    let filtered = [...mockBlogs]

    if (category) {
      filtered = filtered.filter(blog => blog.category === category)
    }

    if (tag) {
      filtered = filtered.filter(blog => blog.tags && blog.tags.includes(tag))
    }

    if (featured !== undefined) {
      filtered = filtered.filter(blog => blog.featured === featured)
    }

    // Pagination logic
    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedBlogs = filtered.slice(start, end)
    const totalPages = Math.ceil(filtered.length / perPage)

    return {
      success: true,
      blogs: paginatedBlogs,
      pagination: {
        pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
        total: filtered.length
      }
    }
  },

  /**
   * Get single blog by slug
   */
  async getBlogBySlug(slug) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const blog = mockBlogs.find(b => b.slug === slug)
    if (!blog) throw new Error('Blog not found')

    return { data: blog }
  },

  /**
   * Get blog categories
   */
  async getCategories() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const categories = [...new Set(mockBlogs.map(b => b.category))].map(name => ({
      name,
      count: mockBlogs.filter(b => b.category === name).length
    }))
    return {
      success: true,
      categories
    }
  },

  /**
   * Get featured blogs
   */
  async getFeaturedBlogs() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400))

    const featured = mockBlogs.filter(b => b.featured)
    return {
      success: true,
      blogs: featured
    }
  },

  /**
   * Generate AI blog (admin)
   */
  async generateBlog({ destination_name, destination_id, category, keywords, auto_publish = false }) {
    console.log('Mock generating blog for:', destination_name)
    await new Promise(resolve => setTimeout(resolve, 2000))

    return {
      success: true,
      message: 'Blog generated successfully (Mock)',
      data: {
        id: Math.floor(Math.random() * 1000) + 100,
        title: `Discovering ${destination_name}`,
        slug: `discovering-${destination_name.toLowerCase().replace(/\s+/g, '-')}`,
        excerpt: `A generated guide to ${destination_name}...`,
        status: auto_publish ? 'published' : 'draft'
      }
    }
  }
}
