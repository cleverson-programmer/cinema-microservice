const movies = [
    {
        "_id": "675b4b97372666a406893bf9",
        "titulo": "Vingadores: Ultimato",
        "sinopse": "Os Vingadores precisam unir forças mais uma vez para desfazer o estrago causado por Thanos e salvar o universo.",
        "duracao": 181,
        "dataLancamento": new Date("2024-12-13T00:00:00.000Z"),
        "imagem": "https://upload.wikimedia.org/wikipedia/pt/f/fd/Avengers_Endgame.jpg",
        "categorias": [
          "Ação",
          "Aventura",
          "Ficção Científica"
        ]
      },
      {
        "_id": "675b4b97372666a406893bfa",
        "titulo": "O Poderoso Chefão",
        "sinopse": "A história da família Corleone e seus esforços para manter e expandir sua influência no mundo do crime organizado.",
        "duracao": 175,
        "dataLancamento":  new Date("1972-03-24T00:00:00.000Z"),
        "imagem": "https://upload.wikimedia.org/wikipedia/pt/0/03/The_Godfather%2C_The_Game.jpg",
        "categorias": [
          "Drama",
          "Crime"
        ]
      }
]

async function getAllMovies() {
    return movies
}

async function getMovieById(id) {

  if( id == -1 ) return null
  
  movies[0]._id = id
  return movies[0]
}

async function getMoviePremieres() {
    movies[0].dataLancamento = new Date()

    return [movies[0]]
}

module.exports = { getAllMovies, getMovieById, getMoviePremieres }