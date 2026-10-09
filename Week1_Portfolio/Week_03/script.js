const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const apiKeyInput = document.getElementById("apiKeyInput");
const searchButton = document.getElementById("searchBtn");
const searchButtonText = document.querySelector(".search-button-text");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");
const weatherResult = document.getElementById("weatherResult");
const apiKeyDetails = document.querySelector(".api-key-details");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navigationPanel = document.querySelector(".nav-panel");
const root = document.documentElement;

function applyTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = selectedTheme;
    themeButton.textContent = selectedTheme === "dark" ? "☀" : "☾";
    themeButton.setAttribute(
        "aria-label",
        selectedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );

    try {
        localStorage.setItem("interactive-projects-theme", selectedTheme);
    } catch (error) {
        // Theme changes still apply for this page view when storage is unavailable.
    }
}

let savedTheme = "dark";
try {
    savedTheme = localStorage.getItem("interactive-projects-theme") || "dark";
} catch (error) {
    // Keep the dark default when browser storage is unavailable.
}
applyTheme(savedTheme);

themeButton.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeNavigation() {
    navigationPanel.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", () => {
    const isOpen = navigationPanel.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
});

document.getElementById("currentYear").textContent = String(new Date().getFullYear());

function showError(message) {
    errorMessage.textContent = message;
    weatherResult.hidden = true;
}

function getWeatherIcon(weatherCondition) {
    const icons = {
        Clear: "☀",
        Clouds: "☁",
        Rain: "☂",
        Drizzle: "☂",
        Thunderstorm: "ϟ",
        Snow: "❄",
        Mist: "≋",
        Smoke: "≋",
        Haze: "≋",
        Dust: "≋",
        Fog: "≋",
        Sand: "≋",
        Ash: "≋",
        Squall: "↝",
        Tornado: "↝"
    };

    return icons[weatherCondition] || "◉";
}

function showWeather(data) {
    if (!data.main || !Array.isArray(data.weather) || !data.weather[0] || !data.wind) {
        throw new Error("Weather data was incomplete. Please try again.");
    }

    cityName.textContent = [data.name, data.sys && data.sys.country].filter(Boolean).join(", ");
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    condition.textContent = data.weather[0].description || "Conditions unavailable";
    humidity.textContent = `${data.main.humidity}%`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    wind.textContent = `${data.wind.speed} m/s`;
    weatherIcon.textContent = getWeatherIcon(data.weather[0].main);
    weatherResult.hidden = false;
}

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    errorMessage.textContent = "";
    if (!city) {
        showError("Please enter a city name.");
        cityInput.focus();
        return;
    }
    if (!apiKey) {
        apiKeyDetails.open = true;
        showError("Enter your OpenWeather API key to look up a city. It will only be used while this page is open.");
        apiKeyInput.focus();
        return;
    }

    searchButton.disabled = true;
    searchButton.setAttribute("aria-busy", "true");
    searchButtonText.textContent = "Searching…";
    loadingMessage.hidden = false;
    weatherResult.hidden = true;

    const query = new URLSearchParams({
        q: city,
        appid: apiKey,
        units: "metric"
    });

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Check the spelling and try again.");
            }
            if (response.status === 401) {
                throw new Error("The API key was rejected. Check that it is active and entered correctly.");
            }
            throw new Error(data.message || "OpenWeather could not complete the search.");
        }

        showWeather(data);
    } catch (error) {
        const message = error instanceof TypeError
            ? "Could not connect to OpenWeather. Check your internet connection and try again."
            : error.message;
        showError(message);
    } finally {
        searchButton.disabled = false;
        searchButton.removeAttribute("aria-busy");
        searchButtonText.textContent = "Search weather";
        loadingMessage.hidden = true;
    }
});
