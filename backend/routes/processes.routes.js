const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  const safeNumber = (val) => {
    if (val === "" || val == null) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  const safeString = (val) => {
    return typeof val === "string" ? val : "";
  };

  router.get("/", (req, res) => {
    const {
      company,
      status,
      process_number,
      responsible,
      description,
      parts,
      contact
    } = req.query;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;

    let baseSql = `
      FROM processes p
      LEFT JOIN companies c ON c.id = p.company_id
      LEFT JOIN contacts ct ON ct.id = p.contact_id
      LEFT JOIN users u ON u.id = p.responsible_user_id
      WHERE 1=1
    `;

    const params = [];

    if (company) {
      baseSql += ` AND (c.name LIKE ? OR ct.first_name LIKE ? OR ct.last_name LIKE ?)`;
      params.push(`%${company}%`, `%${company}%`, `%${company}%`);
    }

    if (status) {
      baseSql += ` AND p.status = ?`;
      params.push(status);
    }

    if (process_number) {
      baseSql += ` AND p.process_number LIKE ?`;
      params.push(`%${process_number}%`);
    }

    if (responsible) {
      baseSql += ` AND (u.first_name LIKE ? OR u.last_name LIKE ?)`;
      params.push(`%${responsible}%`, `%${responsible}%`);
    }

    if (description) {
      baseSql += ` AND p.description LIKE ?`;
      params.push(`%${description}%`);
    }

    if (parts) {
      baseSql += ` AND p.parts_used LIKE ?`;
      params.push(`%${parts}%`);
    }

    if (contact) {
      baseSql += ` AND (ct.first_name LIKE ? OR ct.last_name LIKE ?)`;
      params.push(`%${contact}%`, `%${contact}%`);
    }

    db.get(`SELECT COUNT(*) as total ${baseSql}`, params, (err, countRow) => {
      if (err) {
        console.error("COUNT /processes:", err);
        return res.status(500).json({ error: err.message });
      }

      db.all(
        `
        SELECT
          p.id,
          p.process_number,
          p.company_id,
          p.contact_id,
          p.responsible_user_id,
          p.description,
          p.advance_amount,
          p.settlement,
          p.parts_used,
          p.status,
          p.address,
          p.created_at,
          c.name AS company_name,
          COALESCE(ct.first_name, '') || ' ' || COALESCE(ct.last_name, '') AS contact_name,
          COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') AS responsible_name
        ${baseSql}
        ORDER BY p.id DESC
        LIMIT ? OFFSET ?
        `,
        [...params, limit, offset],
        (err, rows) => {
          if (err) {
            console.error("SELECT /processes:", err);
            return res.status(500).json({ error: err.message });
          }

          res.json({
            page,
            limit,
            total: countRow.total,
            pages: Math.ceil(countRow.total / limit),
            data: rows,
          });
        }
      );
    });
  });

  router.post("/", (req, res) => {
    try {
      let {
        company_id,
        contact_id,
        responsible_user_id,
        description,
        advance_amount,
        settlement,
        status,
        address,
        parts_used
      } = req.body;

      company_id = company_id ? Number(company_id) : null;
      contact_id = contact_id ? Number(contact_id) : null;
      responsible_user_id = responsible_user_id ? Number(responsible_user_id) : null;

      description = safeString(description);
      status = status || "nowy";
      address = safeString(address);
      parts_used = safeString(parts_used);

      advance_amount = safeNumber(advance_amount);
      settlement = safeNumber(settlement);

      if (!company_id && !contact_id) {
        return res.status(400).json({
          error: "Indywidualny klient musi mieć osobę kontaktową"
        });
      }

      const now = new Date();
      const createdAt = now.toISOString();
      const yearFull = now.getFullYear();

      db.get(
        `
        SELECT MAX(
          CAST(
            SUBSTR(process_number, 5, INSTR(SUBSTR(process_number, 5), '/') - 1)
            AS INTEGER
          )
        ) as max
        FROM processes
        WHERE process_number LIKE ?
        `,
        [`SRW/%/${yearFull}`],
        (err, row) => {
          if (err) {
            console.error("MAX /processes:", err);
            return res.status(500).json({ error: err.message });
          }

          const next = (row?.max || 0) + 1;
          const processNumber = `SRW/${next}/${yearFull}`;

          db.run(
            `
            INSERT INTO processes
            (process_number, company_id, contact_id, responsible_user_id, description, advance_amount, settlement, status, address, parts_used, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              processNumber,
              company_id,
              contact_id,
              responsible_user_id,
              description,
              advance_amount,
              settlement,
              status,
              address,
              parts_used,
              createdAt,
            ],
            function (err) {
              if (err) {
                console.error("POST /processes:", err, req.body);
                return res.status(500).json({ error: err.message });
              }

              res.status(201).json({
                id: this.lastID,
                process_number: processNumber,
              });
            }
          );
        }
      );
    } catch (e) {
      console.error("POST crash:", e);
      res.status(500).json({ error: e.message });
    }
  });

  router.put("/:id", (req, res) => {
    try {
      let {
        company_id,
        contact_id,
        responsible_user_id,
        description,
        advance_amount,
        settlement,
        status,
        address,
        parts_used
      } = req.body;

      company_id = company_id ? Number(company_id) : null;
      contact_id = contact_id ? Number(contact_id) : null;
      responsible_user_id = responsible_user_id ? Number(responsible_user_id) : null;

      description = safeString(description);
      address = safeString(address);
      parts_used = safeString(parts_used);

      advance_amount = safeNumber(advance_amount);
      settlement = safeNumber(settlement);

      status = status || "nowy";

      console.log("UPDATE DATA:", req.body);

      db.run(
        `
        UPDATE processes SET
          company_id = ?,
          contact_id = ?,
          responsible_user_id = ?,
          description = ?,
          advance_amount = ?,
          settlement = ?,
          status = ?,
          address = ?,
          parts_used = ?
        WHERE id = ?
        `,
        [
          company_id,
          contact_id,
          responsible_user_id,
          description,
          advance_amount,
          settlement,
          status,
          address,
          parts_used,
          req.params.id,
        ],
        (err) => {
          if (err) {
            console.error("PUT /processes:", err, req.body);
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true });
        }
      );
    } catch (e) {
      console.error("PUT crash:", e);
      res.status(500).json({ error: e.message });
    }
  });

  router.delete("/:id", (req, res) => {
    db.run("DELETE FROM processes WHERE id = ?", [req.params.id], (err) => {
      if (err) {
        console.error("DELETE /processes:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    });
  });

  return router;
};