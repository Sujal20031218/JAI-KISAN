let weather = {
  apiKey: "df678d90c9e720208b26ab7e4291a282",
  fetchWeather: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.fetchForecast(city); 
      });
  },
  fetchForecast: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("No forecast found.");
        }
        return response.json();
      })
      .then((data) => this.displayForecast(data, city)); // Pass city as an argument
  },
  
  displayWeather: function (data) {
    const weatherContainer = document.querySelector(".weather");
    weatherContainer.classList.remove("loading");

    const city = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const clouds = data.clouds.all; // Cloudiness in percentage
    const rainfall = data.rain && data.rain["1h"] ? data.rain["1h"] : 0; // Rainfall in the last hour

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    // Update the weather information in the HTML
    document.querySelector(".city").textContent = `Weather in ${city}`;
    document.querySelector(".temp").textContent = `${temperature}°C`;
    document.querySelector(".icon").src = icon;
    document.querySelector(".description").textContent = description;
    document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
    document.querySelector(".wind").textContent = `Wind speed: ${windSpeed} km/h`;

    // Access the alert symbol element
    // Calculate the alert level based on weather conditions
    const alertLevel = this.calculateAlertLevel(data);

    // Update the alert level text
    const alertLevelText = document.querySelector(".alert-level-text");
    alertLevelText.textContent = alertLevel;

    // Access the alert symbol elements
    const alertSymbolHigh = document.querySelector(".alert-symbol-high");
    const alertSymbolModerate = document.querySelector(".alert-symbol-moderate");

    // Hide both alert symbols initially
    alertSymbolHigh.style.display = "none";
    alertSymbolModerate.style.display = "none";

    // Check the alert level and show the appropriate alert symbol and image
    if (alertLevel === "high") {
      alertSymbolHigh.style.display = "block";
      // Set the image source for high alert
      const alertImg = alertSymbolHigh.querySelector(".alert-img");
      alertImg.src = "redalert.png"; // Replace with the actual image path
      // Change the color of the high alert symbol to red
      alertSymbolHigh.style.color = "red";
      alert("High alert! Take immediate precautions.");
    } else if (alertLevel === "moderate") {
      alertSymbolModerate.style.display = "block";
      // Change the color of the moderate alert symbol to yellow
      alertSymbolModerate.style.color = "yellow";
      alert("Moderate alert! Be cautious.");
    } else {
      // Hide both alert symbols when conditions are not met
      alertSymbolHigh.style.display = "none";
      alertSymbolModerate.style.display = "none";
    }

},


  calculateAlertLevel: function (data) {
    const windSpeed = data.wind.speed;
    const clouds = data.clouds.all;
    const rainfall = data.rain && data.rain["1h"] ? data.rain["1h"] : 0;
    let description = '';
  
    // Define alert level criteria
    const highAlertCriteria = {
      windSpeed: 30,
      clouds: 70,
      rainfall: 10,
    };
  
    const moderateAlertCriteria = {
      windSpeed: 20,
      clouds: 50,
      rainfall: 5,
    };
  
    // Calculate the alert level based on criteria
    if (
      windSpeed >= highAlertCriteria.windSpeed ||
      clouds >= highAlertCriteria.clouds ||
      rainfall >= highAlertCriteria.rainfall
    ) {
      description = "high";
    } else if (
      windSpeed >= moderateAlertCriteria.windSpeed ||
      clouds >= moderateAlertCriteria.clouds ||
      rainfall >= moderateAlertCriteria.rainfall
    ) {
      description = "moderate";
    } else {
      description = "low";
    }
    this.updateBackground(description);
    return description;
  },
  
  updateBackground: function (weatherDescription) {
    let backgroundImageUrl = "";

    switch (weatherDescription.toLowerCase()) {
      case "clear sky":
        backgroundImageUrl = "url('https://media.tenor.com/PeDk7wvETuMAAAAC/sky-heaven.gif')"; // Change to the rainy background image
        break;
      case "few clouds":
        backgroundImageUrl = "url('https://i.gifer.com/embedded/download/XFbw.gif')"; // Change to the sunny background image
        break;
      case "overcast clouds":
        backgroundImageUrl = "url('https://www.adventurebikerider.com/wp-content/uploads/2017/10/tumblr_o27c7fByaO1tchrkco1_500.gif')"; // Change to the sunny background image
        break;
      case "scattered clouds":
        backgroundImageUrl = "url('landingpage/scattered.gif')"; // Change to the rainy background image
        break;
      case "broken clouds":
        backgroundImageUrl = "url('https://i.gifer.com/1F1O.gif')"; // Change to the rainy background image
        break;
      case "shower rain":
        backgroundImageUrl = "url('landingpage/shower.gif')"; // Change to the rainy background image
        break;
      case "rain":
        backgroundImageUrl = "url('https://media.tenor.com/QX2oKBhG_sYAAAAC/sad-aesthetic.gif')"; // Change to the rainy background image
        break;
      case "Thunderstorm":
        backgroundImageUrl = "url('https://media.tenor.com/TUN36wlxyhMAAAAC/aesthetic-raining.gif')"; // Change to the rainy background image
        break;
      case "snow":
        backgroundImageUrl = "url('landingpage/snow.gif')"; // Change to the snowy background image
        break;
      case "mist":
        backgroundImageUrl = "url('landingpage/mist.gif')"; // Change to the foggy background image
        break;
      case "fog":
        backgroundImageUrl = "url('landingpage/fog.gif')"; // Change to the foggy background image
        break;
      case "haze":
        backgroundImageUrl = "url('landingpage/haze.jpg')"; // Change to the foggy background image
        break;
      default:
        backgroundImageUrl = "url('landingpage/mist.gif')"; // Change to a default background image
    }

    document.body.style.backgroundImage = backgroundImageUrl;
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
  
  displayForecast: function (data, city) {
    const forecastContainer = document.querySelector(".forecast-scroll");
    forecastContainer.innerHTML = "";
  
    const forecastData = data.list; // Get all forecast items
  
    // Initialize variables to keep track of dates
    let currentDate = null;
    let daysDisplayed = 0;
  
    forecastData.forEach((forecast) => {
      const { dt, main, weather } = forecast;
      const forecastDate = new Date(dt * 1000);
      const dayOfWeek = forecastDate.toLocaleDateString("en-US", { weekday: "short" });
      const date = forecastDate.getDate();
  
      const temperature = main.temp;
      const icon = weather[0].icon;
  
      // Check if the date has changed and we haven't displayed 15 days yet
      if (date !== currentDate && daysDisplayed < 15) {
        currentDate = date;
        daysDisplayed++;
  
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
          <div class="forecast-date">${date}</div>
          <div class="forecast-day">${dayOfWeek}</div>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Forecast" class="forecast-icon" />
          <div class="forecast-temp">${temperature}°C</div>
        `;
  
        forecastContainer.appendChild(forecastItem);
      }
    });

    // Iterate over the days and display the forecast
    for (const day in days) {
      const { date, temp, icon, humidity, windSpeed } = days[day];
      const avgTemp = (temp.reduce((acc, val) => acc + val, 0) / temp.length).toFixed(1);
      const avgIcon = icon[Math.floor(icon.length / 2)];

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <div class="forecast-day">${date}</div>
        <img src="https://openweathermap.org/img/wn/${avgIcon}.png" alt="Forecast" class="forecast-icon" />
        <div class="forecast-temp">${avgTemp}°C</div>
      `;

      // Add event listeners to show details when hovering or clicking
      forecastItem.addEventListener("mouseover", function () {
        const details = document.querySelector(".details");
        const dayData = days[day];
        const avgHumidity = (dayData.humidity.reduce((acc, val) => acc + val, 0) / dayData.humidity.length).toFixed(0);
        const avgWindSpeed = (dayData.windSpeed.reduce((acc, val) => acc + val, 0) / dayData.windSpeed.length).toFixed(1);
        details.innerHTML = `
          <div class="humidity">Humidity: ${avgHumidity}%</div>
          <div class="wind">Wind speed: ${avgWindSpeed} km/h</div>
        `;
      });

      forecastContainer.appendChild(forecastItem);
    }
  },
};

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });

  geocode.getLocation(); // Include your existing code for geolocation here.
  // Include any other functions or code you have here.
});

document.getElementById("searchButton").addEventListener("click", function () {
  // Get the value from the search bar input
  const searchInput = document.querySelector(".search-bar").value;

  // Check if the search input is not empty
  if (searchInput.trim() !== "") {
    // Call the weather search function with the city name
    weather.fetchWeather(searchInput);
  } else {
    // Handle the case when the search input is empty or contains only spaces
    alert("Please enter a city name.");
  }
});