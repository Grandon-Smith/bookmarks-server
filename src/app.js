require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const BOOKMARKS = require('./store');
const logger = require('./logger')
const bodyParser = express.json();

const app = express();

const morganOption = (NODE_ENV === 'production')
? 'tiny'
: 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      logger.error(`Unauthorized request to path: ${req.path}`);
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
});

app.get('/', (req, res) => {
    res.send('Hello, world!')
});

app.get('/bookmarks', (req, res) => {
    res.json(BOOKMARKS)
});

app.get('/bookmarks/:id', (req, res) => {
    const { id } = req.params;
    const bookmark = BOOKMARKS.find(book => book.id == id)
    if(!bookmark) {
        logger.error(`bookmark with id of ${id} was not found`);
        return res.status(404).send('bookmark not found');
    }
    return res.json(bookmark)
});

app.post('/bookmarks')

module.exports = app;