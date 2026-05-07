const sql = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { full_name, username, email, password } = req.body;

    if (!username || !email || !password || password.length < 8) {
      return res.status(400).json({ error: "Invalid inputs. Password must be at least 8 characters." });
    }

    // Check if user exists
    const userCheck = await sql.query`
      SELECT * FROM users WHERE username = ${username} OR email = ${email}
    `;

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ error: "Username or Email already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await sql.query`
      INSERT INTO users (full_name, username, email, password, created_at, updated_at)
      VALUES (${full_name}, ${username}, ${email}, ${hashedPassword}, GETDATE(), GETDATE())
    `;

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier is username or email

    const result = await sql.query`
      SELECT * FROM users WHERE username = ${identifier} OR email = ${identifier}
    `;

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.json({ 
      token, 
      user: { 
        user_id: user.user_id, 
        username: user.username, 
        full_name: user.full_name,
        premium_status: user.premium_status,
        balance: user.balance
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};
