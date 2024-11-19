import "./CSS/EventCard.css";

const EventCard = ({ event }) => {
  return (
    <section className="event-card">
      <h3 className="card-title">{event.name}</h3>
      <p>Start date: {event.dates.start.localDate}</p>
      <p>Venue: {event._embedded.venues[0].name}</p>
    </section>
  );
};

export default EventCard;
