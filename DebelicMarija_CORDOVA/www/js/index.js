document.addEventListener('DOMContentLoaded', function() {
    const weatherAPIKey = '7c481ae0b1b8464eac3124813232803';
    const apiUrlBase = 'https://api.weatherapi.com/v1/current.json';
    let map, currentMarker; // Declare map and currentMarker for global access

    // Initialization function to get the current position or default to Sydney
    function initialize() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError, { timeout: 30000 });
        } else {
            // Default to Sydney if geolocation is not supported
            const sydney = { lat: -33.8688, lng: 151.2093 };
            handlePositionSuccess({ coords: sydney });
        }
    }

    // Initialize map and marker based on latitude and longitude
    function initializeMap(lat, lng) {
        const position = new google.maps.LatLng(lat, lng);
        const mapOptions = {
            zoom: 3,
            center: position
        };
        map = new google.maps.Map(document.getElementById('map-display'), mapOptions);
        currentMarker = new google.maps.Marker({
            position: position,
            map: map
        });
    }

    // Update marker location and center map on new coordinates
    function updateMarker(lat, lng) {
        const newPosition = new google.maps.LatLng(lat, lng);
        currentMarker.setPosition(newPosition);
        map.setCenter(newPosition);
    }

    // Success callback for geolocation
    function handlePositionSuccess(position) {
        const { latitude, longitude } = position.coords;
        initializeMap(latitude, longitude);
        updateLocationInfo(latitude, longitude);
    }

    // Error callback for geolocation
    function handlePositionError(error) {
        alert(`Error (${error.code}): ${error.message}`);
    }

    // Update temperature and time information based on latitude and longitude
    function updateLocationInfo(lat, lng) {
        updateTemperature(lat, lng);
        updateTime(lat, lng);
        updateData(lat, lng);
    }

    // Fetch and display the temperature
    function updateTemperature(lat, lng) {
        const tempUrl = `${apiUrlBase}?key=${weatherAPIKey}&q=${lat},${lng}&aqi=no`;
        fetch(tempUrl)
            .then(response => response.json())
            .then(data => {
                document.getElementById('temp').textContent = `${data.current.temp_c}° ${data.current.condition.text}`;
            });
    }

    // Fetch and display the time
    function updateTime(lat, lng) {
        fetch(`${apiUrlBase}?key=${weatherAPIKey}&q=${lat},${lng}`)
            .then(response => response.json())
            .then(data => {
                const observationTime = new Date(Date.parse(data.current.last_updated));
                document.getElementById('time').textContent = observationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            });
    }

    // Update displayed latitude and longitude
    function updateData(lat, lng) {
        document.getElementById('latitude').textContent = `Latitude: ${lat}`;
        document.getElementById('longitude').textContent = `Longitude: ${lng}`;
    }

    // Add click event listeners to city buttons
    function setupCityButtons() {
        document.getElementById('zagreb').addEventListener('click', () => changeCity(45.815399, 15.966568, 'Zagreb'));
        document.getElementById('rochester').addEventListener('click', () => changeCity(43.161030, -77.610922, 'Rochester'));
        document.getElementById('dubrovnik').addEventListener('click', () => changeCity(42.6507, 18.0944, 'Dubrovnik'));

    }

    // Change city based on button click, update map and info
    function changeCity(lat, lng, cityName) {
        updateMarker(lat, lng);
        updateLocationInfo(lat, lng);
        document.getElementById('city').textContent = cityName;
    }

    initialize();
    setupCityButtons();
});
