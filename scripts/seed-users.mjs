import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const scryptAsync = promisify(scrypt);
const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, "../dev.db"));

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

function cuid() {
  return "c" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

async function seed() {
  const users = [
    {
      username: "gonzalo",
      password: "Logitechi85",
      name: "Gonzalo",
      email: "gonzalo@mercaskroten.com",
      role: "SUPERADMIN",
    },
    {
      username: "adam",
      password: "MercaSkroten2026",
      name: "Adam",
      email: "adam@mercaskroten.com",
      role: "ADMIN",
    },
  ];

  const upsert = db.prepare(`
    INSERT INTO User (id, username, passwordHash, name, email, role, active, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    ON CONFLICT(username) DO UPDATE SET
      passwordHash = excluded.passwordHash,
      name         = excluded.name,
      email        = excluded.email,
      role         = excluded.role,
      active       = 1,
      updatedAt    = datetime('now')
  `);

  for (const u of users) {
    const hash = await hashPassword(u.password);
    upsert.run(cuid(), u.username, hash, u.name, u.email, u.role);
    console.log(`✓ ${u.role} — ${u.username} (${u.name})`);
  }

  console.log("\nDone. Users seeded successfully.");
  db.close();
}

seed().catch((err) => { console.error(err); process.exit(1); });
