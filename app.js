require('dotenv').config();
var cors = require('cors');
var transactionRouter = require('./routes/transaction');

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, { dbName: 'Tracker'});
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(cors())

app.use(express.json());

app.use('/transaction', transactionRouter)

app.listen(3001, () => {
    console.log(`Server Started at ${3001}`)
})