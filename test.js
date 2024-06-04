async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "4e3bf060536c8163971d1d9eb5b3c641"; 
  
    if (searchInput == "") {
      weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    }
  
    async function getLonAndLat() {
      const countryCode = 1;
      const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;
      const response = await fetch(geocodeURL);
      if (!response.ok) {
        console.log("Bad response! ", response.status);
        return;
      }
      const data = await response.json();
      if (data.length == 0) {
        console.log("Something went wrong here.");
        weatherDataSection.innerHTML = ``; 
        weatherDataSection.classList.add('animated');
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const data = await response.json();
      const currentTime = new Date().getTime() / 1000;
      const isDay = currentTime > data.sys.sunrise && currentTime < data.sys.sunset;
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
}