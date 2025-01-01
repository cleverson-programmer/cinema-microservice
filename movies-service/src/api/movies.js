const {validateMovie, validateToken, validateAdmin} = require('../middlewares/validationMiddleware')
const logger = require('../config/logger')
const { log } = require('winston')

module.exports = (app, repository) =>{

    app.get('/movies/premieres', validateToken, async (req, res, next) =>{
        const movies = await repository.getMoviePremieres()
        res.json(movies)
    })

    app.get('/movies/:id', validateToken, async (req, res, next) =>{
        const id = req.params.id;
        const movie = await repository.getMovieById(id)
        if(!movie) return res.sendStatus(404)
        
        res.json(movie)
    })

    app.get('/movies', validateToken, async (req, res, next) =>{
        const movies = await repository.getAllMovies()
        res.json(movies)
    })

    //Valida o o token (se o usuário está identificado), valida se é admin e valida os dados do filme que serão cadastrados
    app.post('/movies', validateToken, validateAdmin, validateMovie, async (req, res, next) =>{
        const titulo = req.body.titulo
        const sinopse = req.body.sinopse
        const duracao = parseInt(req.body.duracao)
        const dataLancamento = new Date(req.body.dataLancamento)
        const imagem = req.body.imagem
        const categorias = req.body.categorias

        const result = await repository.addMovie({
            titulo,
            sinopse,
            duracao,
            dataLancamento,
            imagem,
            categorias
        })

        //Fazendo auditoria dos dados, passando o logger.info. Auditoria é um dos 3 pilares da segurança que são auditoria, autenticação e autorização
        //Serve para saber quem foi o administrador que deletou algum filme ou adicionou um novo filme por ex
        //Esse log audita quem adicionou o filme, qual filme e a data
        logger.info(`User ${res.locals.userId} add the movie ${result._id} at ${new Date()}`)

        res.status(201).json(result)
    })

    app.delete('/movies/:id', validateToken, validateAdmin, async (req, res, next) =>{
        const id = req.params.id
        const result = await repository.deleteMovie(id)

        logger.info(`User ${res.locals.userId} deleted the movie ${id} at ${new Date()}`)

        res.sendStatus(204)
    })

}
