const EarthquakeDetails = ({ selectedEarthquake, closeDetails }) => (
  <div
    className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center"
    style={{ zIndex: 9999 }}
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4">Earthquake Details</h2>
      <p>
        <strong>Location:</strong> {selectedEarthquake.properties.place}
      </p>
      <p>
        <strong>Magnitude:</strong> {selectedEarthquake.properties.mag}
      </p>
      <p>
        <strong>Time:</strong>{' '}
        {new Date(selectedEarthquake.properties.time).toLocaleString()}
      </p>
      <button
        onClick={closeDetails}
        className="mt-4 p-2 bg-red-500 text-white rounded-lg w-full"
      >
        Close
      </button>
    </div>
  </div>
);

export default EarthquakeDetails;
