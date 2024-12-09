/* eslint-disable react/prop-types */
import { format } from "date-fns";
import "../CSS/EventCard.css";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const eventName = event.event_name || event.name;
  const venue = event.venue || event._embedded?.venues?.[0]?.name;
  const startDate = event.start_date || event.dates?.start?.localDate;
  const image = event.image || event.images?.[0]?.url;

  const formattedDate = format(new Date(startDate), "dd MMMM yyyy, HH:mm");

  return (
    <Link to={`/events/${event.id}`}>
      <section className="event-card">
        <h3 className="card-title">{eventName}</h3>
        <img src={image} alt="cover art for the event" className="card-image" />
        <h3>Start date: {formattedDate}</h3>
        <p>Venue: {venue}</p>
        {event.created_by && <p>Created by: {event.created_by}</p>}
      </section>
    </Link>
  );
};

export default EventCard;
