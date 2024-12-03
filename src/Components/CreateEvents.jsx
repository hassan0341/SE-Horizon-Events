import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Authentication/firebase";
import SimpleHeader from "./SimpleHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { createEvent, createTicketClass, publishEvent } from "../api";
import ErrorComponent from "./ErrorComponent";
import "../CSS/CreateEvent.css";

const CreateEvents = () => {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [ticketName, setTicketName] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState("");
  const [ticketCost, setTicketCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role === "Staff Member") {
          console.log("access granted");
        } else {
          console.log("Access Denied");
          navigate("/");
        }
      } else {
        console.log("No user logged in");
        navigate("/unauthorized");
      }
      setLoading(false);
    };
    checkAccess();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Ensure all fields are filled
    if (
      !eventName ||
      !startDate ||
      !endDate ||
      !location ||
      !ticketName ||
      !ticketQuantity ||
      !ticketCost
    ) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    const formattedStartDate = new Date(new Date(startDate))
      .toISOString()
      .replace(/\.\d{3}/, "");
    const formattedEndDate = new Date(new Date(endDate))
      .toISOString()
      .replace(/\.\d{3}/, "");

    const eventData = {
      event_name: eventName,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      location: location,
    };

    // Call the createEvent function to create the event
    createEvent(eventData)
      .then((eventResponse) => {
        // After creating the event, create a ticket class
        const ticketData = {
          name: ticketName,
          quantity: ticketQuantity,
          cost: ticketCost,
        };
        return createTicketClass(eventResponse.id, ticketData); // eventResponse.id is the Event ID
      })
      .then((ticketResponse) => {
        // After creating the ticket class, publish the event
        return publishEvent(ticketResponse.event_id); // ticketResponse.event_id is the Event ID
      })
      .then(() => {
        setLoading(false);
        alert("Event created successfully!");
        // Handle success (e.g., navigate to another page or reset form)
      })
      .catch((err) => {
        setLoading(false);

        setError("Error creating event: " + err.message);
      });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <SimpleHeader />
          <div className="create-event-container">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit} className="create-event-form">
              <label>
                Event Name:
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </label>
              <label>
                Start Date:
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                End Date:
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
              <label>
                Ticket Name:
                <input
                  type="text"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                />
              </label>
              <label>
                Ticket Quantity:
                <input
                  type="number"
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(e.target.value)}
                />
              </label>
              <label>
                Ticket Cost (USD):
                <input
                  type="number"
                  value={ticketCost}
                  onChange={(e) => setTicketCost(e.target.value)}
                />
              </label>
              {error && <ErrorComponent error={error} />}
              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default CreateEvents;
