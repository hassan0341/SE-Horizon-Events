/* eslint-disable react/prop-types */
import "../CSS/EventCard.css";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`}>
      <section className="event-card">
        <h3 className="card-title">{event.name}</h3>
        <img
          src={event.images[0].url}
          alt="cover art for the event"
          className="card-image"
        />
        <h3>Start date: {event.dates.start.localDate}</h3>
        <p>Venue: {event._embedded.venues[0].name}</p>
      </section>
    </Link>
  );
};

export default EventCard;
