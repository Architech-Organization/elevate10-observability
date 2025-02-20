// Initialize tracing before importing any instrumented modules
import tracer from "dd-trace";
const serviceName = process.env.DD_SERVICE || "api-service";
tracer.init({
  service: serviceName,
  hostname: "datadog-agent",
  port: 8126,
  env: "dev",
  logInjection: true,
  analytics: true,
  runtimeMetrics: true,
  enabled: true,
  profiling: true,
  appsec: true,
  tags: {
    'env': 'dev',
    'service': serviceName
  }
});

// Import other modules after tracing is initialized
const express = (await import('express')).default;
const { PORT } = await import('./configs.js');
const { getEventsFromDB, deleteEventFromDB } = await import('./db.js');
const { addEventsToCache, getEventsFromCache, publishEventToStream, deleteEventsFromCache } = await import('./redis.js');
const cors = (await import('cors')).default;
await import('./eventsSubscriber.js');

// base express app
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// '/' endpoint to test the server
app.get("/", (_, res) => res.status(200).send("Hello World!"));

// '/events' endpoint to get all events
app.get("/events", async (req, res) => {
  try {
    // get the events from the cache
    const cachedEvents = await getEventsFromCache();

    if (!cachedEvents) {
      const events = await getEventsFromDB();
      res.status(200).send({ isCached: false, events: events });
      return await addEventsToCache(events);
    }
    console.log("Events found in cache");
    res.status(200).send({ isCached: true, events: cachedEvents });
  } catch (error) {
    console.error("Error getting events: ", error);
    res.status(500).send({ message: "Error getting events" });
  }
});

// post '/events' endpoint to create a new event
app.post("/events", async (req, res) => {
  try {
    const { eventData } = req.body;
    console.log('publishing event:', eventData);
    await publishEventToStream(eventData);
    res.status(201).send({ message: "Event created successfully" });
  } catch (error) {
    console.log("Error creating event: ", error);
    res.status(500).send({ message: "Error creating event" });
  }
});

// delete '/events' endpoint to delete an event by id
app.delete("/events", async (req, res) => {
  try {
    // delete event from db by id, the id from request body
    const { id } = req.body;
    await deleteEventFromDB(id);
    await deleteEventsFromCache();
    res.status(200).send({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event: ", error);
    res.status(500).send({ message: "Error deleting event" });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
