import React, { useState } from 'react'

const FilterPanel = ({ onFilterChange, currentFilter, disabled }) => {
  const [filterType, setFilterType] = useState('global')
  const [selectedValue, setSelectedValue] = useState('')

  const continents = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']
  const countries = [
    'Nepal', 'Indonesia', 'Japan', 'Vietnam',
    'Portugal', 'Iceland', 'Croatia', 'Czech Republic',
    'Colombia', 'Canada', 'Peru', 'Mexico',
    'Morocco', 'South Africa', 'Tanzania',
    'New Zealand', 'Australia', 'Fiji'
  ]

  const handleFilterTypeChange = (type) => {
    setFilterType(type)
    setSelectedValue('')
    
    if (type === 'global') {
      onFilterChange({ type: 'global', value: '' })
    }
  }

  const handleValueChange = (value) => {
    setSelectedValue(value)
    onFilterChange({ type: filterType, value })
  }

  return (
    <div className="max-w-4xl mx-auto bg-meadow-light rounded-lg p-6 shadow-md">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Filter Type Selection */}
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => handleFilterTypeChange('global')}
            disabled={disabled}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterType === 'global'
                ? 'bg-forest-green text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            🌍 Global
          </button>
          <button
            onClick={() => handleFilterTypeChange('continent')}
            disabled={disabled}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterType === 'continent'
                ? 'bg-sky-blue text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            🗺️ Continent
          </button>
          <button
            onClick={() => handleFilterTypeChange('country')}
            disabled={disabled}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              filterType === 'country'
                ? 'bg-sunset-accent text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            🏳️ Country
          </button>
        </div>

        {/* Value Selection Dropdown */}
        {(filterType === 'continent' || filterType === 'country') && (
          <select
            value={selectedValue}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-forest-green focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              Select {filterType === 'continent' ? 'a continent' : 'a country'}
            </option>
            {(filterType === 'continent' ? continents : countries).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Active Filter Display */}
      {currentFilter.value && (
        <div className="mt-4 text-center">
          <span className="inline-block bg-white px-4 py-2 rounded-full text-sm font-semibold text-deep-ocean">
            Active Filter: {currentFilter.type === 'continent' ? '🗺️' : '🏳️'} {currentFilter.value}
          </span>
        </div>
      )}
    </div>
  )
}

export default FilterPanel
