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
    let dayOfTheWeek = '';

    // Access the data array and its first element, extracting properties using optional chaining
    weatherData?.data?.data?.forEach(day => {
      // Create a new Forecast object using destructuring
      const { datetime, weather, app_temp } = day;
      const { description, icon } = weather;

      // Find day of the week
      const date = new Date(datetime);
      const dateDay = date.getDay();
      const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

      if (getTodaysDate() === datetime) { // TODO: Create function to find out if today is today
        dayOfTheWeek = 'Today';
      } else {
        dayOfTheWeek = dayNames[dateDay];
      }

      cityForecast.push(new Forecast(datetime, dayOfTheWeek, description, app_temp, icon));
    });

    console.log(cityForecast);

    response.send(cityForecast);
  } catch (error) {
    console.error(error);
    error.message = "City Weather Not Found."
    response.status(501).send(error.message);
  }
});

class Forecast {
  constructor(date, day, description, temp, icon) {
    this.date = date;
    this.day = day;
    this.description = description;
    this.temp = temp;
    this.icon = icon;
  }
}

function getTodaysDate () {
  const currentDate = new Date();

    // Get the year, month, and day
    const year = currentDate.getFullYear();
    // JavaScript months are zero-based, so add 1 to get the correct month
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding padding if month is a single digit
    const day = String(currentDate.getDate()).padStart(2, '0'); // Adding padding if day is a single digit

    // Form the date string in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
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