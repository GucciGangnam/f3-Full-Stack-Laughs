import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export const initDB = async () => {
    const db = await open({
        filename: path.join(__dirname, '../../jokes.db'),
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS jokes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      setup TEXT NOT NULL,
      punchline TEXT NOT NULL
    );
  `);

    return db;
};