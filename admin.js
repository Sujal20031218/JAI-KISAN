// Hover Function for Mobile
document.addEventListener('touchstart', function() {}, true);

// Variables for API & Location Heading
const apiKey = '10dc4a9025b811536cde5459c533e738';
const apiWeather = 'https://api.openweathermap.org/data/2.5/weather';
const apiOneCall = 'https://api.openweathermap.org/data/2.5/onecall';
let units = 'imperial';
const locationHeading = document.querySelector('#location');
const geolocationButton = document.querySelector('#geolocation-btn');

// User Location Preference
const userLocation = localStorage.getItem('location');
if (userLocation) {
    updateWeatherByName(userLocation);
} else {
    updateWeatherByName('New York');
}


// Call API by City Name
function updateWeatherByName(location) {
    axios
        .get(`${apiWeather}?q=${location}&appid=${apiKey}&units=${units}`)
        .then(displayCurrentTemperature, function() {
            alert(
                'There was a problem with your request! Try again or check back later.'
            );
        });
}

// Call API by Geolocation
geolocationButton.addEventListener('click', function() {
    navigator.geolocation.getCurrentPosition(getLocation);
});

function getLocation(position) {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    axios
        .get(`${apiWeather}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`)
        .then(displayCurrentTemperature);
}

// Call API by Search Functionality
function searchCity(event) {
    event.preventDefault();
    const searchInput = document.querySelector('#search-input').value;
    if (searchInput) {
        updateWeatherByName(searchInput);
        // Check for alerts in the next 5 days
        checkAlertsForCity(searchInput);
    }
}

const searchBtn = document.querySelector('.search-form');
searchBtn.addEventListener('submit', searchCity);

// Call API for Daily Forecast
function getForecast(coordinates) {
    axios
        .get(
            `${apiOneCall}?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`
        )
        .then(displayForecast);
}


// Change Temperature Type & Formula to Toggle Between C & F Values
const allTemps = document.querySelectorAll('#temp-now, .temps, .faded-temp');
const fahrenheit = document.querySelectorAll('.fahrenheit');
const celsius = document.querySelector('.celsius');
const windUnit = document.querySelector('#wind-unit');

function toggleTemp(event) {
    event.preventDefault();
    if (celsius.innerHTML === 'C') {
        celsius.innerHTML = 'F';
        fahrenheit.forEach(el => (el.innerHTML = 'C'));
        allTemps.forEach(
            el => (el.textContent = Math.round((el.innerHTML - 32) * (5 / 9)))
        );
        windUnit.innerHTML = `km/h`;
        units = 'metric';
    } else if (celsius.innerHTML === 'F') {
        celsius.innerHTML = 'C';
        fahrenheit.forEach(el => (el.innerHTML = 'F'));
        allTemps.forEach(
            el => (el.textContent = Math.round(el.innerHTML * (9 / 5) + 32))
        );
        windUnit.innerHTML = `mph`;
        units = 'imperial';
    }
    // Update Data to Reflect Celsius or Fahrenheit Change
    updateWeatherByName(locationHeading.textContent);
}

celsius.addEventListener('click', toggleTemp);

// Variables for Elements Representing Data
const currentTemp = document.querySelector('#temp-now');
const highTemp = document.querySelector('#high-temp');
const lowTemp = document.querySelector('#low-temp');
const feelsLikeTemp = document.querySelector('#feels-like');
const tempDescription = document.querySelector('#description-temp');
const wind = document.querySelector('#wind');
const humidity = document.querySelector('#humidity');
const visibility = document.querySelector('#visibility');
const clouds = document.querySelector('#clouds');
const sunrise = document.querySelector('#sunrise-time');
const sunset = document.querySelector('#sunset-time');
const scenery = document.querySelector('#scenery');
const conditionMsg = document.querySelector('#condition-msg');
const todaysDate = document.querySelector('#today');



