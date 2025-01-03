const { test, expect, beforeAll, afterAll } = require('@jest/globals');
const app = require('../server/index');
const request = require('supertest');
const repository = require('../repository/repository')
const { ObjectId } = require('mongodb')

const loginOK = {
    email: "contato@cleverson.com.br",
    password: "123456", 
}

const loginNOK = {
    email: "contato@cleverson.com.br",
    password: "1234", 
}

let token = ''
const tokenBlacklist = new ObjectId().toHexString()


beforeAll( async () =>{
    process.env.PORT = 4001

    const response = await request(app)
            .post('/login/')
            .set('Content-type', 'application/json')
            .send(loginOK)

    token= response.body.token

    await repository.blackListToken(tokenBlacklist)
})

afterAll( async () =>{
    app.close()
})

test('POST /login/ 200 OK', async () => {

    const response = await request(app)
            .post('/login/')
            .set('Content-type', 'application/json')
            .send(loginOK)

    expect(response.status).toEqual(200);
    expect(response.body.token).toBeTruthy();
})

test('POST /login/ 422 UNPROCESSABLE ENTITY', async () => {

    loginOK.data = new Date()

    const response = await request(app)
            .post('/login/')
            .set('Content-type', 'application/json')
            .set(loginOK)

    expect(response.status).toEqual(422);
})

test('POST /login/ 401 UNAUTHORIZED', async () => {

    const response = await request(app)
            .post('/login/')
            .set('Content-type', 'application/json')
            .send(loginNOK)

    expect(response.status).toEqual(401);
})

test('POST /logout/ 200 OK', async () => {

    const response = await request(app)
            .post('/logout/')
            .set('Content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200);
})

test('POST /logout/ 401 ', async () => {

    const response = await request(app)
            .post('/logout/')
            .set('Content-type', 'application/json')
            .set('authorization', `Bearer ${token}1`)

    expect(response.status).toEqual(401);
})

test('POST /logout/ 401 (BLACKLIST)', async () => {

    const response = await request(app)
            .post('/logout/')
            .set('Content-type', 'application/json')
            .set('authorization', `Bearer ${tokenBlacklist}`)

    expect(response.status).toEqual(401);
})