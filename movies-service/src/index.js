const movies = require('./api/movies')
const repository = require('./repository/repository')
const server = require('./server/server')


async function dependencies (){
    try{
        //Fazendo setup de configuração para aclopar no servidor nossa api e nosso modulo de manipulação do ao banco
        //Inversão de depêndencias, módulos separados falicitando testes e integração no final
        await server.start(movies, repository)
    }
    catch(error){
        console.error(error)
    }
}

dependencies()