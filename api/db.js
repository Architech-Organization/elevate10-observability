import mysql from "mysql2/promise";
import { dbConfigs, sqlTable } from "./configs.js";

export const getEventsFromDB = async () => {
  const table = mysql.escapeId(sqlTable);
  const query = `SELECT * FROM ${table}`;
  const connection = await mysql.createConnection(dbConfigs);
  const [data] = await connection.execute(query);
  await connection.end();
  return data;
};

export const addEventToDB = async (eventData) => {

  const table = mysql.escapeId(sqlTable);
  const query = `INSERT INTO ${table} (firstName, lastName, email, eventName) VALUES (?, ?, ?, ?)`;
  const connection = await mysql.createConnection(dbConfigs);
  await connection.execute(query, [
    eventData.firstName,
    eventData.lastName,
    eventData.email,
    eventData.eventName,
  ]);
  await connection.end();
};

export const deleteEventFromDB = async (id) => {
  const table = mysql.escapeId(sqlTable);
  const query = `DELETE FROM ${table} WHERE id = ?`;
  console.log("delete query:", query, id);
  const connection = await mysql.createConnection(dbConfigs);
  await connection.execute(query, [id]);
  await connection.end();
};
