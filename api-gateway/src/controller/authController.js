const jwt = require('jsonwebtoken')
const repository = require('../repository/repository')
const schema = require('../schemas/login')

async function doLogin( req, res, next){
    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await repository.getUser(email, password)

        //NESSA ETAPA FAZEMOS A ASSINATURA DO TOKEN, PASSANDO ALGUM DADO COMO O ID DO USUÁRIO POR EX(ou id de sessão por ex) DEPOIS PASSAMOS O NOSSO SEGREDO E POR FIM PASSAMOS AS OPÇÕES DO JWT QUE É O ALGORITIMO QUE VAI SER USADO PARA TRANSFORMAR EM BASE 64 (NO CASO O PADRÃO É O HS256 QUE É USADO QUANDO NÃO PASSAMOS NADA COMO SEGUNDO PARAMETRO) O TOKEN E O TEMPO DE EXPIRAÇÃO DO TOKEN
        const token = jwt.sign(
            {userId: user._id, profileId: user.profileId}, 
            process.env.SECRET, 
            {expiresIn: parseInt(process.env.EXPIRES)})

        res.json({token})
    }catch(err){
        res.sendStatus(401)
    }
}

//Verifica se veio um token de autenticção no cabeçalho da requisição, se não veio só continua pq quem verifica esse token é a função validateToken. Fazemos o replace para passar o Bearer indicando que é um token do tipo Bearer. Fazemos a verificação na blackList para ver se este token está incluso na blackList, se estiver incluso retornamos o status 401 não autorizado
async function validateBlackList(req, res, next){
    let token = req.headers['authorization'];
    if(!token) return next()

    token = token.replace('Bearer ', '')
    const isBlackListed = await repository.checkBlackList(token)

    if(isBlackListed){
        return res.sendStatus(401)
    } else{
        next()
    }
}

async function validateLoginSchema(req, res, next){

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


//Para fazer logout em apiRestFull sem login de sessão, (api unserveless) apenas com o token de autenticação, tem que adicionar uma blacklist para invalidar esse token, pois não tem como cancelar esse token pois não temos sessão! Mas poderiamos criar uma sessão de usuários para saber quem está logado no momento por ex

async function doLogout(req,res,next){
    let token = req.headers['authorization'];
    token = token.replace('Bearer ', '')

    //Adicionando o token de quem está chamando o logout na blackList
    await repository.blackListToken(token)
    res.sendStatus(200)
}

module.exports = { doLogin, doLogout, validateToken, validateBlackList, validateLoginSchema }