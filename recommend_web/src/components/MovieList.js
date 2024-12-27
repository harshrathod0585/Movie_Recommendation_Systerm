import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/api/movies')
      .then((response) => {
        const moviesData = response.data.id.map((id, index) => ({
          id,
          title: response.data.title[index],
          poster_path: response.data.poster_path[index],
          tags: response.data.tags[index],
        }));
        setMovies(moviesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="movie-list">
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-card"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
                className="movie-image"
              />
              <h3>{movie.title}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
