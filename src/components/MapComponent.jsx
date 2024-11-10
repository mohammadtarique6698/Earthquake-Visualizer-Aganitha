import { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const MapComponent = ({ earthquakes, mapView, handleMarkerClick }) => {
  const map = useMap();

  useEffect(() => {
    if (mapView === 'recent' && earthquakes.length > 0) {
      const recentEarthquake = earthquakes[0];
      map.setView(
        [
          recentEarthquake.geometry.coordinates[1],
          recentEarthquake.geometry.coordinates[0],
        ],
        5
      );
    } else {
      map.setView([20, 0], 2);
    }
  }, [mapView, earthquakes, map]);

  return (
    <>
      {earthquakes.map((earthquake) => {
        const magnitude = earthquake.properties.mag;
        let iconColor =
          magnitude >= 5 ? 'red' : magnitude >= 3 ? 'orange' : 'green';

        const icon = L.divIcon({
          className: 'custom-icon',
          html: `<div style="background-color:${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        return (
          <Marker
            key={earthquake.id}
            position={[
              earthquake.geometry.coordinates[1],
              earthquake.geometry.coordinates[0],
            ]}
            icon={icon}
            eventHandlers={{
              click: () => handleMarkerClick(earthquake),
            }}
          >
            <Popup>
              <h3>{earthquake.properties.place}</h3>
              <p>Magnitude: {magnitude}</p>
              <p>
                Time: {new Date(earthquake.properties.time).toLocaleString()}
              </p>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default MapComponent;
