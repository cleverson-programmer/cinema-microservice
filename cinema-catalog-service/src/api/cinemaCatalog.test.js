const { test, expect, beforeAll, afterAll } = require('@jest/globals');
const server = require('../server/server');
const request = require('supertest');
const cinemaCatalog = require('./cinemaCatalog')
const repositoryMock = require('../repository/__mocks__/repository')

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
    process.env.PORT = 3004
    app = await server.start(cinemaCatalog, repositoryMock );
})

afterAll( async () =>{
   await server.stop()
})

test('GET /cities 200 OK', async () => {
    const response = await request(app).get('/cities').set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeTruthy();
})

test('GET /cities 401 INVALID TOKEN', async () => {
    const response = await request(app).get('/cities').set('authorization', `Bearer 3`);
    expect(response.status).toEqual(401);
})

test('GET /cities 401 UNAUTHORIZED', async () => {
    const response = await request(app).get('/cities')
    expect(response.status).toEqual(401);
})

test('GET /cities/:cityId/movies 200 OK', async () => {
    const testCityId = '1'
    const response = await request(app).get(`/cities/${testCityId}/movies`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy()
})

test('GET /cities/:cityId/movies 401 UNAUTHORIZED', async () => {
    const testCityId = '1'
    const response = await request(app).get(`/cities/${testCityId}/movies`)
    expect(response.status).toEqual(401);

})

test('GET /cities/:cityId/movies 404 NOT FOUND', async () => {
    const testCityId = '-1'
    const response = await request(app).get(`/cities/${testCityId}/movies`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(404);
})


test('GET /cities/:cityId/movies/:movieId 200 OK', async () => {
    const testCityId = '1'
    const testMovieId = '2'
    const response = await request(app).get(`/cities/${testCityId}/movies/${testMovieId}`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
})

test('GET /cities/:cityId/movies/:movieId 401 UNAUTHORIZED', async () => {
    const testCityId = '1'
    const testMovieId = '2'
    const response = await request(app).get(`/cities/${testCityId}/movies/${testMovieId}`)
    expect(response.status).toEqual(401);
})

test('GET /cities/:cityId/movies/:movieId 404 NOT FOUND', async () => {
    const testCityId = '-1'
    const testMovieId = '-2'
    const response = await request(app).get(`/cities/${testCityId}/movies/${testMovieId}`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(404);
})

test('GET /cities/:cityId/cinemas 200 OK', async () => {
    const testCityId = '1'
    const response = await request(app).get(`/cities/${testCityId}/cinemas`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
})

test('GET /cities/:cityId/cinemas 401 UNATHORIZED', async () => {
    const testCityId = '1'
    const response = await request(app).get(`/cities/${testCityId}/cinemas`)
    expect(response.status).toEqual(401);
})

test('GET /cities/:cityId/cinemas 404 NOT FOUND', async () => {
    const testCityId = '-1'
    const response = await request(app).get(`/cities/${testCityId}/cinemas`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(404);
})

test('GET /cinemas/:cinemaId/movies 200 OK', async () => {
    const testCinemaId = '1'
    const response = await request(app).get(`/cinemas/${testCinemaId}/movies`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
})

test('GET /cinemas/:cinemaId/movies 401 UNATHORIZED', async () => {
    const testCinemaId = '1'
    const response = await request(app).get(`/cinemas/${testCinemaId}/movies`)
    expect(response.status).toEqual(401);
})

test('GET /cinemas/:cinemaId/movies 404 NOT FOUND', async () => {
    const testCinemaId = '-1'
    const response = await request(app).get(`/cinemas/${testCinemaId}/movies`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(404);
})

test('GET /cinemas/:cinemaId/movies/:movieId 200 OK', async () => {
    const testCinemaId = '1'
    const testMoviesId = '2'
    const response = await request(app).get(`/cinemas/${testCinemaId}/movies/${testMoviesId}`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
})

test('GET /cinemas/:cinemaId/movies/:movieId 401 UNAUTHORIZED', async () => {
    const testCinemaId = '1'
    const testMoviesId = '2'
    const response = await request(app).get(`/cinemas/${testCinemaId}/movies/${testMoviesId}`)
    expect(response.status).toEqual(401);
})

test('GET /cinemas/:cinemaId/movies/:movieId 404 NOT FOUND', async () => {
    const testCinemaId = '-1'
    const testMoviesId = '-2'
    const response = await request(app).get(`/cinemas/${testCinemaId}/movies/${testMoviesId}`).set('authorization', `Bearer ${adminToken}`);
    expect(response.status).toEqual(404);
})