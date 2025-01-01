const { validateToken } = require('../middlewares/validationMiddleware')

module.exports = (app, repository) =>{

    //Listar todas as sessões do filme escolhido na cidade especificada
    app.get('/cities/:cityId/movies/:movieId', validateToken, async (req, res, next) =>{
        const movieId = req.params.movieId
        const cityId = req.params.cityId
        const sessions = await repository.getMovieSessionsByCityId(movieId, cityId )
        if(!sessions) return res.sendStatus(404)

        res.json(sessions)
    })

    //Todos os filmes em exibição em uma cidade específica
    app.get('/cities/:cityId/movies', validateToken, async (req, res, next) =>{
        const id = req.params.cityId
        const movies = await repository.getMoviesByCityId(id)
        if(!movies) return res.sendStatus(404)
        
        res.json(movies)
    })

    //Listar todos os cinemas de uma cidade
    app.get('/cities/:cityId/cinemas', validateToken, async (req, res, next) =>{
        const cityId = req.params.cityId
        const cinemas = await repository.getCinemasByCityId(cityId)
        if(!cinemas) return res.sendStatus(404)

        res.json(cinemas)
    })

    //Listar todas as cidades que possuem a rede de cinema
    app.get('/cities', validateToken, async (req, res, next) =>{
        const cities = await repository.getAllCities()
        res.json(cities)
    })

    //Listar todas as sessoes do filme escolhido no cinema especificado
    app.get('/cinemas/:cinemaId/movies/:movieId', validateToken, async (req, res, next) =>{
        const movieId = req.params.movieId
        const cinemaId = req.params.cinemaId
        const sessions = await repository.getMovieSessionsByCinemaId(movieId, cinemaId)
        if(!sessions) return res.sendStatus(404)

        res.json(sessions)
    })

    //Listar todos filmes em exibição no cinema especificado
    app.get('/cinemas/:cinemaId/movies', validateToken, async (req, res, next) =>{
        const cinemaId = req.params.cinemaId
        const movies = await repository.getMoviesByCinemaId(cinemaId)
        if(!movies) return res.sendStatus(404)

        res.json(movies)
    })

}