import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Authentication/firebase";
import SimpleHeader from "./SimpleHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { createEvent } from "../api";

const CreateEvents = () => {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [venueId, setVenueId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
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

    if (!eventName || !startDate || !venueId || !imageUrl) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    const eventData = {
      event_name: eventName,
      start_date: startDate,
      venue_id: venueId,
      image_url: imageUrl,
    };

    createEvent(eventData)
      .then(() => {
        setLoading(false);
        alert("Event created");
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
          <div>ONLY STAFF CAN ACCESS THIS, YOU CAN DELETE EVENTS</div>
        </>
      )}
    </>
  );
};

export default CreateEvents;
