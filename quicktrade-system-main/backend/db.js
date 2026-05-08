const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const { sql: vercelSql } = require('@vercel/postgres');

let db;
const isProduction = process.env.POSTGRES_URL || process.env.NODE_ENV === 'production';

const initDB = async () => {
    if (db) return db;

    if (isProduction && process.env.POSTGRES_URL) {
        console.log("Vercel PostgreSQL Connected");
        
        // Mocking sqlite interface for Postgres to avoid breaking existing controllers
        db = {
            get: async (query, params = []) => {
                const formattedQuery = query.replace(/\?/g, (_, i) => `$${params.indexOf(params[i]) + 1}`); // Simple replacement, might need better logic
                // Better way: replace ? with $1, $2, etc.
                let count = 1;
                const pgQuery = query.replace(/\?/g, () => `$${count++}`);
                const { rows } = await vercelSql.query(pgQuery, params);
                return rows[0];
            },
            all: async (query, params = []) => {
                let count = 1;
                const pgQuery = query.replace(/\?/g, () => `$${count++}`);
                const { rows } = await vercelSql.query(pgQuery, params);
                return rows;
            },
            run: async (query, params = []) => {
                let count = 1;
                const pgQuery = query.replace(/\?/g, () => `$${count++}`);
                
                // Handle RETURNING for INSERTs to mimic sqlite's lastID
                if (pgQuery.trim().toUpperCase().startsWith('INSERT')) {
                    const returningQuery = `${pgQuery} RETURNING *`;
                    const { rows } = await vercelSql.query(returningQuery, params);
                    const firstRow = rows[0];
                    // Find the first column that ends with _id or is just id
                    const idKey = Object.keys(firstRow).find(k => k.endsWith('_id') || k === 'id');
                    return { lastID: firstRow[idKey], changes: 1 };
                }
                
                const result = await vercelSql.query(pgQuery, params);
                return { lastID: null, changes: result.rowCount };
            },
            exec: async (query) => {
                return await vercelSql.query(query);
            }
        };

        // Create tables if they don't exist (Postgres syntax)
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                full_name TEXT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                premium_status INTEGER DEFAULT 0,
                balance DECIMAL(18, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Items (
                item_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                game TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                value DECIMAL(18, 2) NOT NULL,
                tradable_status INTEGER DEFAULT 1,
                image TEXT,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS ItemPosts (
                post_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                screenshot_url TEXT,
                name TEXT NOT NULL,
                game TEXT NOT NULL,
                description TEXT,
                value DECIMAL(18, 2) NOT NULL,
                category TEXT,
                tags TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS Trades (
                trade_id SERIAL PRIMARY KEY,
                item_offered INTEGER NOT NULL,
                item_requested INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                message TEXT,
                middleman TEXT,
                escrow_fee DECIMAL(18, 2) DEFAULT 0.00,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (item_offered) REFERENCES ItemPosts(post_id),
                FOREIGN KEY (item_requested) REFERENCES ItemPosts(post_id)
            );

            CREATE TABLE IF NOT EXISTS Conversations (
                convo_id SERIAL PRIMARY KEY,
                user1_id INTEGER NOT NULL,
                user2_id INTEGER NOT NULL,
                last_message TEXT,
                last_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user1_id) REFERENCES users(user_id),
                FOREIGN KEY (user2_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS Messages (
                msg_id SERIAL PRIMARY KEY,
                sender_id INTEGER NOT NULL,
                receiver_id INTEGER NOT NULL,
                convo_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                item_id INTEGER,
                FOREIGN KEY (sender_id) REFERENCES users(user_id),
                FOREIGN KEY (receiver_id) REFERENCES users(user_id),
                FOREIGN KEY (convo_id) REFERENCES Conversations(convo_id),
                FOREIGN KEY (item_id) REFERENCES Items(item_id)
            );

            CREATE TABLE IF NOT EXISTS Bookmarks (
                bookmark_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                post_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id),
                FOREIGN KEY (post_id) REFERENCES ItemPosts(post_id),
                UNIQUE(user_id, post_id)
            );
        `);

    } else {
        // Local SQLite
        db = await open({
            filename: path.join(__dirname, 'quicktrade.db'),
            driver: sqlite3.Database
        });
        await db.get('PRAGMA foreign_keys = ON');
        console.log("SQLite Database Connected");

        // Existing SQLite table creation...
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                premium_status INTEGER DEFAULT 0,
                balance DECIMAL(18, 2) DEFAULT 0.00,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Items (
                item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                game TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                value DECIMAL(18, 2) NOT NULL,
                tradable_status INTEGER DEFAULT 1,
                image TEXT,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS ItemPosts (
                post_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                screenshot_url TEXT,
                name TEXT NOT NULL,
                game TEXT NOT NULL,
                description TEXT,
                value DECIMAL(18, 2) NOT NULL,
                category TEXT,
                tags TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS Trades (
                trade_id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_offered INTEGER NOT NULL,
                item_requested INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                message TEXT,
                middleman TEXT,
                escrow_fee DECIMAL(18, 2) DEFAULT 0.00,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (item_offered) REFERENCES ItemPosts(post_id),
                FOREIGN KEY (item_requested) REFERENCES ItemPosts(post_id)
            );

            CREATE TABLE IF NOT EXISTS Conversations (
                convo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user1_id INTEGER NOT NULL,
                user2_id INTEGER NOT NULL,
                last_message TEXT,
                last_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user1_id) REFERENCES users(user_id),
                FOREIGN KEY (user2_id) REFERENCES users(user_id)
            );

            CREATE TABLE IF NOT EXISTS Messages (
                msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER NOT NULL,
                receiver_id INTEGER NOT NULL,
                convo_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                item_id INTEGER,
                FOREIGN KEY (sender_id) REFERENCES users(user_id),
                FOREIGN KEY (receiver_id) REFERENCES users(user_id),
                FOREIGN KEY (convo_id) REFERENCES Conversations(convo_id),
                FOREIGN KEY (item_id) REFERENCES Items(item_id)
            );

            CREATE TABLE IF NOT EXISTS Bookmarks (
                bookmark_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                post_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id),
                FOREIGN KEY (post_id) REFERENCES ItemPosts(post_id),
                UNIQUE(user_id, post_id)
            );
        `);
    }

    return db;
};

initDB();

const sqlHelper = {
    query: async (queryStr, params = []) => {
        const database = await initDB();
        if (isProduction && process.env.POSTGRES_URL) {
            let count = 1;
            const pgQuery = queryStr.replace(/\?/g, () => \`$\${count++}\`);
            const { rows } = await vercelSql.query(pgQuery, params);
            return { recordset: rows };
        } else {
            return { recordset: await database.all(queryStr, params) };
        }
    },
    getDB: async () => await initDB()
};

module.exports = sqlHelper;
