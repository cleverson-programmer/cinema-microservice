const http = require('http')
const express = require('express')
const httpProxy = require('express-http-proxy')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')

const authController = require('../controller/authController')
//API-GATEWAY tem que ter o que é essêncial a todos os microserviços, as excessões ficam em cada microserviço


//Criando instância de app express
const app = express()

//Helmet aqui é redundante pq já estamos usando em cada dos microserviços, mas poderiamos deixar apenas aqui e tirar de lá. A lib do helmet adiciona camadas de seguranças contra 11 tipos de ataques padrões http, como todos os microserviços vão passar pelo gateway podemos colocar o helmet apenas aqui
app.use(helmet())

//Morgan é a lib que registra as requisições http que chegam ao servidor
app.use(morgan('dev'))

//Para trabalhar com cookies para autenticação por exemplo, trafegando entre microserviços
app.use(cookieParser())

//Adicionando bodyParser para permitir transmitir dados em formato json
//Adicionando o bodyParser aqui, podemos tirar dos microserviços
app.use(express.json())

//Cada microserviço já esta configurando seu próprio body-parser

//O gateway passa para o serviço a URL modificada, isso causa erro pois quando chega no app.use uma requisição ela é modificada e o que é passado para o middleware a seguir e apenas uma parte do path depois da barra, ou seja só passa o / fazendo um get direto na raiz
//Para resolver issso criamos uma propriedade que recebe uma função que retorna a URL original da requisição e passamos ela para nosso http proxy como parametro
const options = {
    proxyReqPathResolver: (req) =>{
        return req.originalUrl
    }
}

app.post('/login', authController.validateLoginSchema, authController.doLogin)


//Tudo vai passar pela validação para ver se o token atual do usuário está blacklistado
app.use(authController.validateBlackList)

app.post('/logout', authController.validateToken, authController.doLogout)

//Configurando os proxys
//Pode fazer essa configuração em um banco de dados caso tenha muitos microserviços
const moviesServiceProxy = httpProxy(process.env.MOVIES_API, options)
const catalogServiceProxy = httpProxy(process.env.CATALOG_API, options)

app.use('/movies', moviesServiceProxy)

//Expressão regular para definir o encaminhamento de rotas para cities ou cinemas
app.get(/cities|cinemas/i, catalogServiceProxy)

const server = app.listen(process.env.PORT, () =>{
    console.log(`API Gateway started at ${process.env.PORT}`)
})

module.exports = server 