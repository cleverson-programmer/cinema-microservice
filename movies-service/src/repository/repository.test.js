const { test, expect, beforeAll } = require('@jest/globals')
const repository = require('./repository')

let testMovieId = null;

beforeAll( async () =>{
    const movies = await repository.getAllMovies()

    testMovieId = movies[0]._id
})

test('getAllMovies', async () => {
    const movies = await repository.getAllMovies();
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();
})

test('getMovieById', async () => {
    const movie = await repository.getMovieById(testMovieId);
    expect(movie).toBeTruthy();
    expect(movie._id).toEqual(testMovieId);
})

test('getMoviePremieres', async () => {
    const monthAgo = new Date();
    monthAgo.setMonth(-1);

    const movies = await repository.getMoviePremieres();
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();
    expect(movies[0].dataLancamento.getTime()).toBeGreaterThanOrEqual(monthAgo.getTime());
})


