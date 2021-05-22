//Dependencies 
const express = require('express');
const path = require('path');
const fs = require('fs');

//Set up Express App
const app = express();
const PORT = 3000;

let notes = require('./db/db.json');

//=========================================================================================
//Start express app to handle data parsing
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//=========================================================================================
//Route methods, GET request route to send user to first page, then second page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

//=========================================================================================
//Display all notes, route handlers
app.get('/api/notes', (req, res) => res.json(notes));
app.post('/api/notes', (req, res) => {
    const createNote = req.body;

    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        notes = JSON.parse(data);
        createNote.id = parseInt(notes.length + 1);
        notes.push(createNote);

        console.log(notes);

        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(notes);
        });
    });
});

//=========================================================================================
//Route DELETE request
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    notes = notes.filter(function (notes) {
        return notes.id != req.params.id;
    });

    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(notes);
    });
});

//Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening of PORT: ${PORT}`));