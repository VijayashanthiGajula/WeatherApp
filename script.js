// Minimal WEATHERLY frontend (vanilla JS)
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

let form;
let cityInput;
let countryInput;
let apiKeyInput;
let messageEl;
let resultEl;
let locationEl;
let iconEl;
let tempEl;
let condEl;
let humidityEl;
let windEl;

function getApiKey() {
  const entered = apiKeyInput?.value.trim() || '';
  return entered;
}

function initDomRefs() {
  form = document.getElementById('weather-form');
  cityInput = document.getElementById('city');
  countryInput = document.getElementById('country');
  apiKeyInput = document.getElementById('api-key');
  messageEl = document.getElementById('message');
  resultEl = document.getElementById('result');
  locationEl = document.getElementById('location');
  iconEl = document.getElementById('icon');
  tempEl = document.getElementById('temp');
  condEl = document.getElementById('condition');
  humidityEl = document.getElementById('humidity');
  windEl = document.getElementById('wind');
}

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
    showMessage('Please enter your OpenWeatherMap API key in the form above.', true);
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

document.addEventListener('DOMContentLoaded', () => {
  initDomRefs();
  if (!form) {
    console.error('Weatherly initialization failed: form element not found.');
    return;
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
});

// Optional: allow user to save key to localStorage for convenience (not persisted here)
// Example: localStorage.setItem('OPENWEATHER_API_KEY', 'your_key')
