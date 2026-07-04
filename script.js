const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const apiKey = "51ef9de8facc4b918a3180459260207"; // Put your real API key inside the quotes

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        alert("Please enter a city name first!");
        return;
    }
    getWeatherData(city);
});

async function getWeatherData(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        
        document.getElementById("city-name").innerText = `${data.location.name}, ${data.location.country}`;
        document.getElementById("temp").innerText = `${data.current.temp_c} °C`;
        document.getElementById("desc").innerText = data.current.condition.text;
    } catch (error) {
        document.getElementById("city-name").innerText = "Error!";
        document.getElementById("temp").innerText = "-- °C";
        document.getElementById("desc").innerText = "Please enter a valid city name.";
    }
}