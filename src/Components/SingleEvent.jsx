import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../API-Functions/api";
import SimpleHeader from "../Components/SimpleHeader";
import "../CSS/SingleEvent.css";
import Loading from "./Loading";
import ErrorComponent from "./ErrorComponent";
import { getMyEventById } from "../API-Functions/myApi";
import { format } from "date-fns";
import { auth, db } from "../Authentication/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const SingleEvent = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const isTicketmaster = /[a-zA-Z]/.test(id) && /\d/.test(id);
        const eventDataFunction = isTicketmaster
          ? getEventById
          : getMyEventById;

        eventDataFunction(id)
          .then((eventData) => {
            setEvent(eventData);
            setLoading(false);
            setIsError(null);

            const userRef = doc(db, "Users", currentUser.uid);
            getDoc(userRef)
              .then((docSnap) => {
                if (docSnap.exists()) {
                  const userData = docSnap.data();
                  const signedUpEvents = userData.signedUpEvents || [];
                  setIsSignedUp(signedUpEvents.includes(id));
                }
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
              });
          })
          .catch((error) => {
            setIsError(error.message);
            setLoading(false);
          });
      } else {
        setLoading(false);
        setIsSignedUp(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const handleSignUp = async () => {
    if (user) {
      try {
        const userRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const signedUpEvents = userData.signedUpEvents || [];

          if (!signedUpEvents.includes(id)) {
            signedUpEvents.push(id);
            await updateDoc(userRef, { signedUpEvents });
            setIsSignedUp(true);
          } else {
            setIsSignedUp(true);
          }
        }
      } catch (error) {
        console.error("Error signing up for event:", error);
      }
    }
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
