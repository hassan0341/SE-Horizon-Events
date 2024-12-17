import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Authentication/firebase";
import SimpleHeader from "./SimpleHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import ErrorComponent from "./ErrorComponent";
import "../CSS/CreateEvent.css";
import { postEvents } from "../API-Functions/myApi";

const CreateEvents = () => {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [venueName, setVenueName] = useState("");

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [eventImage, setEventImage] = useState("");
  const [error, setError] = useState("");
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
          } else {
            console.log("Access Denied");
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking access:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccessMessage("");

    if (!eventName || !startDate || !venueName || !eventImage) {
      setError("All fields are required.");
      setFormLoading(false);
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const eventData = {
        event_name: eventName,
        venue: venueName,
        start_date: startDate,
        image: eventImage,
      };

      await postEvents(eventData, token);
      setFormLoading(false);
      setSuccessMessage("Event created successfully!");

      setError("");

      setEventName("");
      setVenueName("");
      setStartDate("");
      setEventImage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create event. Please try again.", err);
      setFormLoading(false);
    }
  };

  return (
    <>
      {checkingAccess ? (
        <Loading />
      ) : (
        <>
          <SimpleHeader />
          <div className="create-event-container">
            <h2>Create an Event</h2>
            <form onSubmit={handleSubmit} className="create-event-form">
              <label>
                Event Name:
                <input
                  type="text"
                  placeholder="Event Name..."
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </label>
              <label>
                Venue Name:
                <input
                  type="text"
                  placeholder="Venue Name..."
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  required
                />
              </label>
              <label>
                Event image:
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={eventImage}
                  onChange={(e) => setEventImage(e.target.value)}
                  required
                />
              </label>
              {error && <ErrorComponent error={error} />}
              <button type="submit" disabled={formLoading}>
                {formLoading ? "Creating..." : "Create Event"}
              </button>
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default CreateEvents;
