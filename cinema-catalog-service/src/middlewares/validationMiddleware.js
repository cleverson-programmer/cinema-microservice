const jwt = require('jsonwebtoken')

async function validateToken(req, res, next){
    let token = req.headers['authorization'];
    if(!token) return res.sendStatus(401)

    //No replace para colocar o Bearer tem que ter um ESPAÇO VAZIO DEPOIS DO BEARER
    token = token.replace('Bearer ', '')

    try{
        //Verificando o token
        const { userId } = jwt.verify(token, process.env.SECRET)

        //Guarda na resposta o token
        res.locals.userId = userId

        next()
    }
    catch(err){
        console.log(err)
        res.sendStatus(401)
    }
}

module.exports = {validateToken}