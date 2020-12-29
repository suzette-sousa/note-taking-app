const express = require('express');
const router = express.Router();
const Note = require('../models/notes');

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({noteDate: 'descending'});
    res.json(notes);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
});

router.get('/:id', getNote, (req, res) => {
  res.send(res.note);
});

router.post('/create', async (req, res) => {
  const notes = new Note({
    noteContent: req.body.noteContent
  });
  try {
    const newNote = await notes.save();
    res.status(201).json(newNote);
  } catch(err) {
    res.status(400).json({message: 'Veuillez saisir ou saisir de nouveau votre note.'});
  }
});

router.delete('/:id/delete', getNote, async (req, res) => {
  try {
    await res.note.remove();
    res.json({message: 'Note supprimée'});
  } catch(err) {
    res.status(500).json({message: err.message});
  }
});

router.patch('/:id/edit', getNote, async (req, res) => {
  if(req.body.noteContent != null) {
    res.note.noteContent = req.body.noteContent;
  }
  try {
    const updatedNote = await res.note.save();
    res.json({updatedNote});
  } catch(err) {
    res.status(400).json({message: err.message});
  }
});

router.get('/search/:key', async (req,res) => {
  let note;
  try {
    const regex = new RegExp(req.params.key, 'i');
    note = await Note.find({noteContent: regex});
    res.send(note)
    if(note == null) {
      res.status(404).json({message: "Aucun résultat"})
    }
  } catch(err) {
    res.status(500).json({message: 'Note non trouvée'});
  }
});

async function getNote(req, res, next) {
  let note;
  try {
    note = await Note.findById(req.params.id);
    if(note == null) {
      return res.status(404).json({message: err.message})
    }
  } catch(err) {
    return res.status(500).json({message: 'Note non trouvée'});
  }
  res.note = note;
  next();
}

module.exports = router;
