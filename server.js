require('dotenv').config();

const PORT = process.env.PORT || 3000;

const cors = require('cors'); //Cross Origin Resource Sharing
const express = require('express');
const app = express();
const axios = require('axios');

const getWeather = require('./weather.js');
const getLocationMovies = require('./movies.js');

// Define routes and middleware here

// Can pass in a list of allowed domains, or leave blank for wide open access.
app.use(cors());

app.get('/', (request, response) => {
  response.send('You made it! Welcome!');
});

app.get('/weather', getWeather);

app.get('/movies', getLocationMovies);

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