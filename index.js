const express = require('express');
const mongoose = require('mongoose');
const app = express();
const notesRouter = require('./routes/notes.js');
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connecté à la bdd'));

app.use(express.json());

app.use('/notes', notesRouter);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
