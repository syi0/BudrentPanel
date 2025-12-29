const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const helmet = require("helmet");
const cors = require("cors");

const app = express();

const db = new sqlite3.Database("./data.sqlite");

app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(session({
    name: "session-id",
    secret: "BUDR3NTbudrentBuDrEnT5@",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 
    },
    store: new SQLiteStore({ db: "data.db", dir: "./" })
}));

function authRequired(req, res, next) {
    if (!req.session.user) return res.status(401).json({ error: "UNAUTHORIZED" });
    next();
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "DB_ERROR" });
            }

            if (!user) {
                return res.status(401).json({ error: "BAD_CREDENTIALS" });
            }

            bcrypt.compare(password, user.password, (err, match) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "BCRYPT_ERROR" });
                }

                if (!match) {
                    return res.status(401).json({ error: "BAD_CREDENTIALS" });
                }

                req.session.user = {
                    id: user.id,
                    username: user.username,
                    role: user.role
                };

                res.json({ success: true });
            });
        }
    );
});


app.get("/session", (req, res) => {
    if (!req.session.user) return res.json({ logged: false });
    res.json({ logged: true, user: req.session.user });
});

app.get("/protected", authRequired, (req, res) => {
    res.json({ msg: "Dostęp przyznany – jesteś zalogowany" });
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("session-id");
        res.json({ success: true });
    });
});

const companiesRoutes = require("./routes/companies.routes")(db);
const contactsRoutes = require("./routes/contacts.routes")(db);
const settingsRoutes = require("./routes/settings.routes")(db);
app.use("/api/companies", companiesRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api", settingsRoutes);






app.listen(3001, () => console.log("Backend running on port 3001"));



