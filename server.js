require('dotenv').config();

const PORT = process.env.PORT || 3000;
const weatherData = require('./data/weather.json');

const cors = require('cors'); //Cross Origin Resource Sharing
const express = require('express');
const app = express();

// Define routes and middleware here

// Can pass in a list of allowed domains, or leave blank for wide open access.
app.use(cors());

app.get('/', (request, response) => {
  response.send('You made it! Welcome!');
});

app.get('/weather', (request, response) => {
  const { lat, lon, searchQuery } = request.query;

  console.log(Math.floor(lat * 10) / 10);

  let cityWeather = new Weather(searchQuery, lat, lon);
  console.log(cityWeather);
  try {
    let cityForecast = cityWeather.getCityWeather().reduce((accumulator, item) => {
      accumulator.push(new Forecast(item.datetime, item.weather.description));
      return accumulator;
    }, []);

    response.send(cityForecast);
  } catch (error) {
    console.error(error);
    error.message = "City Weather Not Found."
    response.status(501).send(error.message);
  }
});

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Weather {
  constructor(city, lat, lon) {
    this.weatherData = weatherData.find(data => (
      data.city_name.toLocaleLowerCase() === city.toLocaleLowerCase() &&
      truncLocation(data.lat) === truncLocation(lat) &&
      truncLocation(data.lon) === truncLocation(lon)
    ));
  }

  getCityName() {
    return this.weatherData ? this.weatherData.city_name : 'City not found';
  }

  getCityWeather() {
    return this.weatherData ? this.weatherData.data : 'City Not Found';
  }
}

// If the location name matches the lat and lon to the 10th decimal place, we will accept it as being the right location for now.
function truncLocation (location) {
  return Math.floor(location * 10) / 10;
}

app.get('*', (request, response) => {
  response.status(404).send('Not Found');
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send(error.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});