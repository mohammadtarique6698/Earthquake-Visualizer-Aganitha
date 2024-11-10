import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import EarthquakeFilter from './components/EarthquakeFilter';
import EarthquakeDetails from './components/EarthquakeDetails';
import MapComponent from './components/MapComponent'; // Corrected Map Component Import

const App = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minMagnitude, setMinMagnitude] = useState(0);
  const [dateRange, setDateRange] = useState('all_day');
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);
  const [mapView, setMapView] = useState('world');

  useEffect(() => {
    const fetchEarthquakes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${dateRange}.geojson`
        );
        setEarthquakes(response.data.features);
        setFilteredEarthquakes(response.data.features);
      } catch (error) {
        console.error('Error fetching earthquake data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarthquakes();
  }, [dateRange]);

  useEffect(() => {
    setFilteredEarthquakes(
      earthquakes.filter((eq) => eq.properties.mag >= minMagnitude)
    );
  }, [minMagnitude, earthquakes]);

  const handleSearch = async () => {
    if (searchLocation) {
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchLocation}&format=json`
      );
      const location = geocodeResponse.data[0];
      if (location) {
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);
        setFilteredEarthquakes(
          earthquakes.filter(
            (eq) =>
              Math.abs(eq.geometry.coordinates[1] - lat) < 5 &&
              Math.abs(eq.geometry.coordinates[0] - lon) < 5
          )
        );
      }
    }
  };

  const handleMarkerClick = (earthquake) => setSelectedEarthquake(earthquake);
  const closeDetails = () => setSelectedEarthquake(null);

  return (
    <div className="App flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Earthquake Visualizer
      </h1>
      <EarthquakeFilter
        setMinMagnitude={setMinMagnitude}
        setDateRange={setDateRange}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        handleSearch={handleSearch}
        mapView={mapView}
        setMapView={setMapView}
      />
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-gray-600 text-lg ml-4">
            Loading earthquake data...
          </div>
        </div>
      ) : (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          className="h-[75vh] w-full rounded-lg shadow-lg border border-gray-300"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MapComponent
            earthquakes={filteredEarthquakes}
            mapView={mapView}
            handleMarkerClick={handleMarkerClick}
          />
        </MapContainer>
      )}
      {selectedEarthquake && (
        <EarthquakeDetails
          selectedEarthquake={selectedEarthquake}
          closeDetails={closeDetails}
        />
      )}
    </div>
  );
};

