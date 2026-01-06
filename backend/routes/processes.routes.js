const express = require("express");

module.exports = (db) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        const { company, status } = req.query;

        let sql = `
            SELECT
                p.id,
                p.process_number,
                p.company_id,
                p.contact_id,
                p.responsible_user_id,
                p.description,
                p.advance_amount,
                p.status,
                p.created_at,
                c.name AS company_name,
                u.first_name || ' ' || u.last_name AS responsible_name
            FROM processes p
            LEFT JOIN companies c ON c.id = p.company_id
            LEFT JOIN users u ON u.id = p.responsible_user_id
            WHERE 1=1
        `;
        const params = [];

        if (company) {
            sql += " AND c.name LIKE ?";
            params.push(`%${company}%`);
        }

        if (status) {
            sql += " AND p.status = ?";
            params.push(status);
        }

        sql += " ORDER BY p.id DESC";

        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error("❌ GET /api/processes error:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });

    router.get("/:id", (req, res) => {
        db.get(
            `
            SELECT
                p.*,
                c.name AS company_name,
                u.first_name || ' ' || u.last_name AS responsible_name
            FROM processes p
            LEFT JOIN companies c ON c.id = p.company_id
            LEFT JOIN users u ON u.id = p.responsible_user_id
            WHERE p.id = ?
            `,
            [req.params.id],
            (err, row) => {
                if (err) {
                    console.error("❌ GET /api/processes/:id error:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json(row);
            }
        );
    });

    router.post("/", (req, res) => {
        try {
            let {
                company_id,
                contact_id,
                responsible_user_id,
                description,
                advance_amount,
                status
            } = req.body;

            company_id = company_id || null;
            contact_id = contact_id || null;
            responsible_user_id = responsible_user_id || null;
            description = description || "";
            status = status || "nowy";
            advance_amount =
                advance_amount === "" || advance_amount === undefined
                    ? null
                    : Number(advance_amount);

            const now = new Date();

            const day = String(now.getDate()).padStart(2, "0");
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const year = now.getFullYear();

            const processNumber = `SRW/${day}${month}/${year}`;
            const createdAt = new Date().toISOString();

            db.run(
                `
                INSERT INTO processes
                (process_number, company_id, contact_id, responsible_user_id, description, advance_amount, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    processNumber,
                    company_id,
                    contact_id,
                    responsible_user_id,
                    description,
                    advance_amount,
                    status,
                    createdAt
                ],
                function (err) {
                    if (err) {
                        console.error("❌ POST /api/processes error:", err);
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ id: this.lastID });
                }
            );
        } catch (e) {
            console.error("❌ POST /api/processes crash:", e);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.put("/:id", (req, res) => {
        const {
            company_id,
            contact_id,
            responsible_user_id,
            description,
            advance_amount,
            status
        } = req.body;

        db.run(
            `
            UPDATE processes SET
                company_id = ?,
                contact_id = ?,
                responsible_user_id = ?,
                description = ?,
                advance_amount = ?,
                status = ?
            WHERE id = ?
            `,
            [
                company_id || null,
                contact_id || null,
                responsible_user_id || null,
                description || "",
                advance_amount === "" ? null : Number(advance_amount),
                status || "nowy",
                req.params.id
            ],
            function (err) {
                if (err) {
                    console.error("❌ PUT /api/processes error:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true });
            }
        );
    });

    router.delete("/:id", (req, res) => {
        db.run(
            "DELETE FROM processes WHERE id = ?",
            [req.params.id],
            function (err) {
                if (err) {
                    console.error("❌ DELETE /api/processes error:", err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true });
            }
        );
    });

    return router;
};
