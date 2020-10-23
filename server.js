const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const Note = require('./db/Note');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static("public"));


// =============== Routes =============

app.get("/api/notes", function (req, res) {
    return res.json(db);
});

app.post("/api/notes", function (req, res) {
    const { title, text } = req.body;
    const note = new Note(title, text);
    db.push(note);
    fs.writeFile("./db/db.json", JSON.stringify(db), 'utf8', function(err){
        if (err) throw err; 
    });
    fs.readFile("./db/db.json", "utf8", function(err, data) {
        if (err) throw err;
        res.json(db);
    });
});

app.delete("/api/notes/:id", function (req, res) { 
    let id = req.params.id;
    let newDb = JSON.stringify(db.filter(note => note.id !== id));
    async function refreshNotes(notesFile) {
        try {
            await fs.writeFile("./db/db.json", notesFile, 'utf8', function(err){
                if (err) throw err; 
            });
        } catch (err) {
            console.log(err);
        } finally {
            fs.readFile("./db/db.json", "utf8", function(err, data) {
                if (err) throw err; 
                res.json(data);
                location.reload();
                // res.sendFile(path.join(__dirname, "./public/notes.html"));
            });
        }
    } 
    refreshNotes(newDb);
    // res.json(db);      
});






app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// ================ Listener ===================

app.listen(PORT, () => { console.log('App listening on PORT ' + PORT)});