export default App;

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import axios from 'axios';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const App = () => {
//   const [earthquakes, setEarthquakes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [minMagnitude, setMinMagnitude] = useState(0);
//   const [dateRange, setDateRange] = useState('all_day');
//   const [selectedEarthquake, setSelectedEarthquake] = useState(null);
//   const [searchLocation, setSearchLocation] = useState('');
//   const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);
//   const [mapView, setMapView] = useState('world');

//   useEffect(() => {
//     const fetchEarthquakes = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${dateRange}.geojson`
//         );
//         setEarthquakes(response.data.features);
//         setFilteredEarthquakes(response.data.features);
//       } catch (error) {
//         console.error('Error fetching earthquake data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEarthquakes();
//   }, [dateRange]);

//   useEffect(() => {
//     setFilteredEarthquakes(
//       earthquakes.filter((eq) => eq.properties.mag >= minMagnitude)
//     );
//   }, [minMagnitude, earthquakes]);

//   const handleSearch = async () => {
//     if (searchLocation) {
//       const geocodeResponse = await axios.get(
//         `https://nominatim.openstreetmap.org/search?q=${searchLocation}&format=json`
//       );
//       const location = geocodeResponse.data[0];
//       if (location) {
//         const lat = parseFloat(location.lat);
//         const lon = parseFloat(location.lon);
//         setFilteredEarthquakes(
//           earthquakes.filter(
//             (eq) =>
//               Math.abs(eq.geometry.coordinates[1] - lat) < 5 &&
//               Math.abs(eq.geometry.coordinates[0] - lon) < 5
//           )
//         );
//       }
//     }
//   };

//   const handleMarkerClick = (earthquake) => {
//     setSelectedEarthquake(earthquake);
//   };

//   const MapComponent = ({ earthquakes }) => {
//     const map = useMap();

//     useEffect(() => {
//       if (mapView === 'recent' && earthquakes.length > 0) {
//         const recentEarthquake = earthquakes[0];
//         map.setView(
//           [
//             recentEarthquake.geometry.coordinates[1],
//             recentEarthquake.geometry.coordinates[0],
//           ],
//           5
//         );
//       } else {
//         map.setView([20, 0], 2);
//       }
//     }, [mapView, earthquakes, map]);

//     return (
//       <>
//         {earthquakes.map((earthquake) => {
//           const magnitude = earthquake.properties.mag;
//           let iconColor = 'green';

//           if (magnitude >= 5) {
//             iconColor = 'red';
//           } else if (magnitude >= 3) {
//             iconColor = 'orange';
//           }

//           const icon = L.divIcon({
//             className: 'custom-icon',
//             html: `<div style="background-color:${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff;"></div>`,
//             iconSize: [20, 20],
//             iconAnchor: [10, 10],
//           });

//           return (
//             <Marker
//               key={earthquake.id}
//               position={[
//                 earthquake.geometry.coordinates[1],
//                 earthquake.geometry.coordinates[0],
//               ]}
//               icon={icon}
//               eventHandlers={{
//                 click: () => handleMarkerClick(earthquake),
//               }}
//             >
//               <Popup>
//                 <h3>{earthquake.properties.place}</h3>
//                 <p>Magnitude: {magnitude}</p>
//                 <p>
//                   Time: {new Date(earthquake.properties.time).toLocaleString()}
//                 </p>
//               </Popup>
//             </Marker>
//           );
//         })}
//       </>
//     );
//   };

//   return (
//     <div className="App flex flex-col items-center p-4 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">
//         Earthquake Visualizer
//       </h1>

//       <div className="flex flex-col lg:flex-row lg:gap-6 gap-4 justify-center items-center mb-4">
//         <div className="flex justify-center items-center lg:items-start lg:mr-4">
//           <label className="text-lg text-gray-600 mb-2 w-24">
//             Minimum Magnitude:
//           </label>
//           <select
//             className="p-2 border rounded-lg my-auto"
//             onChange={(e) => setMinMagnitude(Number(e.target.value))}
//           >
//             <option value="0">All</option>
//             <option value="2.5">2.5+</option>
//             <option value="4.0">4.0+</option>
//             <option value="5.0">5.0+</option>
//           </select>
//         </div>

//         <div className="flex justify-center gap-3 items-center lg:items-start lg:mr-4">
//           <label className="text-lg text-gray-600 mb-2 w-12">Date Range:</label>
//           <select
//             className="p-2 border rounded-lg my-auto"
//             onChange={(e) => setDateRange(e.target.value)}
//           >
//             <option value="all_day">Past Day</option>
//             <option value="all_week">Past Week</option>
//             <option value="all_month">Past Month</option>
//           </select>
//         </div>

//         <div className="flex justify-center gap-2 items-center lg:flex-row lg:items-center lg:mr-4">
//           <input
//             type="text"
//             className="p-2 border rounded-lg mb-2 lg:mb-0 lg:mr-2"
//             placeholder="Search location..."
//             value={searchLocation}
//             onChange={(e) => setSearchLocation(e.target.value)}
//           />
//           <button
//             onClick={handleSearch}
//             className="p-2 bg-blue-500 text-white rounded-lg"
//           >
//             Search
//           </button>
//         </div>

//         <button
//           onClick={() => setMapView(mapView === 'world' ? 'recent' : 'world')}
//           className="p-2 bg-green-500 text-white rounded-lg"
//         >
//           {mapView === 'world' ? 'View Recent Earthquake' : 'View World Map'}
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center mt-10">
//           <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
//           <div className="text-gray-600 text-lg ml-4">
//             Loading earthquake data...
//           </div>
//         </div>
//       ) : (
//         <MapContainer
//           center={[20, 0]}
//           zoom={2}
//           scrollWheelZoom={true}
//           className={`h-[75vh] w-full rounded-lg shadow-lg border border-gray-300 ${
//             selectedEarthquake ? 'opacity-50' : ''
//           }`}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <MapComponent earthquakes={filteredEarthquakes} />
//         </MapContainer>
//       )}

//       {selectedEarthquake && (
//         <div
//           className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-60 overflow-hidden"
//           style={{ zIndex: 9999 }}
//         >
//           <div className="bg-white p-6 rounded-lg shadow-lg w-80">
//             <h2 className="text-xl font-bold mb-4">Earthquake Details</h2>
//             <p>
//               <strong>Location:</strong> {selectedEarthquake.properties.place}
//             </p>
//             <p>
//               <strong>Magnitude:</strong> {selectedEarthquake.properties.mag}
//             </p>
//             <p>
//               <strong>Time:</strong>{' '}
//               {new Date(selectedEarthquake.properties.time).toLocaleString()}
//             </p>
//             <button
//               onClick={() => setSelectedEarthquake(null)}
//               className="mt-4 p-2 bg-red-500 text-white rounded-lg w-full"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
