import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../api";

import "../CSS/SingleEvent.css";

const SingleEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    getEventById(id).then((eventData) => {
      setEvent(eventData);
    });
  }, [id]);

  const handleSignUp = () => {
    setIsSignedUp(true);
  };

  const handleAddToCalendar = () => {
    const eventUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
      event?.name
    )}&dates=${event?.dates?.start?.localDate.replace(
      /-/g,
      ""
    )}/${event?.dates?.start?.localDate.replace(
      /-/g,
      ""
    )}&details=Check out this event!&location=${encodeURIComponent(
      event?._embedded?.venues?.[0]?.name || "Unknown location"
    )}`;
    window.open(eventUrl, "_blank");
  };

  return (
    <>
      <main id="single-event">
        <h2>{event?.name}</h2>
        <img
          src={event?.images?.[0]?.url}
          alt="cover art for the event"
          className="card-image"
        />
        <h3>Venue: {event?._embedded?.venues?.[0]?.name}</h3>
        <p>Start date: {event?.dates?.start?.localDate}</p>
        {!isSignedUp ? (
          <button onClick={handleSignUp}>Sign up to event</button>
        ) : (
          <>
            <p className="signed-message">
              ✅ You are signed up to this event!
            </p>
            <button className="google-button" onClick={handleAddToCalendar}>
              Add this event to your Google Calendar
            </button>
          </>
        )}
      </main>
    </>
  );
};

export default SingleEvent;
