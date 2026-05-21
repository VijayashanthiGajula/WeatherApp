// Minimal WEATHERLY frontend (vanilla JS)

// Configure API key here or use ?key=YOUR_KEY in the URL as a fallback.
const API_KEY = '';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Helper to obtain key from several sources without committing it to the repo
function getApiKey() {
  const urlKey = new URLSearchParams(window.location.search).get('key');
  const stored = localStorage.getItem('OPENWEATHER_API_KEY');
  return API_KEY || urlKey || stored || '';
}

// DOM refs
const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city');
const countryInput = document.getElementById('country');
const messageEl = document.getElementById('message');
const resultEl = document.getElementById('result');
const locationEl = document.getElementById('location');
const iconEl = document.getElementById('icon');
const tempEl = document.getElementById('temp');
const condEl = document.getElementById('condition');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? '#b91c1c' : '';
}

function resetResult() {
  resultEl.hidden = true;
}

function renderResult(data) {
  const name = `${data.name}, ${data.sys?.country || ''}`;
  const temp = data.main?.temp;
  const cond = data.weather?.[0]?.description || '';
  const humidity = data.main?.humidity;
  const wind = data.wind?.speed;
  const icon = data.weather?.[0]?.icon;

  locationEl.textContent = name;
  tempEl.textContent = `${temp.toFixed(1)} °C`;
  condEl.textContent = cond.replace(/\b\w/g, (c) => c.toUpperCase());
  humidityEl.textContent = `${humidity} %`;
  windEl.textContent = `${wind} m/s`;

  if (icon) {
    iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconEl.alt = cond;
  } else {
    iconEl.removeAttribute('src');
    iconEl.alt = '';
  }

  resultEl.hidden = false;
}

async function fetchWeather(q) {
  const key = getApiKey();
  if (!key) {
    showMessage('API key not set. Add your key to script.js or use ?key=YOUR_KEY', true);
    return null;
  }

  const url = `${API_URL}?q=${encodeURIComponent(q)}&units=metric&appid=${key}`;
  showMessage('Loading...');
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    if (!resp.ok) {
      showMessage(data.message || 'Unable to fetch weather', true);
      return null;
    }
    showMessage('');
    return data;
  } catch (err) {
    showMessage('Network error while fetching weather', true);
    return null;
  }
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  resetResult();
  const city = cityInput.value.trim();
  const country = countryInput.value.trim();
  if (!city) {
    showMessage('Please enter a city.', true);
    return;
  }
  const q = country ? `${city},${country}` : city;
  const data = await fetchWeather(q);
  if (data) renderResult(data);
});

// Optional: allow user to save key to localStorage for convenience (not persisted here)
// Example: localStorage.setItem('OPENWEATHER_API_KEY', 'your_key')
