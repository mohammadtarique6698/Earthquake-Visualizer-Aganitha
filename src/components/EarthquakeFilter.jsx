import React from 'react';

const EarthquakeFilter = ({
  setMinMagnitude,
  setDateRange,
  searchLocation,
  setSearchLocation,
  handleSearch,
  mapView,
  setMapView,
}) => (
  <div className="flex flex-col lg:flex-row lg:gap-6 gap-4 justify-center items-center mb-4">
    <div className="flex justify-center items-center lg:mr-4">
      <label className="text-lg text-gray-600 mb-2 w-24">
        Minimum Magnitude:
      </label>
      <select
        className="p-2 border rounded-lg my-auto"
        onChange={(e) => setMinMagnitude(Number(e.target.value))}
      >
        <option value="0">All</option>
        <option value="2.5">2.5+</option>
        <option value="4.0">4.0+</option>
        <option value="5.0">5.0+</option>
      </select>
    </div>
    <div className="flex justify-center gap-3 items-center lg:mr-4">
      <label className="text-lg text-gray-600 mb-2 w-12">Date Range:</label>
      <select
        className="p-2 border rounded-lg my-auto"
        onChange={(e) => setDateRange(e.target.value)}
      >
        <option value="all_day">Past Day</option>
        <option value="all_week">Past Week</option>
        <option value="all_month">Past Month</option>
      </select>
    </div>
    <div className="flex justify-center gap-2 items-center lg:mr-4">
      <input
        type="text"
        className="p-2 border rounded-lg mb-2 lg:mb-0 lg:mr-2"
        placeholder="Search location..."
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="p-2 bg-blue-500 text-white rounded-lg"
      >
        Search
      </button>
    </div>
    <button
      onClick={() => setMapView(mapView === 'world' ? 'recent' : 'world')}
      className="p-2 bg-green-500 text-white rounded-lg"
    >
      {mapView === 'world' ? 'View Recent Earthquake' : 'View World Map'}
    </button>
  </div>
);

export default EarthquakeFilter;
