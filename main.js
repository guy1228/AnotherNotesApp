const sqlite3 = require('sqlite3').verbose();
const readline = require('node:readline');
const db = new sqlite3.Database('notes.db');
const fs = require('fs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


  

//Creates the table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT NOT NULL,
            creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        }
    });
});

function insertNewNote(title, content) {
    db.run(`
        INSERT INTO notes (title, content)
        VALUES (?, ?)
    `, [title, content], function(err) {
        if (err) {
            return console.error(err.message);
        }
        const noteId = this.lastID;
        console.log(`Note has been inserted with ID: ${noteId}`);
        return noteId;
    });
}

function returnNote(idNum){
    db.get(`
        SELECT title, content
        FROM notes
        WHERE id = ?
    `, [idNum], function(err, row) {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            const { title, content } = row;
            console.log(`Title: ${title}`);
            console.log(`Content: ${content}`);
        } else {
            console.log(`Note with ID ${idNum} not found`);
        }
    });
}

function createNote(){
    rl.question(`Please enter your title: `, title => {
        rl.question(`Please enter your note: `, content => {
    
                const noteTitle = title.trim() || null; // Default to null if title is empty
                const noteContent = content.trim();
        
                insertNewNote(noteTitle, noteContent);
            
    
                rl.close();
    
        });
    });
    
}

createNote();

