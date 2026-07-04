const apiKey = "51ef9de8facc4b918a3180459260207"; 

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const temp = document.getElementById('temp');
const desc = document.getElementById('desc');
const weatherIcon = document.getElementById('weather-icon');
const forecastBox = document.getElementById('forecast-box');
const detailsBox = document.getElementById('details-box');
const body = document.getElementById('bg-body');

// Extra metrics DOM targets
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

async function checkWeather(query) {
    if (!query) return;
    
    // query ya toh string (city name) ho sakti hai ya coordinates (lat,lon)
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3&aqi=no`;
    
    try {
        cityName.textContent = "Loading...";
        temp.textContent = "-- °C";
        desc.textContent = "--";
        weatherIcon.style.display = "none";
        forecastBox.style.display = "none";
        detailsBox.style.display = "none";

        const response = await fetch(url);
        if (!response.ok) throw new Error('Location nahi mili!');
        const data = await response.json();
        
        // 1. Current Weather
        cityName.textContent = `${data.location.name}, ${data.location.country}`;
        temp.textContent = `${Math.round(data.current.temp_c)}°C`;
        desc.textContent = data.current.condition.text;
        
        weatherIcon.src = `https:${data.current.condition.icon}`;
        weatherIcon.alt = data.current.condition.text;
        weatherIcon.style.display = "block";
        
        // 2. Extra Metrics Populate
        feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
        humidity.textContent = `${data.current.humidity}%`;
        windSpeed.textContent = `${data.current.wind_kph} km/h`;
        detailsBox.style.display = "flex";

        // 3. Dynamic Background
        changeBackground(data.current.condition.text.toLowerCase());

        // 4. Forecast
        updateForecast(data.forecast.forecastday);
        
    } catch (error) {
        cityName.textContent = "Error";
        temp.textContent = "--";
        desc.textContent = error.message;
        body.className = "default-bg"; 
    }
}

function changeBackground(condition) {
    body.className = "";
    if (condition.includes("sunny") || condition.includes("clear")) {
        body.classList.add("sunny");
    } else if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunder")) {
        body.classList.add("rainy");
    } else if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("mist") || condition.includes("fog")) {
        body.classList.add("cloudy");
    } else if (condition.includes("snow") || condition.includes("sleet") || condition.includes("ice")) {
        body.classList.add("snowy");
    } else {
        body.classList.add("default-bg");
    }
}

function updateForecast(forecastDays) {
    forecastBox.innerHTML = "";
    forecastDays.forEach(day => {
        const dateObj = new Date(day.date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

        const cardHtml = `
            <div class="forecast-card">
                <p class="forecast-date">${dayName}</p>
                <img src="https:${day.day.condition.icon}" alt="weather" style="width: 40px; margin: 0 auto;">
                <p style="font-weight: 600;">${Math.round(day.day.avgtemp_c)}°C</p>
                <p style="font-size: 11px; opacity: 0.8;">${day.day.condition.text}</p>
            </div>
        `;
        forecastBox.insertAdjacentHTML('beforeend', cardHtml);
    });
    forecastBox.style.display = "flex";
}

// Auto Location trigger on load
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Agar permission mili toh lat,lon bhejo
                const query = `${position.coords.latitude},${position.coords.longitude}`;
                checkWeather(query);
            },
            () => {
                // Agar user deny kare toh default city load kar do (e.g., Kolkata ya Delhi)
                checkWeather("Kolkata");
            }
        );
    } else {
        checkWeather("Kolkata");
    }
});

searchBtn.addEventListener('click', () => {
    checkWeather(cityInput.value.trim());
});

cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkWeather(cityInput.value.trim());
    }
});