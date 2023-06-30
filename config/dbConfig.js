const mongoose = require('mongoose');
const logger = require('../utils/logger')
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

function connectToMongoDB() {
    mongoose.connect(MONGO_URI);

    mongoose.connection.on('connected', () => {
        logger.info('Connected to MongoDB successfully');
    });

    mongoose.connection.on('error', (err) => {
        logger.info('Error connecting to MongoDB', err);
    })
}

module.exports = { connectToMongoDB };