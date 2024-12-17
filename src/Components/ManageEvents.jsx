import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Authentication/firebase";
import SimpleHeader from "./SimpleHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { deleteEventById, getEventsByCreator } from "../API-Functions/myApi";
import ErrorComponent from "./ErrorComponent";
import "../CSS/ManageEvents.css";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCheckingAccess(true);
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().role === "Staff Member") {
            console.log("Access granted");
            fetchUserEvents(user, docSnap.data().username);
          } else {
            console.log("Access Denied");
            navigate("/");
          }
        } catch (err) {
          console.error("Error checking access:", err);
          navigate("/unauthorized");
        }
      } else {
        console.log("No user logged in");
        navigate("/unauthorized");
      }
      setCheckingAccess(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserEvents = async (user, creator) => {
    setLoadingEvents(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const eventsData = await getEventsByCreator(creator, token);
      setEvents(eventsData);
    } catch (err) {
      setError(err.response.data.msg);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    setDeletingEventId(id);
    setDeleteError("");
    try {
      const token = await auth.currentUser.getIdToken();
      await deleteEventById(id, token);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.event_id !== id)
      );
      setSuccessMessage("Event deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting event:", err);
      setDeleteError("Failed to delete the event. Please try again.");
    }
  };

  if (checkingAccess) {
    return <Loading />;
  }

  return (
    <>
      <SimpleHeader />
      <div className="manage-event-container">
        <h1>Manage Your Events</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {loadingEvents ? (
          <Loading />
        ) : error ? (
          <ErrorComponent error={error} />
        ) : (
          <main>
            {events.length === 0 ? (
              <p>No events found!</p>
            ) : (
              events.map((event) => (
                <section className="event-card" key={event.event_id}>
                  <h3 className="card-title">{event.event_name}</h3>
                  <img
                    src={event.image}
                    alt="cover art for the event"
                    className="card-image"
                  />
                  <h3>
                    Start date: {new Date(event.start_date).toLocaleString()}
                  </h3>
                  <p>Venue: {event.venue}</p>
                  <button
                    onClick={() => handleDeleteEvent(event.event_id)}
                    disabled={deletingEventId === event.event_id}
                  >
                    {deletingEventId === event.event_id
                      ? "Deleting..."
                      : "Delete Event"}
                  </button>
                  {deleteError && (
                    <p className="error-message">{deleteError}</p>
                  )}
                </section>
              ))
            )}
          </main>
        )}
      </div>
    </>
  );
};

export default ManageEvents;
