import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetching selected movie data
    axios
      .get(`http://127.0.0.1:5000/api/movies/${id}`)
      .then((response) => {
        setSelectedMovie(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie data:', error);
        setLoading(false);
      });

    // Fetching similar movies based on selected movie
    axios
      .get(`http://127.0.0.1:5000/api/movies/${id}/similar`)
      .then((response) => setSimilarMovies(response.data))
      .catch((error) => console.error('Error fetching similar movies:', error));
  }, [id]);

  // Loading or error states
  if (loading) return <p>Loading movie details...</p>;
  if (!selectedMovie) return <p>Movie details not found. Please try again.</p>;

  // Dynamic background image URL for the selected movie
  const backgroundImageUrl = `https://media.licdn.com/dms/image/D5612AQGy6sM0SJAdxg/article-cover_image-shrink_720_1280/0/1693150322893?e=2147483647&v=beta&t=tmyCkhGahTKcBOOftyXZLhkLjtUIkqio94iGE3Y670E`;

  return (
    <div
      className="movie-detail"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,  // Set the background image dynamically
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',  // Adjust text color for better contrast
      }}
    >
      <div className="movie-content">
        <h2>{selectedMovie.title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`}
          alt={selectedMovie.title}
          className="movie-image"
        />
        <h3>Similar Movies:</h3>
        <div className="similar-movie-list">
          {similarMovies.length > 0 ? (
            similarMovies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-image"
                />
                <h3>{movie.title}</h3>
              </Link>
            ))
          ) : (
            <p>No similar movies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
