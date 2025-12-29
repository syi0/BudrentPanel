const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data.sqlite");

module.exports = (db) => {
    const router = express.Router();

    router.get("/me", (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ loggedIn: false });
        }

        db.get(
            `SELECT id, username, role, first_name, last_name 
            FROM users WHERE id = ?`,
            [req.session.user.id],
            (err, row) => {
                if (err) return res.sendStatus(500);
                res.json(row);
            }
        );
    });


    router.put("/me", (req, res) => {
        if (!req.session.user) return res.sendStatus(401);

        const { first_name, last_name } = req.body;

        db.run(
            `UPDATE users SET first_name = ?, last_name = ? WHERE id = ?`,
            [first_name, last_name, req.session.user.id],
            err => {
                if (err) return res.sendStatus(500);
                res.sendStatus(200);
            }
        );
    });


    router.get("/users", (req, res) => {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.sendStatus(403);
        }

        db.all(
            `SELECT id, username, role, first_name, last_name FROM users`,
            [],
            (err, rows) => {
                if (err) return res.sendStatus(500);
                res.json(rows);
            }
        );
    });


    router.delete("/users/:id", (req, res) => {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.sendStatus(403);
        }

        db.run(
            `DELETE FROM users WHERE id = ?`,
            [req.params.id],
            err => {
                if (err) return res.sendStatus(500);
                res.sendStatus(200);
            }
        );
    });

    return router;
}