const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeTestBookmarks } = require('./bookmarks.fixtures');

describe(`Bookmark Endpoint Testing`, () => {
    let db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_URL,
        })
        app.set('db', db)
    })
    after('disconnect form db', () => db.destroy())
    before('clean the table', () => db('bookmarks_test').truncate())
    afterEach('cleanup', () => db('bookmarks_test').truncate())

    describe(`GET /bookmarks endpoint`, () => {
        context(`Given no bookmarks in database`, () => {
            it(`Responds with 200 and empty list`, () => {
                return supertest(app)
                    .get('/bookmarks')
                    .expect(200, [])
            })
        })
        context('Given there are articles in the database', () => {
            const testBookmarks = makeTestBookmarks()
            beforeEach('insert bookmarks', () => {
                return db
                .into('bookmarks_test')
                .insert(testBookmarks)
            })

            it('responds with 200 and all of the bookmarks', () => {
                return supertest(app)
                .get('/bookmarks')
                .expect(200, testBookmarks)
            })
        })
    })
    describe.only(`GET /bookmarks/:bookmark_id endpoint`, () => {
        context(`Given no bookmarks in database`, () => {
            it(`Responds with 404`, () => {
                return supertest(app)
                    .get(`/bookmarks/${123}`)
                    .expect(404, { error: {message: `bookmark doesn't exist`} })
            })
        })
        context('Given there are bookmarks in the database', () => {
            const testBookmarks = makeTestBookmarks()

            beforeEach('insert bookmarks', () => {
                return db
                .into('bookmarks_test')
                .insert(testBookmarks)
            })

            it('responds with 200 and selected bookmark', () => {
                return supertest(app)
                .get(`/bookmarks/${1}`)
                .expect(200)
            })
        })
    })
})