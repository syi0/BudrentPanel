const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Baza
const db = new sqlite3.Database("./data.sqlite");

// Zabezpieczenia HTTP
app.use(helmet({
    contentSecurityPolicy: false
}));

// CORS – tylko frontend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

// Sesja w SQLite
app.use(session({
    name: "session-id",
    secret: "BARDZO_TAJNY_SEKRET_ZMIEN_TO",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,         // Ustaw na true gdy używasz HTTPS
        maxAge: 1000 * 60 * 60 // 1 godzina
    },
    store: new SQLiteStore({ db: "data.db", dir: "./" })
}));

// Middleware blokujący niezalogowanych
function authRequired(req, res, next) {
    if (!req.session.user) return res.status(401).json({ error: "UNAUTHORIZED" });
    next();
}

// Logowanie
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.status(500).json({ error: "DB_ERROR" });
        if (!user) return res.status(401).json({ error: "BAD_CREDENTIALS" });

        bcrypt.compare(password, user.password_hash, (err, match) => {
            if (!match) return res.status(401).json({ error: "BAD_CREDENTIALS" });

            req.session.user = { id: user.id, username: user.username, role: user.role };
            res.json({ success: true });
        });
    });
});

// Sprawdzenie sesji – frontend może użyć po odświeżeniu strony
app.get("/session", (req, res) => {
    if (!req.session.user) return res.json({ logged: false });
    res.json({ logged: true, user: req.session.user });
});

// Endpoint wymagający zalogowania
app.get("/protected", authRequired, (req, res) => {
    res.json({ msg: "Dostęp przyznany – jesteś zalogowany" });
});

// Wylogowanie
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("session-id");
        res.json({ success: true });
    });
});

app.listen(3001, () => console.log("Backend running on port 3001"));
