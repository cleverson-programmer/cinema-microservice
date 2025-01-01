//Em desenvolvimento sempre que for iniciar o banco tem que passar o caminho de onde está salvo os dados de configuração do banco: mongod --dbpath C:\Users\clevi\Desktop\cinema-service\cinema-catalog-service\data --port 27018

const cinemaCatalog = require('./api/cinemaCatalog')
const repository = require('./repository/repository')
const server = require('./server/server')


async function dependencies (){
    try{
        //Fazendo setup de configuração para aclopar no servidor nossa api e nosso modulo de manipulação do ao banco
        //Inversão de depêndencias, módulos separados falicitando testes e integração no final
        await server.start(cinemaCatalog, repository)
    }
    catch(error){
        console.error(error)
    }
}

dependencies()