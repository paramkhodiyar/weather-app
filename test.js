async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  const weatherVideo = document.getElementById("weather-video");  // New: Get video element
  weatherDataSection.style.display = "none";
  const apiKey = "4e3bf060536c8163971d1d9eb5b3c641";

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
    return;
  }
  const backgroundVideos = [
    "Videos/day.mp4",
    "Videos/night.mp4",
    
  ];

  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }
    const data = await response.json();
    if (data.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>City Not Found: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
      } else {
        return data[0];
      }
    }
  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }
    const data = await response.json();
    const currentTime = new Date().getTime() / 1000;
    const isDay = currentTime > data.sys.sunrise && currentTime < data.sys.sunset;

    // Set video source based on day/night condition
    weatherVideo.src = isDay ? "Video/day.mp4" : "Videos/night.mp4";
    weatherVideo.play();  // Start video playback

    const backgroundImage = isDay ? "url(https://i.pinimg.com/originals/de/40/8c/de408c8c2e7f7c376cbc239ad2254189.png)" : "url(https://i.pinimg.com/originals/69/2f/35/692f3538fe4e900312f06bae72cef852.png)";
    document.body.style.backgroundImage = backgroundImage;
    weatherDataSection.style.display = "flex";

    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
      `;

    weatherDataSection.classList.add("show");  // Add "show" class for smooth transition
  }

  try {
    document.getElementById("search").value = "";
    const geocodeData = await getLonAndLat();
    if (geocodeData.lon && geocodeData.lat) {
      await getWeatherData(geocodeData.lon, geocodeData.lat);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
