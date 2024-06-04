async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  let countryCode = document.getElementById("country").value;
  const weatherDataSection = document.getElementById("weather-data");
  const weatherVideo = document.getElementById("weather-video");
  const backgroundVideo = document.getElementById("backgroundVideo");
  const weatherInfo = document.getElementById("weather-info");
  const apiKey = "4e3bf060536c8163971d1d9eb5b3c641";

  if (searchInput === "") {
    weatherInfo.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    weatherDataSection.style.display = "block";
    return;
  }

  const backgroundVideos = {
    day: "Videos/day.mp4",
    night: "Videos/night.mp4"
  };

  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Error fetching geolocation data:", response.status);
      weatherInfo.innerHTML = `
        <div>
          <h2>Error!</h2>
          <p>An error occurred while fetching city data. Please try again later.</p>
        </div>
      `;
      weatherDataSection.style.display = "block";
      return;
    }
    const data = await response.json();
    if (data.length === 0) {
      weatherInfo.innerHTML = `
        <div>
          <h2>City Not Found: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      weatherDataSection.style.display = "block";
      return;
    }
    return data[0];
  }

  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.error("Error fetching weather data:", response.status);
      weatherInfo.innerHTML = `
        <div>
          <h2>Error!</h2>
          <p>An error occurred while fetching weather data. Please try again later.</p>
        </div>
      `;
      weatherDataSection.style.display = "block";
      return;
    }
    const data = await response.json();
    const currentTime = new Date().getTime() / 1000;
    const isDay = currentTime > data.sys.sunrise && currentTime < data.sys.sunset;

    // Set video source based on day/night condition
    backgroundVideo.src = isDay ? backgroundVideos.day : backgroundVideos.night;

    weatherInfo.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;

    weatherDataSection.style.display = "block";  // Ensure the weather data section is displayed
    weatherDataSection.classList.add("show");  // Add "show" class for smooth transition
  }

  try {
    const geocodeData = await getLonAndLat();
    if (geocodeData && geocodeData.lon && geocodeData.lat) {
      await getWeatherData(geocodeData.lon, geocodeData.lat);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
