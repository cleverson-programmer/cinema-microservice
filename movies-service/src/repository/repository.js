//Toda a lógica de manipulação de dados fica aqui, para isso usa o nosso database que faz a conexão com o servidor

const database = require('../config/database');
const { ObjectId } = require('mongodb');

async function getAllMovies() {
    const db = await database.connect();
    return db.collection('movies').find().toArray();
}

async function getMovieById(id) {
    const db = await database.connect();
    return db.collection('movies').findOne({ _id: new ObjectId(id) });
}

async function getMoviePremieres() {
    const monthAgo = new Date();
    monthAgo.setMonth(-1);

    const db = await database.connect();
    return db.collection('movies').find({ dataLancamento: { $gte: monthAgo } }).toArray();
}

module.exports = { getAllMovies, getMovieById, getMoviePremieres }