// OpenWeatherMap API Configuration
const API_KEY = '5553cd64c3d560c3539516371a8c3b7a'; // Replace with your API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const cityButtons = document.querySelectorAll('.city-btn');

// Weather Data Elements
const cityName = document.getElementById('cityName');
const dateTime = document.getElementById('dateTime');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city name');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

cityButtons.forEach(button => {
    button.addEventListener('click', () => {
        const city = button.getAttribute('data-city');
        cityInput.value = city;
        fetchWeather(city);
    });
});

// Fetch Weather Data
async function fetchWeather(city) {
    showLoading();
    hideError();
    hideWeatherDisplay();

    try {
        const response = await fetch(
            `${API_URL}?q=${encodeURIComponent(city)},IN&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your configuration.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again later.');
            }
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Display Weather Data
function displayWeather(data) {
    // City name and country
    cityName.textContent = `${data.name}, ${data.sys.country}`;

    // Current date and time
    const now = new Date();
    dateTime.textContent = now.toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].description;

    // Temperature
    temp.textContent = Math.round(data.main.temp);

    // Weather description
    description.textContent = data.weather[0].description;
    feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

    // Weather details
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    // Sunrise and sunset
    sunrise.textContent = formatTime(data.sys.sunrise);
    sunset.textContent = formatTime(data.sys.sunset);

    showWeatherDisplay();
}

// Format Unix timestamp to readable time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// UI Helper Functions
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showWeatherDisplay() {
    weatherDisplay.classList.remove('hidden');
}

function hideWeatherDisplay() {
    weatherDisplay.classList.add('hidden');
}

// Load default city on page load
window.addEventListener('load', () => {
    // Check if API key is configured
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please configure your OpenWeatherMap API key in script.js');
    } else {
        fetchWeather('Patna');
    }
});