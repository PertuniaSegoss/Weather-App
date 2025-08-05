const apiKey = "320240839ac90c4446e3bfd15d190290";
let isCelsius = true;
let currentData = null;

function getWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          currentData = data;
          displayWeather(data);
          getForecast(lat, lon);
        });
    },
    () => {
      alert("Unable to retrieve your location");
    }
  );
}

function displayWeather(data) {
  const temp = isCelsius ? data.main.temp : (data.main.temp * 9) / 5 + 32;
  const unit = isCelsius ? "°C" : "°F";
  document.getElementById("temperature").textContent = `${
    data.name
  }: ${temp.toFixed(1)}${unit}`;
  document.getElementById("description").textContent =
    data.weather[0].description;
  document.getElementById(
    "humidity"
  ).textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById(
    "wind"
  ).textContent = `Wind Speed: ${data.wind.speed} m/s`;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const iconImg = document.getElementById("icon");
  iconImg.src = iconUrl;
  iconImg.style.display = "inline-block";
}

function toggleUnits() {
  if (!currentData) return;
  isCelsius = !isCelsius;
  displayWeather(currentData);
}

function getForecast(lat, lon) {
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(forecastURL)
    .then((response) => response.json())
    .then((data) => {
      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "<h3>5-Day Forecast</h3>";

      const filtered = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      filtered.forEach((item) => {
        const date = new Date(item.dt_txt).toDateString();
        const icon = item.weather[0].icon;
        const temp = isCelsius ? item.main.temp : (item.main.temp * 9) / 5 + 32;
        const desc = item.weather[0].description;
        const unit = isCelsius ? "°C" : "°F";

        forecastContainer.innerHTML += `
          <div class="forecast-day">
            <p><strong>${date}</strong></p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
            <p>${temp.toFixed(1)}${unit}</p>
            <p>${desc}</p>
          </div>
        `;
      });
    });
}
