
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { Pool } = require('pg');

const INFO = "98j43f9ajfsdofijODFIJSFOEIJFjajfp33983fjdiFSJFDK";

async function authenticate(ip, info, passport) {
  if (info != INFO) {
    throw "wait but who are you though?";
  }

  try {
    const result = await pool.query('SELECT verified FROM users WHERE ip = $1 AND passport = $2', [ip, passport]);
    return result.rows.flat().some(a => a);
  } catch(error) {
    return false;
  }
}

async function try_login(ip, info, passport) {
  if (info != INFO) {
    throw "wait but who are you though?";
  }

  await pool.query('INSERT INTO users (ip, passport, verified) VALUES ($1, $2, $3)', [ip, info, false]);
}

const app = express();
app.use(express.json());
app.use(express.static('html'));

// Create a PostgreSQL pool
const pool = new Pool({
  user: 'tasmine_serve',
  host: '/var/run/postgresql',
  database: 'tasmine',
  port: 5432,
});

app.post('/login', async (req, res) => {
    try {
      const data = req.body;
      await try_login(req.ip, data.info, data.passport);
      res.send();
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).send('heck');
    }
});

app.listen(80, () => {
  console.log(`Server running on port 80`);
});
