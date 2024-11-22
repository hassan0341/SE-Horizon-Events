import { useEffect, useState } from "react";
import { getEvents } from "../api";
import EventCard from "./EventCard";
import Header from "../Components/Header";
import "../CSS/EventList.css";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then((eventsData) => {
      setEvents(eventsData);
    });
  }, []);

  return (
    <main>
      <Header />
      <ul>
        {events.map((event) => {
          return <EventCard event={event} key={event.id} />;
        })}
      </ul>
    </main>
  );
};

export default EventList;
