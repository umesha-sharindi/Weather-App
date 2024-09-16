const apiKey = '86c034d1fc2d41bbbae112558242608'; // Replace with your API key
const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}`;
const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=7`;
const historyUrl = `https://api.weatherapi.com/v1/history.json?key=${apiKey}`;

document.getElementById('get-weather').addEventListener('click', function() {
    const location = document.getElementById('location').value;
    if (location) {
        getWeather(location);
        getForecast(location);
        getAlerts(location);
        getHistoricalData(location, '2024-08-01'); // Example date
    } else {
        alert('Please enter a location.');
    }
});

function getWeather(location) {
    fetch(`${weatherUrl}&q=${location}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('weather-display').innerHTML = '<p>Weather data not available. Please try another location.</p>';
                return;
            }
            const { temp_c, humidity, wind_kph, condition } = data.current;
            const iconUrl = condition.icon;
            const weatherClass = condition.text.toLowerCase().includes('rain') ? 'rainy' : 
                                 condition.text.toLowerCase().includes('snow') ? 'snowy' : 'sunny';
            const weatherDisplay = `
                <div class="weather-card ${weatherClass}">
                    <h2>Current Weather in ${data.location.name}</h2>
                    <img src="${iconUrl}" alt="${condition.text}" class="weather-icon">
                    <p>Temperature: ${temp_c}°C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${wind_kph} kph</p>
                    <p>Condition: ${condition.text}</p>
                </div>
            `;
            document.getElementById('weather-display').innerHTML = weatherDisplay;
        })
        .catch(error => {
            console.log(error);
            document.getElementById('weather-display').innerHTML = '<p>Failed to fetch weather data.</p>';
        });
}

function getForecast(location) {
    fetch(`${forecastUrl}&q=${location}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('forecast-display').innerHTML = '<p>Forecast data not available. Please try another location.</p>';
                return;
            }
            const forecastDays = data.forecast.forecastday;
            let forecastDisplay = '';
            forecastDays.forEach(day => {
                const { date, day: { avgtemp_c, daily_chance_of_rain, condition } } = day;
                const iconUrl = condition.icon;
                forecastDisplay += `
                    <div class="forecast-card">
                        <h2>${date}</h2>
                        <img src="${iconUrl}" alt="${condition.text}" class="forecast-icon">
                        <p>Avg Temp: ${avgtemp_c}°C</p>
                        <p>Chance of Rain: ${daily_chance_of_rain}%</p>
                        <p>Condition: ${condition.text}</p>
                    </div>
                `;
            });
            document.getElementById('forecast-display').innerHTML = forecastDisplay;
        })
        .catch(error => {
            console.log(error);
            document.getElementById('forecast-display').innerHTML = '<p>Failed to fetch forecast data.</p>';
        });
}

function getAlerts(location) {
    // Placeholder implementation: WeatherAPI does not have a free weather alerts endpoint
    document.getElementById('alerts-display').innerHTML = '<p>No alerts available for the free plan.</p>';
}

function getHistoricalData(location, date) {
    fetch(`${historyUrl}&q=${location}&dt=${date}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('historical-display').innerHTML = '<p>Historical data not available. Please try another location.</p>';
                return;
            }
            const { avgtemp_c, condition } = data.forecast.forecastday[0].day;
            const historicalDisplay = `
                <div class="historical-card">
                    <h2>Historical Weather for ${date}</h2>
                    <p>Avg Temp: ${avgtemp_c}°C</p>
                    <p>Condition: ${condition.text}</p>
                </div>
            `;
            document.getElementById('historical-display').innerHTML = historicalDisplay;
        })
        .catch(error => {
            console.log(error);
            document.getElementById('historical-display').innerHTML = '<p>Failed to fetch historical data.</p>';
        });
}
