import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../API-Functions/api";
import SimpleHeader from "../Components/SimpleHeader";
import "../CSS/SingleEvent.css";
import Loading from "./Loading";
import ErrorComponent from "./ErrorComponent";
import { getMyEventById } from "../API-Functions/myApi";
import { format } from "date-fns";

const SingleEvent = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const isTicketmaster = /[a-zA-Z]/.test(id) && /\d/.test(id);

    console.log("Event ID:", id);
    console.log("Is Ticketmaster?", isTicketmaster);

    const eventDataFunction = isTicketmaster ? getEventById : getMyEventById;

    eventDataFunction(id)
      .then((eventData) => {
        setEvent(eventData);
        setLoading(false);
        setIsError(null);
      })
      .catch((error) => {
        setIsError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleSignUp = () => {
    setIsSignedUp(true);
  };

  const handleAddToCalendar = () => {
    const eventUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
      event?.event_name || event?.name
    )}&dates=${event?.start_date.replace(/-/g, "")}T${event?.start_date.replace(
      /-/g,
      ""
    )}Z/${event?.start_date.replace(/-/g, "")}T${event?.start_date.replace(
      /-/g,
      ""
    )}Z&details=Check+out+this+event!&location=${encodeURIComponent(
      event?.venue || "Unknown location"
    )}`;

    window.open(eventUrl, "_blank");
  };

  return (
    <>
      <SimpleHeader />
      {loading ? (
        <Loading />
      ) : isError ? (
        <ErrorComponent error={isError} />
      ) : (
        <main id="single-event">
          <h2>{event?.name || event.event_name}</h2>
          <img
            src={event?.images?.[0]?.url || event.image}
            alt="cover art for the event"
            className="card-image"
          />
          <h3>Venue: {event?._embedded?.venues?.[0]?.name || event.venue}</h3>
          <p>
            Start date:{" "}
            {event?.dates?.start?.localDate ||
              format(new Date(event.start_date), "dd MMMM yyyy, HH:mm")}
          </p>
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
      )}
    </>
  );
};

export default SingleEvent;
