const locationStatus = document.getElementById('locationStatus'); // No longer directly used for primary status
const locationData = document.getElementById('locationData');
const matchStatus = document.getElementById('matchStatus');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const proceedBtn = document.getElementById('proceedBtn');
const mapPlaceholder = document.getElementById('map-placeholder');

// Set the target location (latitude and longitude) for ACE Engineering College
const targetLatitude = 17.4367842;
const targetLongitude = 78.7160992; 
const accuracyThreshold = 0.02; // Adjust as needed for tolerance (in degrees)

function getLocation() {
    mapPlaceholder.className = 'loading'; // Set loading state for visual feedback
    locationData.style.display = 'none';
    matchStatus.style.display = 'none';
    tryAgainBtn.style.display = 'none';
    proceedBtn.style.display = 'none';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        mapPlaceholder.className = 'error';
        mapPlaceholder.textContent = 'Geolocation not supported.';
        tryAgainBtn.style.display = 'block';
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    locationData.textContent = `Latitude: ${latitude.toFixed(7)}, Longitude: ${longitude.toFixed(7)}, Accuracy: ${accuracy} meters`;
    locationData.style.display = 'block';

    const latDiff = Math.abs(latitude - targetLatitude);
    const lonDiff = Math.abs(longitude - targetLongitude);

    if (latDiff < accuracyThreshold && lonDiff < accuracyThreshold) {
        mapPlaceholder.className = 'success';
        matchStatus.textContent = 'Location Match Successful!';
        matchStatus.className = 'success';
        matchStatus.style.display = 'block';
        proceedBtn.style.display = 'block';
        tryAgainBtn.style.display = 'none';
    } else {
        mapPlaceholder.className = 'error';
        matchStatus.textContent = 'Location Mismatch. Please try again from the designated area.';
        matchStatus.className = 'error';
        matchStatus.style.display = 'block';
        tryAgainBtn.style.display = 'block';
        proceedBtn.style.display = 'none';
    }
}

function showError(error) {
    mapPlaceholder.className = 'error';
    mapPlaceholder.textContent = 'Error getting location: ' + error.message;
    tryAgainBtn.style.display = 'block';
    proceedBtn.style.display = 'none';
}

tryAgainBtn.addEventListener('click', getLocation);

// Redirect to the mark attendance page on successful location match
proceedBtn.addEventListener('click', function() {
    window.location.href = 'mark_attendance.html';
});

// Call getLocation when the page loads
getLocation();


