function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return days[day];
}

function getForecast(coordinates) {
  console.log(coordinates);
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiKey = "cf6b50b908fa2e0baca3eed8a569a5f6";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiURL).then(displayForecast);
}

function showTemperatureCondition(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  temperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = `${temperature}°F`;

  document.querySelector(
    "#clouds"
  ).innerHTML = `${response.data.weather[0].description}`;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  let apiIcon = document.querySelector(".apiIcon");
  apiIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col-2">
            <div class="weather-forecast-date">${formatDay(
              forecastDay.dt
            )}</div>
            <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" width="50px"/>
            <div class="weather-forecast-temperature">${Math.round(
              forecastDay.temp.max
            )}° ${Math.round(forecastDay.temp.min)}° </div>
          </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(response.dt);
}

function search(city) {
  let apiKey = "cf6b50b908fa2e0baca3eed8a569a5f6";
  let unit = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showTemperatureCondition);
}

function submit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("h1");
  let cityInput = document.querySelector("#search-text-input");
  let city = cityInput.value;
  search(city);
}

function getLocation(position) {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let unit = "imperial";
  let apiKey = "cf6b50b908fa2e0baca3eed8a569a5f6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showTemperatureCondition);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}

function convertToCelcius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  let celciusDegree = Math.round((temperature - 32) * (5 / 9));
  currentTemp.innerHTML = `${celciusDegree}°C`;
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = `${temperature}°F`;
}

let now = new Date();
let dayNTime = document.querySelector("h2");
dayNTime.innerHTML = formatDate(now);

let form = document.querySelector("#input-search");
form.addEventListener("submit", submit);

let button = document.querySelector("button");
button.addEventListener("click", getCurrentPosition);

let temperature = null;

let celcius = document.querySelector("#cel");
celcius.addEventListener("click", convertToCelcius);

let fahrenheit = document.querySelector("#fah");
fahrenheit.addEventListener("click", convertToFahrenheit);

search("San Jose");
