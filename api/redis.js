"use strict";
import { redisConfigs, streamKey } from "./configs.js"; // Ensure streamKey is exported from your configs.js
import { createClient } from "redis";

// create redis client
export const redisClient = createClient(redisConfigs);

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

redisClient.on('error', (err) => console.error('Redis Client Error', err, 'redis config: ', redisConfigs));

export const addEventsToCache = async (events) => {
  await redisClient.set("events", JSON.stringify(events));
};

export const getEventsFromCache = async () => {
  console.log('getting events from cache');
  const cachedEventsString = await redisClient.get("events");
  return JSON.parse(cachedEventsString);
};

export const deleteEventsFromCache = async () => {
  console.log('Deleting events from cache');
  await redisClient.del("events");
};

// Updated publisher function using Redis Streams
export const publishEventToStream = async (event) => {
  // The event parameter is expected to be an object.
  // We're storing it as a JSON string under the field "event"
  await redisClient.xAdd(streamKey, '*', { event: JSON.stringify(event) });
};
