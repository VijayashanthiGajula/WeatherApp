# WEATHERLY

Minimal client-side weather app for GitHub Pages (no build step).

## Overview

WEATHERLY is a small static site that fetches current weather data from OpenWeatherMap and displays it in a clean, responsive UI.

## Files

- `index.html` — main page and form
- `styles.css` — minimalist responsive styles
- `script.js` — vanilla JavaScript for fetching and rendering weather

## Setup

1. Obtain an OpenWeatherMap API key: https://home.openweathermap.org/api_keys
2. Provide the API key to the app without committing it to source control. The page now asks for your key directly in the form.

- Enter the key in the `OpenWeather API Key` field on the page.
- Optionally save in your browser console for convenience: `localStorage.setItem('OPENWEATHER_API_KEY', 'YOUR_KEY')`.

Note: GitHub Pages is static and cannot hide secrets. For public repos, restrict the key by domain in the OpenWeatherMap settings or proxy requests through a server.

## Running locally

You can open `index.html` directly in a browser, but some browsers restrict `fetch` from file:// URLs. It's recommended to serve the folder locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

To pass a key in the URL for testing:

```
http://localhost:8000/?key=YOUR_KEY
```

## Deploy to GitHub Pages

1. Push the files to the `main` branch of your repository.
2. In the repository settings enable GitHub Pages and select the `main` branch root.
3. Visit the GitHub Pages URL for your site.

## Security note

- Do not commit your API key to a public repository. If you must, restrict the key to your domain via OpenWeatherMap settings.
- A more secure setup is to proxy requests through a server or use a serverless function that injects the key.

## License

Public domain.
# WeatherApp