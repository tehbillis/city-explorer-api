require('dotenv').config();

const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const cors = require('cors'); //Cross Origin Resource Sharing
const express = require('express');
const app = express();
const axios = require('axios');

// Define routes and middleware here

// Can pass in a list of allowed domains, or leave blank for wide open access.
app.use(cors());

app.get('/', (request, response) => {
  response.send('You made it! Welcome!');
});

app.get('/weather', async (request, response) => {
  const { lat, lon } = request.query;
  let cityForecast = [];

  try {
    const weatherData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}&units=I&days=3`);

    // Access the data array and its first element, extracting properties using optional chaining
    weatherData?.data?.data?.forEach(day => {
      // Create a new Forecast object using destructuring
      const { datetime, weather, app_temp } = day;
      const { description, icon } = weather;
      cityForecast.push(new Forecast(datetime, description, app_temp, icon));
    });

    response.send(cityForecast);
  } catch (error) {
    console.error(error);
    error.message = "City Weather Not Found."
    response.status(501).send(error.message);
  }
});

class Forecast {
  constructor(date, description, temp, icon) {
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.icon = icon;
  }
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