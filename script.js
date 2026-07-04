// ==========================================
// Weather Prediction System v2.0
// ==========================================

// API Key
const apiKey = "51ef9de8facc4b918a3180459260207";

// DOM Elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

const cityName = document.getElementById("city-name");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");

const weatherIcon = document.getElementById("weather-icon");

const forecastBox = document.getElementById("forecast-box");
const detailsBox = document.getElementById("details-box");

const body = document.getElementById("bg-body");

// Extra Details

const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

// UI Elements

const loader = document.getElementById("loader");

const errorBox = document.getElementById("error-box");

const errorText = document.getElementById("error-text");

const themeBtn = document.getElementById("theme-btn");
// ==========================================
// Get Weather Function
// ==========================================

async function checkWeather(query) {

    if (!query) return;

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3&aqi=no`;

    // Reset UI
    loader.style.display = "block";
    errorBox.style.display = "none";

    cityName.textContent = "Loading...";
    temp.textContent = "--°C";
    desc.textContent = "--";

    weatherIcon.style.display = "none";
    detailsBox.style.display = "none";
    forecastBox.style.display = "none";

    try {

        const response = await fetch(url);

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // =====================
        // Current Weather
        // =====================

        cityName.textContent =
            `${data.location.name}, ${data.location.country}`;

        temp.textContent =
            `${Math.round(data.current.temp_c)}°C`;

        desc.textContent =
            data.current.condition.text;

        weatherIcon.src =
            "https:" + data.current.condition.icon;

        weatherIcon.alt =
            data.current.condition.text;

        weatherIcon.style.display = "block";

        // =====================
        // Details
        // =====================

        feelsLike.textContent =
            `${Math.round(data.current.feelslike_c)}°C`;

        humidity.textContent =
            `${data.current.humidity}%`;

        windSpeed.textContent =
            `${data.current.wind_kph} km/h`;

        detailsBox.style.display = "flex";

        // =====================
        // Background
        // =====================

        changeBackground(
            data.current.condition.text.toLowerCase()
        );

        // =====================
        // Forecast
        // =====================

        updateForecast(
            data.forecast.forecastday
        );

        loader.style.display = "none";

    }

    catch (error) {

        loader.style.display = "none";

        errorBox.style.display = "block";

        errorText.textContent = error.message;

        cityName.textContent = "--";

        temp.textContent = "--";

        desc.textContent = "--";

        detailsBox.style.display = "none";

        forecastBox.style.display = "none";

        body.className = "default-bg";

        console.error(error);

    }

}
// ==========================================
// Change Background
// ==========================================

function changeBackground(condition) {

    body.className = "";

    if (condition.includes("sunny") || condition.includes("clear")) {

        body.classList.add("sunny");

    }

    else if (
        condition.includes("rain") ||
        condition.includes("drizzle") ||
        condition.includes("thunder")
    ) {

        body.classList.add("rainy");

    }

    else if (
        condition.includes("cloud") ||
        condition.includes("overcast") ||
        condition.includes("mist") ||
        condition.includes("fog")
    ) {

        body.classList.add("cloudy");

    }

    else if (
        condition.includes("snow") ||
        condition.includes("ice") ||
        condition.includes("sleet")
    ) {

        body.classList.add("snowy");

    }

    else {

        body.classList.add("default-bg");

    }

}

// ==========================================
// Forecast
// ==========================================

function updateForecast(days) {

    forecastBox.innerHTML = "";

    days.forEach(day => {

        const date = new Date(day.date);

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const card = `

        <div class="forecast-card">

            <p class="forecast-date">${dayName}</p>

            <img
            src="https:${day.day.condition.icon}"
            alt="weather">

            <h4>${Math.round(day.day.avgtemp_c)}°C</h4>

            <p>${day.day.condition.text}</p>

        </div>

        `;

        forecastBox.insertAdjacentHTML("beforeend", card);

    });

    forecastBox.style.display = "flex";

}

// ==========================================
// Theme Toggle
// ==========================================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "☀";

        localStorage.setItem("theme", "dark");

    }

    else {

        themeBtn.textContent = "🌙";

        localStorage.setItem("theme", "light");

    }

});

// Load Saved Theme

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀";

}
// ==========================================
// Auto Detect Location
// ==========================================

window.addEventListener("load", () => {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const query =
                    `${position.coords.latitude},${position.coords.longitude}`;

                checkWeather(query);

            },

            () => {

                // Permission deny
                checkWeather("Kolkata");

            }

        );

    }

    else {

        checkWeather("Kolkata");

    }

});

// ==========================================
// Search Button
// ==========================================

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {

        errorBox.style.display = "block";

        errorText.textContent = "Please enter a city name.";

        return;

    }

    checkWeather(city);

});

// ==========================================
// Press Enter
// ==========================================

cityInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        searchBtn.click();

    }

});

// ==========================================
// Clear Error while Typing
// ==========================================

cityInput.addEventListener("input", () => {

    errorBox.style.display = "none";

});

// ==========================================
// Save Last Search
// ==========================================

cityInput.addEventListener("change", () => {

    localStorage.setItem("lastCity", cityInput.value);

});

// ==========================================
// Load Last Search
// ==========================================

const lastCity = localStorage.getItem("lastCity");

if (lastCity) {

    cityInput.value = lastCity;

}