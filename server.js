// Importing the express package, the fs package, and the path package
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const uuid = require('./public/assets/js/uuid');
// designate port to 3000 
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static assets from the public folder
app.use(express.static('public'));

// Path to the data file
const dataFilePath = path.join(__dirname, 'db', 'db.json');

// Get notes route 
app.get('/api/notes', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to read notes data, please try again' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});


// Save a new note to the database with the post, stuggled with this post route, the get one was so much easier, finally got it to work though
app.post('/api/notes', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    // If there is an error reading the file, sending the user this error
        if (err) {
      res.status(500).json({ error: 'Unable to read notes data, please try again' });
    } else {
      const notes = JSON.parse(data);
      const newNote = req.body;

      // Setting the ID of the new note using the uuid js file
        newNote.id = uuid();

      notes.push(newNote);
        // Writing the updated notes array back to the file
      fs.writeFile(dataFilePath, JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: 'Unable to save note, please try again' });
        // If there is no error, sending the user the new note
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

// for the extra credit points here is the delete route, took alot of reading on stack overflow, but I got it to work
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
// reading the data file and presenting error if there is one
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to read notes data, please try again' });
    } else {
      const notes = JSON.parse(data);

      const noteIndex = notes.findIndex((note) => note.id === noteId);
// if the note is found, splice it out of the array, splice method was fun to learn about 
      if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
// writing the updated notes array back to the file
        fs.writeFile(dataFilePath, JSON.stringify(notes, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: 'Unable to save note, please try again' });
          } else {
            res.json({ message: 'Note deleted, way to go!' });
          }
        });
        // if the note is not found, showing the user this error
      } else {
        res.status(404).json({ error: 'Note not found, are you sure it exists?' });
      }
    }
  });
});
// route to the notes.html page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });
// port listener for the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});