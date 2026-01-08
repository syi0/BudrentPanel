const express = require("express");

module.exports = (db) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        const {
            company = "",
            first_name = "",
            last_name = "",
            email = "",
            verified = "",
            page = 1,
            limit = 20
        } = req.query;

        const p = Math.max(Number(page) || 1, 1);
        const l = Math.min(Number(limit) || 20, 100);
        const offset = (p - 1) * l;

        const filters = [];
        const params = [];

        if (company) {
            filters.push("c.name LIKE ?");
            params.push(`%${company}%`);
        }
        if (first_name) {
            filters.push("ct.first_name LIKE ?");
            params.push(`%${first_name}%`);
        }
        if (last_name) {
            filters.push("ct.last_name LIKE ?");
            params.push(`%${last_name}%`);
        }
        if (email) {
            filters.push("ct.email LIKE ?");
            params.push(`%${email}%`);
        }
        if (verified !== "") {
            filters.push("ct.verified = ?");
            params.push(Number(verified));
        }

        const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

        db.get(
            `
            SELECT COUNT(*) AS total
            FROM contacts ct
            LEFT JOIN companies c ON c.id = ct.company_id
            ${where}
            `,
            params,
            (err, countRow) => {
                if (err) return res.status(500).json(err);

                const total = countRow.total;
                const pages = Math.max(Math.ceil(total / l), 1);

                db.all(
                    `
                    SELECT
                        ct.*,
                        c.name AS company_name
                    FROM contacts ct
                    LEFT JOIN companies c ON c.id = ct.company_id
                    ${where}
                    ORDER BY ct.last_name, ct.first_name
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
