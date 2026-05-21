#!/usr/bin/env python3
"""Simple script to fetch current weather for Melbourne, Australia.

Loads the OpenWeatherMap API key from the environment variable
`OPENWEATHER_API_KEY` and prints temperature (°C) and conditions.
"""
from __future__ import annotations

import os
import sys
from typing import Any, Dict

try:
    import requests
except ImportError:
    sys.exit(
        "Missing dependency: install 'requests' (e.g. pip install requests)"
    )


API_URL = "https://api.openweathermap.org/data/2.5/weather"
LOCATION = "Melbourne,AU"


def get_api_key() -> str:
    """Return the OpenWeatherMap API key from the environment.

    Exits the program with an error message if the key is missing.
    """
    key = os.environ.get("OPENWEATHER_API_KEY")
    if not key:
        sys.exit(
            "Environment variable OPENWEATHER_API_KEY is not set."
        )
    return key


def fetch_weather(api_key: str) -> Dict[str, Any]:
    """Call the OpenWeatherMap API and return parsed JSON.

    Raises SystemExit on network errors or unexpected API responses.
    """
    params = {"q": LOCATION, "appid": api_key, "units": "metric"}
    try:
        resp = requests.get(API_URL, params=params, timeout=10)
    except requests.exceptions.RequestException as exc:
        sys.exit(f"Network error when contacting weather API: {exc}")

    if resp.status_code != 200:
        # Try to show API error message when available
        try:
            err = resp.json()
            message = err.get("message", resp.text)
        except ValueError:
            message = resp.text
        sys.exit(f"Weather API returned {resp.status_code}: {message}")

    try:
        data = resp.json()
    except ValueError:
        sys.exit("Received invalid JSON from weather API")

    return data


def parse_and_print(data: Dict[str, Any]) -> None:
    """Extract temperature and conditions and print them nicely."""
    try:
        temp = data["main"]["temp"]
        conditions = data["weather"][0]["description"]
    except (KeyError, IndexError, TypeError):
        sys.exit("Unexpected API response structure")

    # Clean, human-readable output
    print("Current weather for Melbourne, Australia")
    print(f"Temperature: {temp:.1f} °C")
    print(f"Conditions: {conditions.capitalize()}")


def main() -> None:
    """Main entry point: load key, fetch weather, and display results."""
    api_key = get_api_key()
    data = fetch_weather(api_key)
    parse_and_print(data)


if __name__ == "__main__":
    main()
