const sql = require("../db");

exports.createTrade = async (req, res) => {
  const transaction = new sql.Transaction();
  try {
    const { item_offered, item_requested } = req.body;

    await transaction.begin();

    // 1. Check if both items are tradable (not locked)
    const itemStatus = await transaction.request()
      .input('offered', sql.Int, item_offered)
      .input('requested', sql.Int, item_requested)
      .query(`
        SELECT item_id, tradable_status 
        FROM Items 
        WHERE item_id IN (@offered, @requested)
      `);

    const items = itemStatus.recordset;
    if (items.length < 2) {
      throw new Error("One or both items not found");
    }

    if (items.some(i => i.tradable_status === 0)) {
      throw new Error("One or both items are already locked or not tradable");
    }

    // 2. Insert the trade record
    const tradeResult = await transaction.request()
      .input('offered', sql.Int, item_offered)
      .input('requested', sql.Int, item_requested)
      .query(`
        INSERT INTO Trades (item_offered, item_requested, status, timestamp)
        VALUES (@offered, @requested, 'pending', GETDATE());
        SELECT SCOPE_IDENTITY() AS trade_id;
      `);

    const tradeId = tradeResult.recordset[0].trade_id;

    // 3. Lock both items
    await transaction.request()
      .input('offered', sql.Int, item_offered)
      .input('requested', sql.Int, item_requested)
      .query(`
        UPDATE Items 
        SET tradable_status = 0 
        WHERE item_id IN (@offered, @requested)
      `);

    await transaction.commit();
    res.status(201).json({ message: "Trade offered and items locked", trade_id: tradeId });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create trade transaction" });
  }
};

exports.cancelTrade = async (req, res) => {
  const transaction = new sql.Transaction();
  try {
    const { trade_id } = req.body;

    await transaction.begin();

    // 1. Get items involved in this trade
    const tradeData = await transaction.request()
      .input('trade_id', sql.Int, trade_id)
      .query(`SELECT item_offered, item_requested FROM Trades WHERE trade_id = @trade_id AND status = 'pending'`);

    if (tradeData.recordset.length === 0) {
      throw new Error("Trade not found or already processed");
    }

    const { item_offered, item_requested } = tradeData.recordset[0];

    // 2. Unlock items
    await transaction.request()
      .input('offered', sql.Int, item_offered)
      .input('requested', sql.Int, item_requested)
      .query(`UPDATE Items SET tradable_status = 1 WHERE item_id IN (@offered, @requested)`);

    // 3. Update trade status
    await transaction.request()
      .input('trade_id', sql.Int, trade_id)
      .query(`UPDATE Trades SET status = 'cancelled' WHERE trade_id = @trade_id`);

    await transaction.commit();
    res.json({ message: "Trade cancelled and items unlocked" });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to cancel trade" });
  }
};

exports.getReports = async (req, res) => {
  try {
    // Report 1: Trades per game
    const tradesPerGame = await sql.query(`
      SELECT i.game, COUNT(t.trade_id) AS total_trades 
      FROM Trades t
      JOIN Items i ON t.item_offered = i.item_id
      GROUP BY i.game
    `);

    // Report 2: Item distribution by category
    // Since we don't have a formal category column in the current schema, we'll use game distribution for the pie chart
    const itemDistribution = await sql.query(`
      SELECT game, COUNT(*) as count 
      FROM Items 
      GROUP BY game
    `);

    // Report 3: Recent Activity
    const recentActivity = await sql.query(`
      SELECT TOP 10 t.trade_id, t.status, t.timestamp, i1.name as offered_item, i2.name as requested_item
      FROM Trades t
      JOIN Items i1 ON t.item_offered = i1.item_id
      JOIN Items i2 ON t.item_requested = i2.item_id
      ORDER BY t.timestamp DESC
    `);

    res.json({
      tradesPerGame: tradesPerGame.recordset,
      itemDistribution: itemDistribution.recordset,
      recentActivity: recentActivity.recordset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
