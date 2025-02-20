import { useState, useEffect } from "react";
import { Form } from "./Form";
import { getEvents, createEvent, deleteEvent } from "../lib/api";
import { Event } from "./Events";

const App = () => {
  const [eventList, setEventList] = useState([]);
  const [isCache, setIsCache] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    eventName: "",
  });

  // set events on first render
  useEffect(() => {
    getEvents()
      .then(({ isCached, events }) => {
        setEventList(events);
        setIsCache(isCached);
      })
      .catch((error) => console.error(error));
  }, []);

  // handle form submit
  const handleSubmit = async () => {
    try {
      await createEvent(formData);
      const { isCached, events } = await getEvents();
      setEventList(events);
      setIsCache(isCached);
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  // handle refresh button click
  const handleRefresh = async () => {
    const { isCached, events } = await getEvents();
    setEventList(events);
    setIsCache(isCached);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      const { isCached, events } = await getEvents();
      setEventList(events);
      setIsCache(isCached);
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  return (
    <main className="flex flex-col items-center my-10 space-y-10">
      <header className="w-full max-w-5xl text-center text-3xl font-bold">
        Architech University Elevate 1.0 - Observability Fundamentals </header>
      <section className="w-full max-w-5xl">
        <Form
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </section>
      <section className="w-full max-w-5xl">
        <button
          className="block mx-auto mb-5 px-2 py-1 bg-gray-500 text-white rounded-md"
          onClick={handleRefresh}
        >
          ↻ Refresh
        </button>
        <Event eventList={eventList} isCache={isCache} handleDelete={handleDelete} />
      </section>
    </main>
  );
};

export default App;
