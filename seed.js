import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './config/db.js';

const email = process.env.ADMIN_EMAIL || 'admin@alumni.com';
const pass = process.env.ADMIN_PASSWORD || 'Admin@123';
const [ex] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
if (ex.length) console.log('Admin already exists');
else {
  const [r] = await pool.query("INSERT INTO users (name,email,password_hash,role) VALUES ('Administrator',?,?,'admin')",
    [email, await bcrypt.hash(pass, 10)]);
  await pool.query('INSERT INTO profiles (user_id) VALUES (?)', [r.insertId]);
  console.log(`Admin created: ${email} / ${pass}`);
}
process.exit(0);
