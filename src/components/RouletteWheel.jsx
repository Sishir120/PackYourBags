import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Globe, MapPin, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const RouletteWheel = ({ destinations, isSpinning, onSpinComplete }) => {
  const [rotation, setRotation] = useState(0)
  const [displayDestinations, setDisplayDestinations] = useState([])
  const wheelRef = useRef(null)
  const spinTimeoutRef = useRef(null)

  // Limit to 8 destinations for the wheel
  useEffect(() => {
    if (destinations && destinations.length > 0) {
      setDisplayDestinations(destinations.slice(0, 8))
    }
  }, [destinations])

  // Spin logic
  useEffect(() => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)

    if (isSpinning && displayDestinations.length > 0) {
      const randomIndex = Math.floor(Math.random() * displayDestinations.length)
      const segmentAngle = 360 / displayDestinations.length

      // Reset rotation to 0 (or a multiple of 360) to start fresh
      setRotation(0)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 5 full rotations + target alignment
          // We want the target segment to be at the top (0 degrees)
          // Segment 0 is from 0 to angle. Center is angle/2.
          // To align center of segment i to top (0 deg), we rotate by -(i * angle + angle/2).
          // We add 360 * 5 for 5 full spins.

          const targetAngle = randomIndex * segmentAngle + segmentAngle / 2
          const fullRotations = 360 * 5
          const finalRotation = fullRotations - targetAngle

          setRotation(finalRotation)
        })
      })

      spinTimeoutRef.current = setTimeout(() => {
        if (onSpinComplete) {
          onSpinComplete(displayDestinations[randomIndex])
        }
      }, 4000) // 4s spin matches CSS transition
    } else {
      setRotation(0)
    }

    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    }
  }, [isSpinning, displayDestinations, onSpinComplete])

  const segmentAngle = 360 / (displayDestinations.length || 1)

  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
    '#EC4899', '#14B8A6', '#EF4444', '#6366F1'
  ]

  const conicGradient = useMemo(() => {
    if (displayDestinations.length === 0) return ''
    const stops = displayDestinations.map((_, index) => {
      const start = (index / displayDestinations.length) * 100
      const end = ((index + 1) / displayDestinations.length) * 100
      return `${colors[index % colors.length]} ${start}% ${end}%`
    }).join(', ')
    return `conic-gradient(from 0deg, ${stops})`
  }, [displayDestinations])

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      {/* Pointer */}
      <motion.div
        className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-lg"
        animate={isSpinning ? { y: [-4, 0, -4] } : { y: 0 }}
        transition={{ duration: 0.15, repeat: isSpinning ? Infinity : 0 }}
      >
        <div className="w-10 h-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-700 shadow-lg" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-900 rounded-full mt-1"></div>
        </div>
      </motion.div>

      {/* Wheel Container */}
      <div className="relative w-full h-full p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-2xl border-4 border-white/40">
        <div
          className="w-full h-full rounded-full overflow-hidden relative shadow-inner"
          style={{
            background: conicGradient,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
          }}
        >
          {/* Dividers and Labels */}
          {displayDestinations.map((dest, index) => (
            <div key={dest.id || index} className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Divider */}
              <div
                className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/40 origin-bottom -translate-x-1/2"
                style={{ transform: `rotate(${index * segmentAngle}deg)` }}
              />

              {/* Label */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 flex flex-col items-center justify-start pt-6 origin-bottom"
                style={{ transform: `rotate(${index * segmentAngle + segmentAngle / 2}deg)` }}
              >
                <div className="transform" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  <span className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest drop-shadow-md whitespace-nowrap px-1 py-2">
                    {dest.name.length > 15 ? dest.name.substring(0, 12) + '..' : dest.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-[0_0_25px_rgba(0,0,0,0.2)] flex items-center justify-center z-20 border-4 border-gray-50">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Globe className={`w-8 h-8 text-white ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </div>

      {/* Decorative glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
    </div>
  )
}

export default RouletteWheel
