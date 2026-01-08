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
            account_manager = "",
            page = 1,
            limit = 20
        } = req.query;

        const p = Math.max(Number(page) || 1, 1);
        const l = Math.min(Number(limit) || 20, 100);
        const offset = (p - 1) * l;

        const filters = [];
        const params = [];

        if (name) {
            filters.push("name LIKE ?");
            params.push(`%${name}%`);
        }
        if (nip) {
            filters.push("nip LIKE ?");
            params.push(`%${nip}%`);
        }
        if (city) {
            filters.push("city LIKE ?");
            params.push(`%${city}%`);
        }
        if (account_manager) {
            filters.push("account_manager LIKE ?");
            params.push(`%${account_manager}%`);
        }

        const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

        db.get(
            `SELECT COUNT(*) as total FROM companies ${where}`,
            params,
            (err, countRow) => {
                if (err) return res.status(500).json(err);

                const total = countRow.total;
                const pages = Math.max(Math.ceil(total / l), 1);

                db.all(
                    `
                    SELECT *
                    FROM companies
                    ${where}
                    ORDER BY name
                    LIMIT ? OFFSET ?
                    `,
                    [...params, l, offset],
                    (err, rows) => {
                        if (err) return res.status(500).json(err);

                        res.json({
                            data: rows,
                            page: p,
                            pages,
                            total
                        });
                    }
                );
            }
        );
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