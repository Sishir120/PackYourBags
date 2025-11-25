import React from 'react'

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-himalayan-white z-50'
    : 'flex items-center justify-center py-8'

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-forest-green border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

export default Loading
