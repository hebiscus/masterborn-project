import { open } from "sqlite";
import sqlite3 from "sqlite3";

export const setupDb = async (useMemoryDb = false) => {
    const db = await open({
        filename: useMemoryDb ? ":memory:" : "./database.db",
        driver: sqlite3.Database,
    });

    await db.migrate();

    return db;
}
