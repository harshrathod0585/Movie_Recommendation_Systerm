from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)

# Read the movie data
def recommend(movie):
    movie_index=movies[movies['id']==movie].index[0]
    recommended_movies=[]
    movies_list=sorted(list(enumerate(similarity[movie_index])),key=lambda x : x[1],reverse=True)[1:101]
    for i in movies_list:
        movies_data = {
        "id": int(movies['id'].iloc[i[0]]),
        "title": movies['title'].iloc[i[0]],
        "poster_path": movies['poster_path'].iloc[i[0]],
        "tags": movies['tags'].iloc[i[0]]
        }
        recommended_movies.append(movies_data)
    return recommended_movies

movies = pd.read_csv('new_movies.csv')
similarity = pickle.load(open('similarity.pkl','rb'))

@app.route('/api/movies', methods=['GET'])
def get_movies():
    # Structure the movie data to return only necessary fields
    movies_data = {
        "id": movies['id'].tolist(),
        "title": movies['title'].tolist(),
        "poster_path": movies['poster_path'].tolist(),
        "tags": movies['tags'].tolist()
         # Assuming there is a 'tags' column in your CSV
    }
    # print(movies_data)
    return movies_data


@app.route('/api/movies/<int:movie_id>/similar', methods=['GET'])
def get_similar_movies(movie_id):
    similar_movies = recommend(movie_id)
    return jsonify(similar_movies)


@app.route('/api/movies/<int:movie_id>', methods=['GET'])
def get_selected_movie(movie_id):
    movie_index=movies[movies['id']==movie_id].index[0]
    selected_movie={
        "id": int(movies['id'].iloc[movie_index]),
        "title": movies['title'].iloc[movie_index],
        "poster_path": movies['poster_path'].iloc[movie_index],
        "tags": movies['tags'].iloc[movie_index]
    }
    print(selected_movie)
    return jsonify(selected_movie)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
