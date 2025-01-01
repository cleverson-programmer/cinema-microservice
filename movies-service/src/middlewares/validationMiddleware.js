const { schema } = require("../schemas/movieSchema")
const jwt = require('jsonwebtoken')

const ADMIN_PROFILE = 1

function validateMovie(req, res, next){

    const { error } = schema.validate(req.body)
    if(error){
        const { details } = error
        //Status 422 é quando recebe uma entidade no corpo da requisição que está inválida, não segue a regra de negócio da aplicação
        return res.status(422).json(details.map( m => m.message))
    }

    //Se passou na validação já avança e manda executar o proximo middleware
    next()
}

async function validateToken(req, res, next){
    let token = req.headers['authorization'];
    if(!token) return res.sendStatus(401)

    //No replace para colocar o Bearer tem que ter um ESPAÇO VAZIO DEPOIS DO BEARER
    token = token.replace('Bearer ', '')

    try{
        //Verificando o token
        const { userId, profileId } = jwt.verify(token, process.env.SECRET)

        //Guarda na resposta o token
        res.locals.userId = userId
        res.locals.profileId = profileId

        next()
    }
    catch(err){
        console.log(err)
        res.sendStatus(401)
    }
}

//Função para verificar se o usuário tem permissões de admin ou não
function validateAdmin(req, res, next){
    const { profileId } = res.locals;

    if(profileId == ADMIN_PROFILE)
        next()
    else
    //Status 403 forbidden, autenticado mas com permissão negada
        res.sendStatus(403)
}

module.exports = { validateMovie, validateToken, validateAdmin}