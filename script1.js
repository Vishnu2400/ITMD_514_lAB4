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
    getSunriseSunsetData(latitude, longitude, "Your Location");
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

        const long = data[0].lon;
        const lati = data[0].lat;

        // Call getSunriseSunsetData with latitude, longitude, and location name
        getSunriseSunsetData(lati, long, locationInput);
      } catch (error) {
        alert(`Error fetching location data: ${error.message}`);
      }
    }

    fetchData(url);

    document.getElementById('locationInput').value='';
  }

  async function getSunriseSunsetData(latitude, longitude, locationName) {
    const sunriseApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0`;
    const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=tomorrow&formatted=0`;

    try {
      const response = await fetch(sunriseApiUrl);
      const data = await response.json();

      const response_tmrw = await fetch(tomorrowUrl);
      const data_tmrw = await response_tmrw.json();

      if (data.results && data_tmrw.results) {
        displayResults("Today", data.results, locationName);
        displayResults("Tomorrow", data_tmrw.results, locationName);
      } else {
        alert("Error fetching sunrise-sunset data");
      }
    } catch (error) {
      alert(`Error fetching sunrise-sunset data: ${error.message}`);
    }
  }

  function displayResults(day, data, locationName) {
    const resultDiv = document.getElementById("result");

    const resultString = `
      <div class="result-item">
        <p class="result-heading">${day} at (${locationName}):</p>
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