module.exports = (app, repository) =>{
    app.get('/movies/premieres', async (req, res, next) =>{
        const movies = await repository.getMoviePremieres()
        res.json(movies)
    })

    app.get('/movies/:id', async (req, res, next) =>{
        const id = req.params.id;
        const movie = await repository.getMovieById(id)
        if(!movie) return res.sendStatus(404)
        
        res.json(movie)
    })

    app.get('/movies', async (req, res, next) =>{
        const movies = await repository.getAllMovies()
        res.json(movies)
    })
}