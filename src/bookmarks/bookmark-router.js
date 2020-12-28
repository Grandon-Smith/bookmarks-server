const express = require('express');
const BOOKMARKS = require('../store');
const logger = require('../logger')
const bodyParser = express.json();
const bookmarkRouter = express.Router();
const {v4: uuid} = require('uuid');
const BookmarksService = require('./bookmarks-service')
const knex = require('knex')
const path = require('path')


bookmarkRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        BookmarksService.getAllBookmarks(
            req.app.get('db')
        )
        .then(bookmarks => {
            res.json(bookmarks)
        })
        .catch(next)
    })
    // .post(bodyParser, (req, res) => {
    //     const {title, url, rating, description} = req.body;
    //     if(!title) {
    //         logger.error(`title is required`);
    //         return res.status(400).send('title Invalid input')
    //     }if(!url) {
    //         logger.error(`url is required`);
    //         return res.status(400).send('url Invalid input')
    //     }if(!rating) {
    //         logger.error(`rating is required`);
    //         return res.status(400).send('rating Invalid input')
    //     }if(!description) {
    //         logger.error(`desc is required`);
    //         return res.status(400).send('description Invalid input')
    //     }
    //     const bookmark = {
    //         id: uuid(),
    //         title,
    //         url,
    //         rating,
    //         description,
    //     };
    //     BOOKMARKS.push(bookmark);
    //     logger.info(`card with id ${bookmark.id} was created`);
    //     res.status(201)
    //         .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
    //         .json(bookmark);
    // });

bookmarkRouter
    .route('/bookmarks/:bookmark_id')
    .get((req, res, next) => {

        const { bookmark_id } = req.params
        BookmarksService.getById(
            req.app.get('db'),
            bookmark_id
        )
        .then(bookmark => {
            if(!bookmark) {
                return res.status(404).json({
                    error: { message: `bookmark doesn't exist` }
                })
            }
            res.json(bookmark)
            next()
        })
    })
    // .delete((req, res) => {
    //     const { id } = req.params;
    //     const bookmarkIndex = BOOKMARKS.findIndex(book => book.id == id);
    //     if (bookmarkIndex === -1) {
    //         logger.error(`card with id ${id} wasn't found!`);
    //         return res.status(404).send('Card not found')
    //     }
    //     BOOKMARKS.splice(bookmarkIndex, 1);
    //     logger.info(`Card with id ${id} was deleted`);
    //     res.status(204).end();
    // });

    module.exports = bookmarkRouter;