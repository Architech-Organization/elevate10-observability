"use strict";
import { addEventToDB } from "./db.js";
import { streamKey, groupName } from "./configs.js";
import { getEventAnalysis } from "./helper.js";
import { deleteEventsFromCache, redisClient } from "./redis.js";

// Each container should have a unique consumer name.
const consumerName = process.env.CONSUMER_NAME || `consumer-${Math.random().toString(36).substring(2, 15)}`;

const expensiveWorker = async (eventData) => {
  try {
    // Optionally analyze the event data
    getEventAnalysis(eventData);
    await addEventToDB(eventData);
    await deleteEventsFromCache();
  } catch (error) {
    console.error("Error in expensiveWorker:", error);
  }
};

const createConsumerGroup = async () => {
  try {
    // Create the consumer group. MKSTREAM creates the stream if it doesn't exist.
    await redisClient.xGroupCreate(streamKey, groupName, '$', { MKSTREAM: true });
    console.log(`Consumer group '${groupName}' created on stream '${streamKey}'`);
  } catch (err) {
    // Ignore error if the group already exists.
    if (err.message.includes("BUSYGROUP")) {
      console.log(`Consumer group '${groupName}' already exists`);
    } else {
      console.error("Error creating consumer group:", err);
    }
  }
};

const eventsSubscriber = async () => {
  await createConsumerGroup();
  console.log("Starting event subscriber with consumer name:", consumerName);

  while (true) {
    try {
      // Read new messages from the stream as part of the consumer group.
      const response = await redisClient.xReadGroup(
        groupName,
        consumerName,
        { key: streamKey, id: '>' },
        { COUNT: 1, BLOCK: 5000 } // Wait up to 5 seconds if no messages.
      );

      if (response) {
        for (const stream of response) {
          for (const msg of stream.messages) {
            const messageId = msg.id;
            const fields = msg.message;
            // Expecting your publisher to store the event data as a JSON string under the "event" field.
            const eventData = JSON.parse(fields.event);
            console.log(`Received message ${messageId} with event:`, eventData);

            await expensiveWorker(eventData);

            // Acknowledge the message so it won't be delivered again.
            await redisClient.xAck(streamKey, groupName, messageId);
          }
        }
      }
    } catch (error) {
      console.error("Error processing event from stream:", error);
    }
  }
};

eventsSubscriber();

export { eventsSubscriber };
