// example_add_user.js
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./data.sqlite");

const username = "testadmin";
const password = "test123";

bcrypt.hash(password, 12).then((hash) => {
    db.run(
        `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
        [username, hash, "admin"],
        (err) => {
            if (err) console.error(err);
            else console.log("Dodano użytkownika.");
            db.close();
        }
    );
});
