const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data.sqlite");


module.exports = (db) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        const {
            name = "",
            nip = "",
            city = "",
            account_manager = ""
        } = req.query;

        const sql = `
            SELECT *
            FROM companies
            WHERE name LIKE ?
            AND nip LIKE ?
            AND city LIKE ?
            AND account_manager LIKE ?
            ORDER BY id DESC
        `;

        const params = [
            `%${name}%`,
            `%${nip}%`,
            `%${city}%`,
            `%${account_manager}%`
        ];

        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error("GET /companies:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });


    router.post("/", (req, res) => {
        const {
            name,
            nip = null,
            address = null,
            postal_code = null,
            city = null,
            account_manager = null
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Nazwa firmy jest wymagana" });
        }

        db.run(
            `INSERT INTO companies
            (name, nip, address, postal_code, city, account_manager)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, nip, address, postal_code, city, account_manager],
            function (err) {
                if (err) {
                    console.error("POST /companies:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID });
            }
        );
    });

    router.put("/:id", (req, res) => {
        const { id } = req.params;

        const {
            name,
            nip = null,
            address = null,
            postal_code = null,
            city = null,
            account_manager = null
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Nazwa firmy jest wymagana" });
        }

        db.run(
            `UPDATE companies SET
                name = ?,
                nip = ?,
                address = ?,
                postal_code = ?,
                city = ?,
                account_manager = ?
             WHERE id = ?`,
            [name, nip, address, postal_code, city, account_manager, id],
            (err) => {
                if (err) {
                    console.error("PUT /companies:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true });
            }
        );
    });

    router.delete("/:id", (req, res) => {
        const { id } = req.params;

        db.run(
            "DELETE FROM companies WHERE id = ?",
            [id],
            (err) => {
                if (err) {
                    console.error("DELETE /companies:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true });
            }
        );
    });

    router.delete("/:id", (req, res) => {
    const { id } = req.params;

        db.run(
            "DELETE FROM companies WHERE id = ?",
            [id],
            function (err) {
                if (err) {
                    console.error("DELETE /companies:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true });
            }
        );
    });

    return router;
};