// Display Temperature
function displayCurrentTemperature(response) {
    if (response.status == 200) {
        const data = response.data;

        // Sunset & Sunrise Times
        const apiSunrise = data.sys.sunrise * 1000;
        const apiSunset = data.sys.sunset * 1000;
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };



        // Get Local Date Object for Searched Cities
        function localDate(unix) {
            const date = new Date();
            const timestamp = unix;
            const offset = date.getTimezoneOffset() * 60000;
            const utc = timestamp + offset;
            const updatedDate = new Date(utc + 1000 * data.timezone);
            return updatedDate;
        }

        // Change Current Time/Date to Location
        const today = new Date();
        const localToday = today.getTime();
        const dateStatement = `${localDate(localToday).toLocaleDateString([], {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		})} at ${localDate(localToday).toLocaleString([], options)}`;
        todaysDate.innerHTML = `${dateStatement}`;

        // Change Landscape Image Based on Sunset / Sunrises


        // Update Weather Details
        locationHeading.innerHTML = `${data.name}, ${data.sys.country}`;
        currentTemp.innerHTML = `${Math.round(data.main.temp)}`;
        highTemp.innerHTML = `${Math.round(data.main.temp_max)}`;
        lowTemp.innerHTML = `${Math.round(data.main.temp_min)}`;
        feelsLikeTemp.innerHTML = `${Math.round(data.main.feels_like)}`;
        tempDescription.innerHTML = `${data.weather[0].description}`;
        wind.innerHTML = `${Math.round(data.wind.speed)}`;
        humidity.innerHTML = `${data.main.humidity}`;
        visibility.innerHTML = `${Math.round(data.visibility / 1000)}`;
        clouds.innerHTML = `${data.clouds.all}`;

        // Change Icon for Main Overview
        axios.get('icons.json').then(icon => {
            for (let i = 0; i < icon.data.length; i++) {
                if (
                    data.weather[0].icon === icon.data[i].icon &&
                    data.weather[0].id === icon.data[i].id
                ) {
                    const mainWeatherIcon = document.querySelector('.default-main-icon');
                    mainWeatherIcon.setAttribute('src', icon.data[i].src);
                    mainWeatherIcon.setAttribute('alt', icon.data[i].alt);
                }
            }
        });




        // Weather Condition Message Indicator
        const weatherType = data.weather[0].main;
        if (
            weatherType === 'Rain' ||
            weatherType === 'Drizzle' ||
            weatherType === 'Clouds'
        ) {
            conditionMsg.innerHTML = `<i class="fa-solid fa-umbrella"></i> Umbrella Required`;
        } else if (weatherType === 'Thunderstorm' || weatherType === 'Tornado') {
            conditionMsg.innerHTML = `<i class="fa-solid fa-cloud-bolt"></i> Stay Indoors`;
        } else if (weatherType === 'Snow') {
            conditionMsg.innerHTML = `<i class="fa-solid fa-snowflake"></i> Dress Warm`;
        } else if (weatherType === 'Clear') {
            conditionMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Ideal Conditions`;
        } else if (
            weatherType === 'Mist' ||
            weatherType === 'Fog' ||
            weatherType === 'Haze'
        ) {
            conditionMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Poor Visibility`;
        } else {
            conditionMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Poor Air Quality`;
        }
        if (
            weatherType === 'Rain' ||
            weatherType === 'Drizzle' ||
            weatherType === 'Clouds'
        ) {
            showAlert('Umbrella Required', 'Severe');
        } else if (weatherType === 'Thunderstorm' || weatherType === 'Tornado') {
            showAlert('Stay Indoors', 'Severe');
        } else if (weatherType === 'Snow') {
            showAlert('Dress Warm', 'Moderate');
        } else if (weatherType === 'Clear') {
            showAlert('Ideal Conditions', 'Low');
        } else if (
            weatherType === 'Mist' ||
            weatherType === 'Fog' ||
            weatherType === 'Haze'
        ) {
            showAlert('Poor Visibility', 'Moderate');
        } else {
            showAlert('Poor Air Quality', 'Severe');
        }
        // Call Daily Forecast Function Based on Current Location Data
        getForecast(response.data.coord);

        // Local Storage
        localStorage.setItem('location', `${data.name}`);
    }
}

function showAlert(message, alertType) {
    let alertSeverity = '';
    switch (alertType) {
        case 'Severe':
            alertSeverity = 'Severe Alert:';
            break;
        case 'Moderate':
            alertSeverity = 'Moderate Alert:';
            break;
        case 'Low':
            alertSeverity = 'Low Alert:';
            break;
        default:
            alertSeverity = 'Alert:';
    }

    // Display an alert to the user
    alert(`${alertSeverity} ${message}`);
}




// Function to create and display the temperature chart
function createTemperatureChart(labels, temperatures) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');

    const temperatureChart = new Chart(ctx, {
        type: 'line', // Line chart
        data: {
            labels: labels, // Array of day labels
            datasets: [{
                label: 'Max Temperature (°F)', // Label for the dataset
                data: temperatures, // Array of maximum temperatures
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color of the chart area
                borderColor: 'rgba(75, 192, 192, 1)', // Border color of the chart line
                borderWidth: 2, // Border width
                pointRadius: 5, // Point radius
                pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
            }, ],
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Day', // X-axis label
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature (°F)', // Y-axis label
                    },
                },
            },
        },
    });
}

// Call the function to create and display the temperature chart
// ... (existing code)

// Display Daily Forecast Data
function displayForecast(response) {
    const forecastData = response.data.daily;
    const today = new Date();
    const forecastContainer = document.querySelector('.full-forecast');
    let forecastHTML = '';

    forecastData.forEach(function(day, index) {
        const forecastDate = new Date(day.dt * 1000);
        const daysUntilForecast = Math.floor((forecastDate - today) / (24 * 60 * 60 * 1000));

        if (index < 7) {
            const weatherType = day.weather[0].main;

            if (daysUntilForecast === 0) {
                // For today, use the current conditions
                showAlertForDay(weatherType, 'Today');
            } else {
                showAlertForDay(weatherType, `In ${daysUntilForecast} days`);
            }

            forecastHTML += `<div class="daily m-2 m-md-0">
                                <p>${formatDay(day.dt)}</p>
                                <img
                                    src="/assets/loading.svg"
                                    class="weather-icon forecast-icon mb-2"
                                    height="45"
                                    width="50"
                                    alt="Loading icon"
                                />
                                <p>
                                    <span class="temps">${Math.round(day.temp.max)}</span>°
                                    <span class="fahrenheit">${units === 'metric' ? 'C' : 'F'}</span><br />
                                    <span class="daily-low">
                                        <span class="forecast-low temps">${Math.round(day.temp.min)}</span>°
                                        <span class="fahrenheit">${units === 'metric' ? 'C' : 'F'}</span>
                                    </span>
                                </p>
                            </div>`;

            // Icon Matching for Each Daily Forecast
            axios.get('icons.json').then(icon => {
                for (let i = 0; i < icon.data.length; i++) {
                    if (
                        day.weather[0].id === icon.data[i].id &&
                        day.weather[0].icon === icon.data[i].icon
                    ) {
                        forecastHTML = forecastHTML.replace(
                            'src="/assets/loading.svg"',
                            `src="${icon.data[i].src}"`
                        );
                        forecastHTML = forecastHTML.replace(
                            'alt="Loading icon"',
                            `alt="${icon.data[i].alt}"`
                        );
                    }
                }
                forecastContainer.innerHTML = forecastHTML;
            });
        }
    });

    const dayLabels = forecastData.map((day) => formatDay(day.dt));
    const maxTemperatures = forecastData.map((day) =>
        Math.round(day.temp.max)
    );

    // Create the temperature chart
    createTemperatureChart(dayLabels, maxTemperatures);
}

function showAlertForDay(weatherType, day) {
    if (
        weatherType === 'Rain' ||
        weatherType === 'Drizzle' ||
        weatherType === 'Clouds'
    ) {
     //   showAlert(`Umbrella Required ${day}`, 'Severe');
    } else if (weatherType === 'Thunderstorm' || weatherType === 'Tornado') {
     //   showAlert(`Stay Indoors ${day}`, 'Severe');
    } else if (weatherType === 'Snow') {
     //   showAlert(`Dress Warm ${day}`, 'Moderate');
    } else if (weatherType === 'Clear') {
     //   showAlert(`Ideal Conditions ${day}`, 'Low');
    } else if (
        weatherType === 'Mist' ||
        weatherType === 'Fog' ||
        weatherType === 'Haze'
    ) {
     //   showAlert(`Poor Visibility ${day}`, 'Moderate');
    } else {
      //  showAlert(`Poor Air Quality ${day}`, 'Severe');
    }
}



// Format Daily Forecast Unix Timestamps
function formatDay(unix) {
    const date = new Date(unix * 1000);
    const day = date.getDay();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[day];
}

// Display Temperatures for Global Forecast (Default)
const cityTemps = document.querySelectorAll('.global-temps');
const cityWeatherDesc = document.querySelectorAll('.global-descriptions');
const cityNames = document.querySelectorAll('.global-name');
const countryNames = document.querySelectorAll('.country-name');
const cities = [
    'Seattle',
    'Rabat',
    'London',
    'Mumbai',
    'Delhi',
    'Jakarta',
    'Agra',
    'Shanghai',
    'Tokyo',
    'Cairo',
    'Dhaka',
    'New York',
    'Istanbul',
    'Los Angeles',
    'Munich',
    'Dubai',
];

// Shuffle Array for Randomized Cities
cities.sort(() => Math.random() - 0.5);

// Default Information for Global Forecast Section
function displayGlobalTemperature() {
    for (let i = 0; i < 5; i++) {
        axios
            .get(`${apiWeather}?q=${cities[i]}&appid=${apiKey}&units=${units}`)
            .then(response => {
                const data = response.data;
                cityNames[i].innerHTML = `${data.name}`;
                countryNames[i].innerHTML = `${data.sys.country}`;
                cityTemps[i].innerHTML = Math.round(data.main.temp);
                cityWeatherDesc[i].innerHTML = `${data.weather[0].description}`;
                axios.get('icons.json').then(icon => {
                    for (let k = 0; k < icon.data.length; k++) {
                        if (
                            data.weather[0].id === icon.data[k].id &&
                            data.weather[0].icon === icon.data[k].icon
                        ) {
                            let globalWeatherIcon = document.querySelectorAll('.global-icon');
                            globalWeatherIcon[i].setAttribute('src', icon.data[k].src);
                            globalWeatherIcon[i].setAttribute('alt', icon.data[k].alt);
                        }
                    }
                });
            });
    }
}


// Click on "Other Cities" To Display Weather For That Region
let globalContainers = document.querySelectorAll('.global-item');
for (let i = 0; i < 5; i++) {
    globalContainers[i].addEventListener('click', () => {
        updateWeatherByName(cities[i]);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
}
// Default Location to Show
displayGlobalTemperature();


//-------------------hrly temp----------------
// Function to fetch hourly weather data from an API
async function fetchHourlyWeather2(city) {
    const apiKey3 = '56d15dcd0d80fb25cf836cbc90feb200'; // Replace with your API key
    const units = 'metric'; // Use 'imperial' for Fahrenheit
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey3}`);
        const data = await response.json();
        if (data.list) {
            return data.list;
        } else {
            throw new Error('Hourly data not available');
        }
    } catch (error) {
        console.error('Error fetching hourly weather data:', error);
        return [];
    }
}

