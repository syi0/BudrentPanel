const express = require("express");

module.exports = (db) => {
    const router = express.Router();

    // GET /contacts (z firmą + filtrowaniem)
    router.get("/", (req, res) => {
        const {
            first_name = "",
            last_name = "",
            email = "",
            company = "",
            verified = ""
        } = req.query;

        const sql = `
            SELECT
                c.id,
                c.first_name,
                c.last_name,
                c.email,
                c.verified,
                c.marketing_consent,
                c.company_id,
                co.name AS company_name
            FROM contacts c
            LEFT JOIN companies co ON co.id = c.company_id
            WHERE c.first_name LIKE ?
              AND c.last_name LIKE ?
              AND c.email LIKE ?
              AND (co.name LIKE ? OR co.name IS NULL)
              AND (? = '' OR c.verified = ?)
            ORDER BY c.id DESC
        `;

        const params = [
            `%${first_name}%`,
            `%${last_name}%`,
            `%${email}%`,
            `%${company}%`,
            verified,
            verified
        ];

        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error("GET /contacts:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });

    // POST /contacts
    router.post("/", (req, res) => {
        const {
            company_id,
            first_name,
            last_name,
            email,
            verified = 0,
            marketing_consent = 0
        } = req.body;

        if (!company_id) {
            return res.status(400).json({ error: "Firma jest wymagana" });
        }

        db.run(
            `INSERT INTO contacts
             (company_id, first_name, last_name, email, verified, marketing_consent)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                company_id,
                first_name || null,
                last_name || null,
                email || null,
                verified,
                marketing_consent
            ],
            function (err) {
                if (err) {
                    console.error("POST /contacts:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID });
            }
        );
    });

    // PUT /contacts/:id
    router.put("/:id", (req, res) => {
        const { id } = req.params;
        const {
            company_id,
            first_name,
            last_name,
            email,
            verified = 0,
            marketing_consent = 0
        } = req.body;

        if (!company_id) {
            return res.status(400).json({ error: "Firma jest wymagana" });
        }

        db.run(
            `UPDATE contacts SET
                company_id = ?,
                first_name = ?,
                last_name = ?,
                email = ?,
                verified = ?,
                marketing_consent = ?
             WHERE id = ?`,
            [
                company_id,
                first_name || null,
                last_name || null,
                email || null,
                verified,
                marketing_consent,
                id
            ],
            (err) => {
                if (err) {
                    console.error("PUT /contacts:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true });
            }
        );
    });
    router.delete("/:id", (req, res) => {
        const { id } = req.params;

        db.run(
            "DELETE FROM contacts WHERE id = ?",
            [id],
            function (err) {
                if (err) {
                    console.error("DELETE /contacts:", err);
                    return res.status(500).json({ error: err.message });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: "NOT_FOUND" });
                }

                res.json({ success: true });
            }
        );
    });

    return router;
};
