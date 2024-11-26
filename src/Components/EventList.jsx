import { useEffect, useState } from "react";
import { getEvents } from "../api";
import EventCard from "./EventCard";
import Header from "../Components/Header";
import Loading from "../Components/Loading";
import ErrorComponent from "../Components/ErrorComponent";
import "../CSS/EventList.css";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    getEvents()
      .then((eventsData) => {
        setEvents(eventsData);
        setLoading(false);
        setIsError(null);
      })
      .catch((error) => {
        setIsError(error.message + " 404");
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <Header />
      {loading ? (
        <Loading />
      ) : isError ? (
        <ErrorComponent error={isError} />
      ) : (
        <ul>
          {events.map((event) => {
            return <EventCard event={event} key={event.id} />;
          })}
        </ul>
      )}
    </main>
  );
};

export default EventList;
