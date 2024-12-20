import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  const [isCreator, setIsCreator] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const isTicketmaster = /[a-zA-Z]/.test(id) && /\d/.test(id);
    const eventDataFunction = isTicketmaster ? getEventById : getMyEventById;

    eventDataFunction(id)
      .then((eventData) => {
        setEvent(eventData);
        setLoading(false);
        setIsError(null);

        if (user) {
          const userRef = doc(db, "Users", user.uid);
          getDoc(userRef)
            .then((docSnap) => {
              if (docSnap.exists()) {
                const userData = docSnap.data();
                const signedUpEvents = userData.signedUpEvents || [];
                setIsSignedUp(signedUpEvents.includes(id));

                if (
                  !isTicketmaster &&
                  eventData.creator === userData.username
                ) {
                  setIsCreator(true);
                }
              }
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        } else {
          setIsSignedUp(false);
        }
      })
      .catch((error) => {
        setIsError(error.message);
        setLoading(false);
      });
  }, [id, user]);

  const handleSignUp = async () => {
    setLoading(true);
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
            setLoading(false);
          } else {
            setIsSignedUp(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error signing up for event:", error);
      }
    }
  };

  const handleAddToCalendar = () => {
    const startDate = event.start_date || event.dates?.start?.localDate;
    const formattedStartDate =
      startDate.replace(/-/g, "") + "T" + startDate.replace(/-/g, "") + "Z";
    const eventUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
      event?.event_name || event?.name
    )}&dates=${formattedStartDate}/${formattedStartDate}&details=Check+out+this+event!&location=${encodeURIComponent(
      event?._embedded?.venues?.[0]?.name || event.venue || "Unknown location"
    )}`;

    window.open(eventUrl, "_blank");
  };
  if (loading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent error={isError} />;
  }

  return (
    <>
      <SimpleHeader />
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
        {isCreator ? (
          <p className="creator-message"> ✨ This is an event you created!</p>
        ) : user ? (
          !isSignedUp ? (
            <button onClick={handleSignUp}>
              {loading ? "Loading..." : "Sign up to event"}
            </button>
          ) : (
            <>
              <p className="signed-message">
                ✅ You are signed up to this event!
              </p>
              <button className="google-button" onClick={handleAddToCalendar}>
                Add this event to your Google Calendar
              </button>
            </>
          )
        ) : (
          <p style={{ color: "white" }}>
            Please{" "}
            <Link to="/auth" className="auth-link">
              log in or register
            </Link>{" "}
            if you want to sign up for this event
          </p>
        )}
      </main>
    </>
  );
};
export default SingleEvent;
