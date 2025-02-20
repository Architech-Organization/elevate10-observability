"use strict";

// configs
export const PORT = process.env.PORT || 5001;

// db configs
const sqlHost = process.env.MYSQL_HOST || "localhost";
const sqlUser = process.env.MYSQL_USERNAME || "root";
const sqlPassword = process.env.MYSQL_PASSWORD || "mypassword";
const sqlDatabase = process.env.MYSQL_DATABASE || "mydb";
const sqlPort = process.env.MYSQL_PORT || "3307";

export const sqlTable = process.env.MYSQL_TABLE || "registrations";

export const dbConfigs = {
  host: sqlHost,
  port: sqlPort,
  user: sqlUser,
  password: sqlPassword,
  database: sqlDatabase,
};

// redis configs
const redisUsername = process.env.REDIS_USERNAME || "";
const redisPassword = process.env.REDIS_PASSWORD || "mypassword";
const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || "6379";
export const redisChannel = process.env.REDIS_CHANNEL || "channel1";
export const streamKey = "eventsStream"; // The name of the Redis stream
export const groupName = "eventGroup";     // The consumer group name


const redisUrl = `redis://${redisUsername}:${redisPassword}@${redisHost}:${redisPort}`;


// use this for a local redis without authentication
//const redisUrl = `redis://${redisHost}:${redisPort}`;
console.log('redisUrl:', redisUrl)

export const redisConfigs = { url: redisUrl };

export const serverName = process.env.SERVICE_NAME || "localhost"