function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; 
  getSunriseSunsetData(latitude, longitude);
}

function showError(error) {
  alert(`Error getting geolocation: ${error.message}`);
}

function searchLocation() {
  const locationInput = document.getElementById("locationInput").value;

  if (locationInput.trim() === "") {
    alert("Please enter a location");
    return;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; // Clear previous results

  const url = `https://geocode.maps.co/search?q=${encodeURIComponent(locationInput)}`;

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(data[0].lon, data[0].lat);

      const long = data[0].lon;
      const lati = data[0].lat;

      // Call getSunriseSunsetData with latitude and longitude
      getSunriseSunsetData(lati, long);
    } catch (error) {
      console.error(`Error fetching location data: ${error.message}`);
    }
  }

  fetchData(url);

  document.getElementById('locationInput').value='';

}

async function getSunriseSunsetData(latitude, longitude) {
 
  const sunriseApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0`;
  const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=tomorrow&formatted=0`;

  try {
    const response = await fetch(sunriseApiUrl);
    const data = await response.json();

    const response_tmrw = await fetch(tomorrowUrl);
    const data_tmrw = await response_tmrw.json();

    if (data.results && data_tmrw.results) {
      displayResults("Today", data.results);
      displayResults("Tomorrow", data_tmrw.results);
    } else {
      console.error("Error fetching sunrise-sunset data");
    }
  } catch (error) {
    console.error(`Error fetching sunrise-sunset data: ${error.message}`);
  }
}

function displayResults(day, data) {
  const resultDiv = document.getElementById("result");

  const resultString = `
    <div class="result-item">
      <p class="result-heading">${day}:</p>
      <ul>
        <li>Sunrise: ${data.sunrise}</li>
        <li>Sunset: ${data.sunset}</li>
        <li>First Light: ${data.first_light}</li>
        <li>Last Light: ${data.last_light}</li>

        <li>Dawn: ${data.dawn}</li>
        <li>Dusk: ${data.dusk}</li>
        <li>Solar Noon: ${data.solar_noon}</li>
        <li>Day Length: ${data.day_length}</li>
        <li>Timezone: ${data.timezone}</li>
      </ul>
    </div>
  `;

  resultDiv.insertAdjacentHTML("beforeend", resultString);
}


function secondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}:${minutes}:${secs}`;
}
