# json-database

A Node.js module for storing data in files on the local machine. It's basically a settings manager.

This is only meant to be used by a single application since it doesn't automatically reload the file after another application has edited it. When it saves the file, it rewrites the entire file to disk.

## Install

**json-database** is available for installation through [npm](https://www.npmjs.com/) using the ```npm install``` command.

~~~bash
npm install @tusent.io/json-database --save
~~~

## Usage

~~~javascript
const Database = require('json-database');

// Load existing database or create
const db = new Database('./data.json');

// Gets with specified defaults
let dataVersion = db.get('dataVersion', Number.MIN_SAFE_INTEGER);
let userCount = db.get('userCount', 0);

/**
 * If performance is not of the essence:
 */
if (dataVersion < 7) {
    // Save backup file to './data.json.bak'
    db.save(db.path + '.bak');
    
    for (let i = 0; i < userCount; i++) {
        let username = db.get(`users.${i}.name`); // (defaults to null)
        if (username !== null) {
            // Save for each setting
            db.set(`users.${i}.name`, null);
            db.set(`username${i}`, username);
        }
    }
    
    db.set('dataVersion', 7);
    console.log('Updated database to data version 7.');
}

/**
 * Same thing but more performant (fewer writes to disk):
 */
if (dataVersion < 7) {
    // Save backup file to './data.json.bak'
    db.save(db.path + '.bak');
    
    for (let i = 0; i < userCount; i++) {
        let username = db.get(`users.${i}.name`); // (defaults to null)
        if (username !== null) {
            // Set values without saving
            db.set(`users.${i}.name`, null, false);
            db.set(`username${i}`, username, false);
        }
    }
    
    // Save database file
    db.save();
    
    // Saves here as well (above save is redundant)
    db.set('dataVersion', 7);
    console.log('Updated database to data version 7.');
}
~~~

Note that I/O errors thrown by the fs-module are **not caught** and must be caught by the user of this module. The affected methods are ```Database.save```, ```Database.set``` (unless called with ```save``` parameter set to ```false```), and ```Database.constructor```.

## License

[LGPL-3.0](https://opensource.org/licenses/LGPL-3.0)