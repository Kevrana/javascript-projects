const weatherCodeMap = {
	0: ["Clear Sky", "sun.png"],
	1: ["Mainly Clear", "sun.png"],
	2: ["Partly Cloudy", "cloudy.png"],
	3: ["Overcast", "overcast.png"],
	45: ["Fog", "fog.png"],
	48: ["Depositing Rime Fog", "fog.png"],
	51: ["Light Drizzle", "rain.png"],
	53: ["Moderate Drizzle", "rain.png"],
	55: ["Dense Drizzle", "rain.png"],
	56: ["Light Freezing Drizzle", "rain.png"],
	57: ["Dense Freezing Drizzle", "rain.png"],
	61: ["Slight Rain", "rain.png"],
	63: ["Moderate Rain", "rain.png"],
	65: ["Heavy Rain", "rain.png"],
	66: ["Light Freezing Rain", "rain.png"],
	67: ["Dense Freezing Rain", "rain.png"],
	71: ["Light Snow", "snow.png"],
	73: ["Moderate Snow", "snow.png"],
	75: ["Heavy Snow", "snow.png"],
	77: ["Snow Grains", "snow.png"],
	80: ["Slight Rain Showers", "rain.png"],
	81: ["Moderate Rain Showers", "rain.png"],
	82: ["Violent Rain Showers", "rain.png"],
	85: ["Slight Snow Showers", "snow.png"],
	86: ["Heavy Snow Showers", "snow.png"],
	95: ["Thunderstorm", "thunderstorm.png"],
	96: ["Thunderstorm With Slight Hail", "thunderstorm.png"],
	99: ["Thunderstorm With Heavy Hail", "thunderstorm.png"],
};

const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const tempUnitButton = document.getElementById("temp-unit-button");
const windSpeedUnitButton = document.getElementById("wind-speed-unit-button");

searchButton.addEventListener("click", getWeather);
tempUnitButton.addEventListener("click", switchTempUnit);
windSpeedUnitButton.addEventListener("click", switchWindSpeedUnit);

async function getWeather() {
	// Get the city name from the input field
	let city = cityInput.value.trim();
	if (city === "") {
		document.getElementById("city-input-error-msg").innerText =
			"*Enter a valid city name to search!";
	} else {
		console.log("city:", city);
		document.getElementById("city-input-error-msg").innerText = "";

		// Fetch the geocoding data to get latitude and longitude for the city from the Open-Meteo Geocoding API
		const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
		const geoResponse = await fetch(geoUrl);
		const geoData = await geoResponse.json();
		console.log(geoData);
		const latitude = geoData.results[0].latitude;
		const longitude = geoData.results[0].longitude;
		city = geoData.results[0].name;
		const country = geoData.results[0].country;

		// Fetch the weather data using the latitude and longitude from the Open-Meteo Weather API
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
		const weatherResponse = await fetch(weatherUrl);
		const weatherData = await weatherResponse.json();
		console.log(weatherData);

		// Extract the relevant weather information from the response
		const temperature = weatherData.current_weather.temperature;
		const windSpeed = weatherData.current_weather.windspeed;
		const weatherCode = weatherData.current_weather.weathercode;

		// Get the weather description and icon based on the weather code
		const [weatherCondition, weatherImage] = weatherCodeMap[weatherCode] || [
			"Unknown",
			"unknown.png",
		];

		// Update the DOM elements with the fetched weather data
		// If the country is different from the city name, display both; otherwise, just display the city name
		if (country && city != country) {
			document.getElementById("city").innerText = `${city}, ${country}`;
		} else {
			document.getElementById("city").innerText = city;
		}
		document.getElementById("weather-image").src = "./assets/" + weatherImage;
		document.getElementById("temperature").innerText = temperature;
		document.getElementById("temp-unit").innerText = "°C";
		tempUnitButton.textContent = "Switch to °F";
		document.getElementById("wind-speed-unit").innerText = "km/h";
		windSpeedUnitButton.textContent = "Switch to mph";
		document.getElementById("wind-speed").innerText = windSpeed;
		document.getElementById("weather-condition").innerText = weatherCondition;
	}
}

function switchTempUnit() {
	const tempElement = document.getElementById("temperature");
	const tempUnit = document.getElementById("temp-unit");
	let currentTemp = parseFloat(tempElement.innerText) || 0;

	// Check if the current temperature is in Celsius (°C) or Fahrenheit (°F) and convert accordingly
	if (tempUnitButton.textContent.includes("°F")) {
		// convert to Fahrenheit
		const farenheitTemp = currentTemp * (9 / 5) + 32;
		tempElement.innerText = farenheitTemp.toFixed(1);
		tempUnit.innerText = " °F";
		tempUnitButton.textContent = "Switch to °C";
	} else {
		// convert to Celsius
		const celsiusTemp = (currentTemp - 32) * (5 / 9);
		tempElement.innerText = celsiusTemp.toFixed(1);
		tempUnit.innerText = " °C";
		tempUnitButton.textContent = "Switch to °F";
	}
}

function switchWindSpeedUnit() {
	const windSpeedElement = document.getElementById("wind-speed");
	const windSpeedUnit = document.getElementById("wind-speed-unit");
	let currentSpeed = parseFloat(windSpeedElement.innerText) || 0;

	// Check if the current wind speed is in km/h or mph and convert accordingly
	if (windSpeedUnitButton.textContent.includes("mph")) {
		// convert to mph
		windSpeedElement.innerText = (currentSpeed * 0.621371).toFixed(2);
		windSpeedUnit.innerText = " mph";
		windSpeedUnitButton.textContent = "Switch to km/h";
	} else {
		// convert to km/h
		windSpeedElement.innerText = (currentSpeed / 0.621371).toFixed(2);
		windSpeedUnit.innerText = " km/h";
		windSpeedUnitButton.textContent = "Switch to mph";
	}
}
