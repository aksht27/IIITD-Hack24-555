const userLocation = document.getElementById("userLocation"),
  converter = document.getElementById("converter"),
  weatherIcon = document.querySelector(".weatherIcon"),
  temperature = document.querySelector(".temperature"),
  feelsLike = document.querySelector(".feelsLike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),
  HValue = document.getElementById("HValue"),
  WValue = document.getElementById("WValue"),
  SRValue = document.getElementById("SRValue"),
  SSValue = document.getElementById("SSValue"),
  CValue = document.getElementById("CValue"),
  UVValue = document.getElementById("UVValue"),
  PVValue = document.getElementById("PVValue"),
  WEATHER_API_ENDPOINT =
    "http://api.weatherapi.com/v1/current.json?key=35c1d0c4121145b1a5c192108242408&q=",
  WEATHER_DATA_ENDPOINT =
    "http://api.weatherapi.com/v1/forecast.json?key=35c1d0c4121145b1a5c192108242408&q";

const Forecast = document.querySelector(".Forecast");

function findUserLocation() {
  fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
      // Check if the data is valid
      if (data.error) {
        alert(data.error.message);
        return;
      }

      console.log(data);

      city.innerHTML= data.name+","+data.sys.country;
      weatherIcon.style.backgroundImage = `url($ https://openweathermap.org/img/wn/$(data.weather[0].icon)@2x.png)`;

      // Fetch additional weather data using the coordinates
      fetch(
        `${WEATHER_DATA_ENDPOINT}lat=${data.location.lat}&lon=${data.location.lon}`
      )
        .then((response) => response.json())
        .then((additionalData) => {
          console.log(additionalData);
          // Handle the additional data here
          // For example:
          temperature.innerHTML=data.current.temp;
          feelsLike.innerHTML=data.current.feelslike;
          description.innerHTML=data.current.description;
          HValue.textContent = additionalData.current.humidity;
          WValue.textContent = additionalData.current.wind_kph;
          // Add more fields as needed
        })
        .catch((error) =>
          console.error("Error fetching additional data:", error)
        );
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}
