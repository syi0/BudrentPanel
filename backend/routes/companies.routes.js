const express = require("express");

module.exports = (db) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        const {
            name = "",
            nip = "",
            city = "",
            address = "",
            postal_code = "",
            contact_person = "",
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
            filters.push("c.name LIKE ? COLLATE BINARY");
            params.push(`%${name}%`);
        }

        if (nip) {
            filters.push("c.nip LIKE ? COLLATE BINARY");
            params.push(`%${nip}%`);
        }

        if (city) {
            filters.push("c.city LIKE ? COLLATE BINARY");
            params.push(`%${city}%`);
        }

        if (address) {
            filters.push("c.address LIKE ? COLLATE BINARY");
            params.push(`%${address}%`);
        }

        if (postal_code) {
            filters.push("c.postal_code LIKE ? COLLATE BINARY");
            params.push(`%${postal_code}%`);
        }

        if (account_manager) {
            filters.push("c.account_manager LIKE ? COLLATE BINARY");
            params.push(`%${account_manager}%`);
        }

        if (contact_person) {
            filters.push(`
                (
                    ct.first_name LIKE ? COLLATE BINARY
                    OR ct.last_name LIKE ? COLLATE BINARY
                )
            `);
            params.push(`%${contact_person}%`, `%${contact_person}%`);
        }

        const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

        db.get(
            `
            SELECT COUNT(DISTINCT c.id) as total
            FROM companies c
            LEFT JOIN contacts ct ON ct.company_id = c.id
            ${where}
            `,
            params,
            (err, countRow) => {
                if (err) return res.status(500).json(err);

                const total = countRow.total;
                const pages = Math.max(Math.ceil(total / l), 1);

                db.all(
                    `
                    SELECT DISTINCT c.*
                    FROM companies c
                    LEFT JOIN contacts ct ON ct.company_id = c.id
                    ${where}
                    ORDER BY c.name
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
                    console.error(err);
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
                    console.error(err);
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
                    console.error(err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true });
            }
        );
    });

    return router;
};