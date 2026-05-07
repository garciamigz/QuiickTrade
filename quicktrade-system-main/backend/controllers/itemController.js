const sql = require("../db");

exports.postItem = async (req, res) => {
  try {
    const { user_id, name, game, description, value, tags, screenshot_url } = req.body;
    
    const result = await sql.query`
      INSERT INTO ItemPosts (user_id, name, game, description, value, tags, screenshot_url)
      VALUES (${user_id}, ${name}, ${game}, ${description}, ${value}, ${tags}, ${screenshot_url});
      SELECT SCOPE_IDENTITY() AS post_id;
    `;

    res.status(201).json({ message: "Item posted successfully", post_id: result.recordset[0].post_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to post item" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM ItemPosts ORDER BY post_id DESC`;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};
