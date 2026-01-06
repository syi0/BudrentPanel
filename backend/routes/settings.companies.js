const express = require("express");

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
            (err) => {
                if (err) return res.sendStatus(500);
                res.sendStatus(200);
            }
        );
    });

    const bcrypt = require("bcrypt");

    router.post("/users", async (req, res) => {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.sendStatus(403);
        }

        const { username, password, role, first_name, last_name } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ error: "MISSING_DATA" });
        }

        const hashed = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (username, password, role, first_name, last_name)
            VALUES (?, ?, ?, ?, ?)`,
            [
                username,
                hashed,
                role,
                first_name || "",
                last_name || ""
            ],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }

                res.status(201).json({
                    id: this.lastID,
                    username,
                    role,
                    first_name,
                    last_name
                });
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

        if (Number(req.params.id) === req.session.user.id) {
            return res.status(400).json({ error: "CANNOT_DELETE_SELF" });
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

    router.put("/me/password", async (req, res) => {
        if (!req.session.user) return res.sendStatus(401);

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "MISSING_DATA" });
        }

        db.get(
            `SELECT password FROM users WHERE id = ?`,
            [req.session.user.id],
            async (err, row) => {
                if (err) return res.sendStatus(500);
                if (!row) return res.sendStatus(404);

                const ok = await bcrypt.compare(currentPassword, row.password);
                if (!ok) {
                    return res.status(403).json({ error: "INVALID_PASSWORD" });
                }

                const hashed = await bcrypt.hash(newPassword, 10);

                db.run(
                    `UPDATE users SET password = ? WHERE id = ?`,
                    [hashed, req.session.user.id],
                    err => {
                        if (err) return res.sendStatus(500);
                        res.sendStatus(200);
                    }
                );
            }
        );
    });

    router.put("/users/:id/password", async (req, res) => {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.sendStatus(403);
        }

        const { newPassword } = req.body;
        const userId = Number(req.params.id);

        if (!newPassword) {
            return res.status(400).json({ error: "MISSING_DATA" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        db.run(
            `UPDATE users SET password = ? WHERE id = ?`,
            [hashed, userId],
            err => {
                if (err) return res.sendStatus(500);
                res.sendStatus(200);
            }
        );
    });

    return router;
};
