import { useState } from 'react'

const OptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallback = '/placeholder.jpg',
  width,
  height
}) => {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const imageSrc = error ? fallback : src

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  )
}

export default OptimizedImage
