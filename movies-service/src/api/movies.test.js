const { test, expect, beforeAll, afterAll} = require('@jest/globals');
const server = require('../server/server');
const request = require('supertest');
const movies = require('./movies')
const repositoryMock = require('../repository/__mocks__/repository');

//Mockando nossa autenticação para corrigir os erros nas rotas que são autenticadas, a autenticação já está sendo testada na API GATEWAY
const adminToken = '1'
const guestToken = '2'

//O caminho do nosso módulo de token, função que vai retornar um obj de verificação no lugar do original
jest.mock('../node_modules/jsonwebtoken', () =>{
    //Verificando se o usuário é admin ou não, isso foi implementado na parte de autenticação na API GATEWAY, aqui vamos mockar o token e sempre vai ser admin
    return {
        verify: (token) =>{
            if(token === adminToken) return {userId: 1 , profileId: 1}//ADMIN
            else if(token === guestToken) return {userId: 2 , profileId: 2}//GUEST
            else throw new Error('!Invalid token')
        }
    }
})

let app = null

beforeAll( async () =>{
    process.env.PORT = 3003
    app = await server.start(movies, repositoryMock );
})

afterAll( async () =>{
   await server.stop()
})

//Testando a rota se retorna os dados corretamente
test('GET /movies 200 OK', async () => {
    //Na rota temos que setar o cabeçalho authorization para poder validar, pois agora temos autenticação nas rotas diretamente na API GATEWAY
    const response = await request(app).get('/movies').set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeTruthy();
})


//Testando se veio o token na rota seja ele admin ou guest
test('GET /movies 401 UNAUTHORIZED (NOT TOKEN)', async () => {
    //Na rota temos que setar o cabeçalho authorization para poder validar, pois agora temos autenticação nas rotas diretamente na API GATEWAY
    const response = await request(app).get('/movies')
    expect(response.status).toEqual(401);
})

//Testando se veio o token na rota seja ele admin ou guest
test('GET /movies 401 INVALID TOKEN', async () => {
    //Na rota temos que setar o cabeçalho authorization para poder validar, pois agora temos autenticação nas rotas diretamente na API GATEWAY
    const response = await request(app).get('/movies').set('authorization', `Bearer 3`);
    expect(response.status).toEqual(401);
})


test('GET /movies/:id 200 OK', async () => {
    const testMovieId = '1'
    const response = await request(app).get(`/movies/${testMovieId}`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy()
})

test('GET /movies/:id 401 UNAUTHORIZED', async () => {
    const testMovieId = '1'
    const response = await request(app).get(`/movies/${testMovieId}`).set('authorization', `Bearer `);
    expect(response.status).toEqual(401);
})

//Testando se retorna o erro 404 corretamente quando passamos um filme não existente
test('GET /movies/:id 404 NOT FOUND', async () => {
    const testMovieId = '-1'
    const response = await request(app).get(`/movies/${testMovieId}`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(404);
})

test('GET /movies/premieres 200 OK', async () => {
    const response = await request(app).get('/movies/premieres').set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeTruthy();
})

test('GET /movies/premieres 401 UNATHORIZED', async () => {
    const response = await request(app).get('/movies/premieres').set('authorization', `Bearer `);
    expect(response.status).toEqual(401);
})

test('POST /movies 201 OK', async () => {
    const movie = {
        titulo: "Missão Impossível",
        sinopse: "Ethan Hunt has a new mission, he needs to save the planet before a bomb explodes",
        duracao: 181,
        dataLancamento: new Date(),
        imagem: "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/06/bancos-de-imagens-gratuitos-1024x538.png",
        categorias: [
          "Ação",
          "Aventura",
        ]
    }

    const response = await request(app)
            .post('/movies')
            .set('Content-type', 'application/json')
            .set('authorization', `Bearer ${adminToken}`)
            .send(movie)

    expect(response.status).toEqual(201);
    expect(response.body).toBeTruthy();
})

test('POST /movies 401 UNATHORIZED', async () => {
    const movie = {
        titulo: "Missão Impossível",
        sinopse: "Ethan Hunt has a new mission, he needs to save the planet before a bomb explodes",
        duracao: 181,
        dataLancamento: new Date(),
        imagem: "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/06/bancos-de-imagens-gratuitos-1024x538.png",
        categorias: [
          "Ação",
          "Aventura",
        ]
    }

    const response = await request(app)
            .post('/movies')
            .set('Content-type', 'application/json')
            .set('authorization', `Bearer`)
            .send(movie)

    expect(response.status).toEqual(401);
})

test('POST /movies 403 FORBIDDEN', async () => {
    const movie = {
        titulo: "Missão Impossível",
        sinopse: "Ethan Hunt has a new mission, he needs to save the planet before a bomb explodes",
        duracao: 181,
        dataLancamento: new Date(),
        imagem: "https://rockcontent.com/br/wp-content/uploads/sites/2/2020/06/bancos-de-imagens-gratuitos-1024x538.png",
        categorias: [
          "Ação",
          "Aventura",
        ]
    }

    const response = await request(app)
            .post('/movies')
            .set('Content-type', 'application/json')
            .set('authorization', `Bearer ${guestToken}`)
            .send(movie)

    expect(response.status).toEqual(403);
})

test('POST /movies 422 UNPROCESSABLE ENTITY', async () => {
    const movie = { xyz: 'jhon'}

    const response = await request(app)
            .post('/movies')
            .set('Content-type', 'application/json')
            .set('authorization', `Bearer ${adminToken}`)
            .send(movie)

    expect(response.status).toEqual(422);
})

test('POST /movies 422 UNPROCESSABLE ENTITY (empty)', async () => {
    const movie = { }

    const response = await request(app)
            .post('/movies')
            .set('Content-type', 'application/json')
            .set('authorization', `Bearer ${adminToken}`)
            .send(movie)

    expect(response.status).toEqual(422);
})

test('DELETE /movies/:id 204 NO CONTENT', async () => {
    const id = '1'
    const response = await request(app).delete(`/movies/${id}`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(204);
})

test('DELETE /movies/:id 401 UNHATORIZED', async () => {
    const id = '1'
    const response = await request(app).delete(`/movies/${id}`).set('authorization', `Bearer `);
    expect(response.status).toEqual(401);
})


test('DELETE /movies/:id 403 FORBIDDEN', async () => {
    const id = '1'
    const response = await request(app).delete(`/movies/${id}`).set('authorization', `Bearer ${guestToken}`);
    expect(response.status).toEqual(403);
})