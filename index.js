const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const Note = require('./models/notes')
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connecté à la bdd'));

//app.get('/notes', (req, res) => res.send(res));

app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
});

app.use(express.json());

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
