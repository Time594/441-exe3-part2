// add your information 
const yourName = 'Time';  
const yourID = 'XXXXXXXXX';  
const yourmac = 'XX-XX-XX-XX-XX-XX';
const yourip = 'XXX.XXX.XX.X';
console.log(`I'm ${yourName}.my IP is:${yourip}.my Mac address is:${yourmac}.NCC student ID is: (${yourID})`); 
  
// import neccessary environment
const sqlite3 = require('sqlite3').verbose();  
const readline = require('readline');  
const rl = readline.createInterface({  
    input: process.stdin,  
    output: process.stdout  
});  
  
// create or link to a database file
const db = new sqlite3.Database('./book.db', (err) => {  
    if (err) {  
        return console.error(err.message);  
    }  
    console.log('Connected to the book database.');  
  
    // create a table  
    db.run(`  
        CREATE TABLE IF NOT EXISTS books (  
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            title TEXT NOT NULL,  
            author TEXT NOT NULL,  
            isbn TEXT NOT NULL,  
            context TEXT NOT NULL  
        )  
    `, (err) => {  
        if (err) {  
            return console.error(err.message);  
        }  
        console.log('Books table created or already exists.');  
  
        //insert a book.
        insertBooks();  
    });  
});  
  
// the function of inserting a book. 
function insertBooks() {  
    rl.question('Enter book title: ', (title) => {  
        rl.question('Enter book author: ', (author) => {  
            rl.question('Enter book ISBN: ', (isbn) => {  
                rl.question('Enter book context: ', (context) => {  
                    db.run(`INSERT INTO books (title, author, isbn, context) VALUES (?, ?, ?, ?)`,  
                        [title, author, isbn, context],  
                        (err) => {  
                            if (err) {  
                                return console.error(err.message);  
                            }  
                            console.log('Book inserted successfully.');  
  
                            // ask admin if need to insert more
                            rl.question('Do you want to enter another book? (yes/no): ', (answer) => {  
                                if (answer.toLowerCase() === 'yes') {  
                                    // continue to insert a book
                                    insertBooks();  
                                } else {  
                                    // list records
                                    listAllBooks();  
                                    // shut down the api of readline  
                                    rl.close();  
                                }  
                            });  
                        }  
                    );  
                });  
            });  
        });  
    });  
}  
  
// the function of listing books 
function listAllBooks() {  
    console.log('Listing all books:');  
    db.all('SELECT * FROM books', [], (err, rows) => {  
        if (err) {  
            return console.error(err.message);  
        }  
        rows.forEach((row) => {  
            console.log(`ID: ${row.id}, Title: ${row.title}, Author: ${row.author}, ISBN: ${row.isbn}`);  
        });  
    });  
}

// use the function  
insertBooks();