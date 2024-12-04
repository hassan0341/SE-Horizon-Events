import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Authentication/firebase";
import SimpleHeader from "./SimpleHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import {
  getOrganizations,
  createEvent,
  createTicketsTiers,
  assignTicketTiersToEvent,
} from "../api";
import ErrorComponent from "./ErrorComponent";
import "../CSS/CreateEvent.css";

const CreateEvents = () => {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currency, setCurrency] = useState("USD");
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

    if (
      !eventName ||
      !startDate ||
      !endDate ||
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
      currency,
    };

    getOrganizations()
      .then((orgResponse) => {
        const organizationId = orgResponse.organizations[0].id; // Use the first organization
        return createEvent(organizationId, eventData);
      })
      .then((eventResponse) => {
        const eventId = eventResponse.id; // Use the created event ID
        const ticketData = {
          name: ticketName,
          quantity: parseInt(ticketQuantity, 10),
          cost: `${currency},${parseFloat(ticketCost) * 100}`, // Format to "USD,1000"
        };
        return createTicketsTiers(eventId, ticketData);
      })
      .then((ticketResponse) => {
        const ticketTierId = ticketResponse.inventory_tier.id; // Use the ticket tier ID
        const eventId = ticketResponse.event_id;
        const ticketClassData = {
          name: ticketName,
          cost: `${currency},${parseFloat(ticketCost) * 100}`,
        };
        return assignTicketTiersToEvent(eventId, ticketTierId, ticketClassData);
      })
      .then(() => {
        setLoading(false);
        alert("Event created successfully!");
        // Reset form after successful creation
        setEventName("");
        setStartDate("");
        setEndDate("");
        setTicketName("");
        setTicketQuantity("");
        setTicketCost("");
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
