const { ObjectId } = require("mongodb");

const cinemaCatalog = [{
  "cidade": "Gravataí",
  "uf": "RS",
  "cinemas": []
}, {
  "cidade": "Porto Alegre",
  "uf": "RS",
  "pais": "BR",
  "cinemas": [{
      "_id":new ObjectId("675b4b97372666a406893bf9") ,
      "nome": "Cinemark Bourbon Ipiranga",
      "salas": [{
          "nome": 1,
          "sessoes": [{
              "data": new Date("2024-12-16T09:00:00Z"),
              "idFilme":"675b4b97372666a406893bf9",
              "filme": "Vingadores: Ultimato",
              "valor": 25,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": false
              }]
          }, {
              "data": new Date("2024-12-16T11:00:00Z"),
              "idFilme": new ObjectId("675b4b97372666a406893bf9"),
              "filme": "Vingadores: Ultimato",
              "valor": 25,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": true
              }]
          }, {
              "data": new Date("2024-12-16T13:00:00Z"),
              "idFilme": new ObjectId("675b4b97372666a406893bfb"),
              "filme": "Matrix",
              "valor": 20,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": false
              }, {
                  "numero": 2,
                  "disponivel": true
              }]
          }]
      }, {
          "nome": 2,
          "sessoes": [{
              "data": new Date("2024-12-16T09:00:00Z"),
              "idFilme": new ObjectId("675b4b97372666a406893bfb"),
              "filme": "Matrix",
              "valor": 25,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": false
              },]
          }, {
              "data": new Date("2024-12-17T11:00:00Z"),
              "idFilme": new ObjectId("675b4b97372666a406893bfa"),
              "filme": "O poderoso Chefão",
              "valor": 25,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": true
              },]
          }, {
              "data": new Date("2024-12-17T13:00:00Z"),
              "idFilme": new ObjectId("675b4b97372666a406893bfa"),
              "filme": "O poderoso Chefão",
              "valor": 20,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": false
              }, {
                  "numero": 2,
                  "disponivel": true
              }]
          }]
      }]
  }, {
      "_id": new ObjectId("675b4b97372666a406893bf9"),
      "nome": "GNC Lindóia",
      "salas": [{
          "nome": 100,
          "sessoes": [{
              "data": new Date("2024-12-16T19:00:00Z"),
              "idFilme": new ObjectId("675b4b97372666a406893bf9"),
              "filme": "Vingadores: Ultimato",
              "valor": 25,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": false
              }]
          }, {
              "data": new Date("2024-12-17T11:00:00Z"),
              "idFilme": new ObjectId("675b4b97372666a406893bf9"),
              "filme": "Vingadores: Ultimato",
              "valor": 25,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": true
              }]
          }, {
              "data": new Date("2024-12-16T13:00:00Z"),
              "idFilme": new ObjectId("675b4b97372666a406893bfb"),
              "filme": "Matrix",
              "valor": 20.00,
              "assentos": [{
                  "numero": 1,
                  "disponivel": true
              }, {
                  "numero": 2,
                  "disponivel": false
              }, {
                  "numero": 2,
                  "disponivel": true
              }]
          }]
      }]
  }]
}]

//Quais cidades tem a franquia de cinema
function getAllCities() {
    return cinemaCatalog.map(catalog => {
        return{
            _id: new ObjectId("675b4b97372666a406893bfb"),
            pais: catalog.pais,
            uf: catalog.uf,
            cidade: catalog.cidade
        }
    })
}

//Quais cinemas tem em uma cidade
function getCinemasByCityId(cityId){
    if(cityId < 0) return null;
    return cinemaCatalog[cinemaCatalog.length - 1].cinemas
}

//Quais filmes tem em um cinema de uma cidade
function getMoviesByCinemaId(cinemaId){
    if(cinemaId < 0) return null

    return getCinemasByCityId().map( cinema =>{
        return{
            titulo: cinema.salas[0].sessoes[0].filme,
            _id: cinema.salas[0].sessoes[0].idFilme
        }
    })
}

//Quais filmes tem em determinada cidade
function getMoviesByCityId(cityId){
    return getMoviesByCinemaId(cityId)
}


//Sessões de um determinado filme em uma determinada cidade
function getMovieSessionsByCityId(movieId, cityId){
    if(cityId < 0 || movieId < 0) return null

    return getCinemasByCityId().map( cinema =>{
        return{
            titulo: cinema.salas[0].sessoes[0].filme,
            _id: cinema.salas[0].sessoes[0].idFilme,
            cinema: cinema.nome,
            idCinema: cinema._id,
            sala: cinema.salas[0].nome,
            sessao: cinema.salas[0].sessoes[0]
        }
    })

}

//Quer procurar por um cinema em especifico quais filmes estão passando
async function getMovieSessionsByCinemaId(movieId, cinemaId){
    return getMovieSessionsByCityId(movieId, cinemaId)
}

module.exports = { 
    getAllCities, 
    getCinemasByCityId, 
    getMoviesByCinemaId, 
    getMoviesByCityId, 
    getMovieSessionsByCityId, 
    getMovieSessionsByCinemaId

}