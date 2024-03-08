require('dotenv').config();

const PORT = process.env.PORT || 3000;
const weatherData = require('./data/weather.json');

const express = require('express');
const app = express();

// Define routes and middleware here

app.get('/', (request, response) => {
  response.send('You made it! Welcome!');
});

app.get('/weather', (request, response) => {
  const { lat, lon, searchQuery } = request.query;
  //const queryParams = { lat, lon, searchQuery };  

  let cityWeather = new Weather(searchQuery, lat, lon);
  let cityForecast = cityWeather.getCityWeather().reduce((accumulator, item) => {
    accumulator.push(new Forecast(item.datetime, item.weather.description));
    return accumulator;
  }, []);

  response.send(cityForecast);
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
      data.city_name === city &&
      data.lat === lat &&
      data.lon === lon
    ));
  }

  getCityName() {
    return this.weatherData ? this.weatherData.city_name : 'City not found';
  }

  getCityWeather() {
    return this.weatherData ? this.weatherData.data : 'City Not Found';
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});