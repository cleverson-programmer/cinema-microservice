const database = require('../config/database')
const { ObjectId } = require('mongodb')

//Quais cidades tem a franquia de cinema
async function getAllCities() {
    const db = await database.connect();

    //Fazendo um select no nosso banco pegando apenas dados especificos, para isso passamos um segundo parametro que é a projeção do find(). Para isso passa o campo e o valor 1, indicando que eu quero esse campo de cada objeto do meu banco
    return db.collection('cinemaCatalog')
        .find({})
        .project({ cidade: 1, uf:1, pais:1 })
        .toArray();
}

//Quais cinemas tem em uma cidade
async function getCinemasByCityId(cityId){
    const objCityId =  new ObjectId(cityId)
    const db = await database.connect();
    const city = await db.collection('cinemaCatalog')
            .findOne( {_id: objCityId}, {projection: {cinemas: 1} })
            return city.cinemas
}

//Quais filmes tem em um cinema de uma cidade
async function getMoviesByCinemaId(cinemaId){
    const objCinemaId =  new ObjectId(cinemaId)
    const db = await database.connect();

    //Para fazer essa consulta vamos usar uma função de agregação pois é uma consulta complexa, e precisamos apenas de dados específicos de dentro do array de objetos que contém subdocumentos com arrays. Na função aggregate passamos como primeiro parametro o array de pipeline de operações, ela retorna um cursos com os dados assim como find normal e que transformamos em array. Passando primeiro um filtro que busca um cinema com id que estou procurando. A segunda função unwind é a função de "desenrolar" que vai pegar o documento e retornar um novo array em memoria com todos os elemento, todos em um mesmo nível removendo a complexidade de hierarquia, ele retorna um novo objeto para cada elemento do array inicial EX:

    // {id: 1, frutas: ["maça", "laranja"]}, {id: 2, frutas: ["laranja", "banana"]}
    //RETORNA: {id:1, frutas: "maça"}, {id:1, frutas: "laranja"}, {id:2, frutas: "laranja"}, {id:2, frutas: "banana"}

    const group = await db.collection('cinemaCatalog')
            .aggregate([
                //Filtro da operação
                { $match: {"cinemas._id": objCinemaId} },
                //Operações para adentrar no documento
                { $unwind: "$cinemas"},
                { $unwind: "$cinemas.salas"},
                { $unwind: "$cinemas.salas.sessoes"},
                //removendo as duplicatas
                { $group: { _id: { titulo: "$cinemas.salas.sessoes.filme", _id: "$cinemas.salas.sessoes.idFilme"} }}
            ]).toArray()

    //Retorna o idFilme e o filme dentro de _id
    return group.map( g => g._id)
            
}

//Quais filmes tem em determinada cidade
async function getMoviesByCityId(cityId){
    const objCityId =  new ObjectId(cityId)
    const db = await database.connect();

    const group = await db.collection('cinemaCatalog')
            .aggregate([
                //Filtro da operação
                { $match: {"_id": objCityId} },
                //Operações para adentrar no documento
                { $unwind: "$cinemas"},
                { $unwind: "$cinemas.salas"},
                { $unwind: "$cinemas.salas.sessoes"},
                //removendo as duplicatas
                { $group: { _id: { titulo: "$cinemas.salas.sessoes.filme", _id: "$cinemas.salas.sessoes.idFilme"} }}
            ]).toArray()

    return group.map( g => g._id)
}


//Sessões de um determinado filme em uma determinada cidade
async function getMovieSessionsByCityId(movieId, cityId){
    const objCityId =  new ObjectId(cityId)
    const objMovieId =  new ObjectId(movieId)
    const db = await database.connect();

    const group = await db.collection('cinemaCatalog')
            .aggregate([
                //Filtro pela cidade escolhida
                { $match: {"_id": objCityId} },
                //Desenrolando de dentro de cinema as salas e sessoes, dentro de sessoes conseguimos capturar apenas as sessoes  do filme escolhido
                { $unwind: "$cinemas"},
                { $unwind: "$cinemas.salas"},
                { $unwind: "$cinemas.salas.sessoes"},
                { $match: {"cinemas.salas.sessoes.idFilme": objMovieId }},
                //Retornando o titulo, o id, sala e a sessão que está passando o filme
                { $group: { _id: { 
                    titulo: "$cinemas.salas.sessoes.filme",
                    _id: "$cinemas.salas.sessoes.idFilme",
                    cinemas: "$cinemas.nome",
                    idCinema: "$cinemas._id",
                    sala: "$cinemas.salas.nome",
                    sessao: "$cinemas.salas.sessoes"
                } }}
            ]).toArray()

    //Retirando o id do group e retornando os dados, fazer o group sem o id da erro!!
    return group.map( g => g._id)

}

//Quer procurar por um cinema em especifico quais filmes estão passando
async function getMovieSessionsByCinemaId(movieId, cinemaId){
    const objCinemaId =  new ObjectId(cinemaId)
    const objMovieId =  new ObjectId(movieId)
    const db = await database.connect();

    const group = await db.collection('cinemaCatalog')
            .aggregate([
                //Filtro pelo cinema escolhida
                { $match: {"cinemas._id": objCinemaId} },
                //Desenrolando de dentro de cinema as salas e sessoes, dentro de sessoes conseguimos capturar apenas as sessoes  do filme escolhido
                { $unwind: "$cinemas"},
                { $unwind: "$cinemas.salas"},
                { $unwind: "$cinemas.salas.sessoes"},
                { $match: {"cinemas.salas.sessoes.idFilme": objMovieId }},
                //Retornando o titulo, o id, sala e a sessão que está passando o filme
                { $group: { _id: { 
                    titulo: "$cinemas.salas.sessoes.filme",
                    _id: "$cinemas.salas.sessoes.idFilme",
                    cinemas: "$cinemas.nome",
                    idCinema: "$cinemas._id",
                    sala: "$cinemas.salas.nome",
                    sessao: "$cinemas.salas.sessoes"
                } }}
            ]).toArray()

    //Retirando o id do group e retornando os dados, fazer o group sem o id da erro!!
    return group.map( g => g._id)
}

module.exports = { 
    getAllCities, 
    getCinemasByCityId, 
    getMoviesByCinemaId, 
    getMoviesByCityId, 
    getMovieSessionsByCityId, 
    getMovieSessionsByCinemaId

}