// Function to display hourly forecast with time and date
async function displayHourlyForecast(city) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = ''; // Clear previous data
    const hourlyWeatherData = await fetchHourlyWeather2(city);
    hourlyWeatherData.forEach(item => {
        const time = new Date(item.dt * 1000); // Convert timestamp to Date object
        const temperature = item.main.temp;

        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('hourly-item');
        hourlyItem.innerHTML = `
            <div class="hourly-time">${time.toLocaleTimeString()}</div>
            <div class="hourly-date">${time.toLocaleDateString()}</div>
            <div class="hourly-temperature">${temperature}°C</div>
        `;
        hourlyForecast.appendChild(hourlyItem);
    });
}


//display searched city hrly weather
searchBtn.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.querySelector('#search-input').value;
    if (searchInput) {
        // Call the hourly weather function for the searched city
        displayHourlyForecast(searchInput);
    }
});

// Example: Display hourly forecast for the default city (e.g., New York)
displayHourlyForecast('New York'); // Call this in your initialization code

/*----------hrly weather chart---------*/
// Function to fetch hourly weather data and display a chart
async function displayHourlyWeatherChart(city) {
    const hourlyWeatherData = await fetchHourlyWeather2(city);

    if (hourlyWeatherData.length === 0) {
        // Handle error or display a message
        console.log('No hourly data available for this city.');
        return;
    }

    const timestamps = hourlyWeatherData.map(item => new Date(item.dt * 1000));
    const temperatures = hourlyWeatherData.map(item => item.main.temp);

    const chartData = {
        labels: timestamps,
        datasets: [{
            label: 'Hourly Temperature (°C)',
            data: temperatures,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
        }, ],
    };

    // Clear the previous chart if it exists
    if (hourlyWeatherChartInstance) {
        hourlyWeatherChartInstance.destroy();
    }

    // Create a new hourly weather chart
    hourlyWeatherChartInstance = new Chart(hourlyForecastChart, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                    },
                },
                y: {
                    beginAtZero: false,
                },
            },
        },
    });
}

const searchBtn2 = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const hourlyForecastChart = document.getElementById('hourly-forecast-chart').getContext('2d');
let hourlyWeatherChartInstance = null;

searchBtn2.addEventListener('click', function() {
    const city = searchInput.value;
    if (city) {
        displayHourlyWeatherChart(city);
    }
});

// Example: Display hourly forecast for the default city (e.g., New York)
displayHourlyWeatherChart('New York'); // Call this in your initialization code











