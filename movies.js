const axios = require('axios');

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;


const getLocationMovies = async (request, response) => {
  let keywords = await getMovieKeywords(request.query.location);
  let movies = await getMovies(keywords);

  // console.log(movies);

  // response.send(keywords);
  response.send(movies);
};

async function getMovieKeywords(location) {
  const locationInfo = location.split(',');

  for (let i = 0; i < locationInfo.length; i++) {
    let movieKeywords = {};

    try {
      movieKeywords = await axios.get(`https://api.themoviedb.org/3/search/keyword?query=${encodeURIComponent(locationInfo[i])}&page=1&api_key=${encodeURIComponent(MOVIE_API_KEY)}`);
    } catch (error) {
      console.error(error);
      error.message = "Movie keywords not Found";
      response.status(501).send(error.message);
    }

    // console.log(movieKeywords);
    if (movieKeywords.data.total_results > 0) {
      let movieKeywordIds = movieKeywords.data.results.map(keyword => {
        return keyword.id;
      });
      // console.log(movieKeywordIds.join('|'));

      return movieKeywordIds.join('|');
    }
  }
}

async function getMovies(keywords) {
  try {
    let movieInfo = [];

    const locationMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_keywords=${encodeURIComponent(keywords)}&api_key=${encodeURIComponent(MOVIE_API_KEY)}`);

    locationMovies.data.results.forEach(movie => {
      if (movie.backdrop_path == null) {
        movie.backdrop_path = 'https://placehold.co/780X439/292929/707070?text=.';
      } else {
        movie.backdrop_path = `https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`;
      }

      if (movie.overview.length > 350) {
        movie.overview = movie.overview.substring(0, 350) + '...';
      }

      movieInfo.push(new Movie(movie.original_title, movie.overview, movie.poster_path, movie.backdrop_path));
    });

    return movieInfo;
  } catch (error) {
    console.error(error);
    error.message = "Movie Information not Found";
    response.status(501).send(error.message);
  }
}

class Movie {
  constructor(title, overview, poster, backdrop) {
    this.title = title;
    this.overview = overview;
    this.poster = poster;
    this.backdrop = backdrop;
  }
}

module.exports = getLocationMovies;