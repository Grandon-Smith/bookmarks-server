const express = require('express');
const BOOKMARKS = require('../store');
const logger = require('../logger')
const bodyParser = express.json();
const bookmarkRouter = express.Router();


bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(BOOKMARKS)
    })
    .post(bodyParser, (req, res) => {
        const {id, title, url, rating, description} = req.body;
        if(!id) {
            logger.error(`id is required`);
            return res.status(400).send('id Invalid input')
        }
        if(!title) {
            logger.error(`title is required`);
            return res.status(400).send('title Invalid input')
        }if(!url) {
            logger.error(`url is required`);
            return res.status(400).send('url Invalid input')
        }if(!rating) {
            logger.error(`rating is required`);
            return res.status(400).send('rating Invalid input')
        }if(!description) {
            logger.error(`desc is required`);
            return res.status(400).send('description Invalid input')
        }
        const bookmark = {
            id,
            title,
            url,
            rating,
            description,
        };
        BOOKMARKS.push(bookmark);
        logger.info(`card with id ${id} was created`);
        res.status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark);
    });

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = BOOKMARKS.find(book => book.id == id)
        if(!bookmark) {
            logger.error(`bookmark with id of ${id} was not found`);
            return res.status(404).send('bookmark not found');
        }
        return res.json(bookmark)
    })
    .delete((req, res) => {
        const { id } = req.params;
        const bookmarkIndex = BOOKMARKS.findIndex(book => book.id == id);
        if (bookmarkIndex === -1) {
            logger.error(`card with id ${id} wasn't found!`);
            return res.status(404).send('Card not found')
        }
        BOOKMARKS.splice(bookmarkIndex, 1);
        logger.info(`Card with id ${id} was deleted`);
        res.status(204).end();
    });

    module.exports = bookmarkRouter;