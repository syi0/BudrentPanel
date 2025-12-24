// example_add_user.js
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./data.sqlite");

const username = "test";
const password = "test";

bcrypt.hash(password, 12).then((hash) => {
    db.run(
        `INSERT INTO users (username, password, role)
         VALUES (?, ?, ?)`,
        [username, hash, "admin"],
        (err) => {
            if (err) {
                console.error("SQL ERROR:", err.message);
            } else {
                console.log("Dodano użytkownika.");
            }
            db.close();
        }
    );
});
