import "../CSS/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Authentication/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Header = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.error("No user data found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserDetails(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/auth");
      console.log("User logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <header>
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : userDetails ? (
        <>
          <p style={{ textAlign: "center" }}>
            Welcome {userDetails.username || "Guest"}
          </p>
          {userDetails.role === "Staff Member" && (
            <div>
              <Link to="/manage-events">
                <button className="home-button">
                  <p className="home-text">Manage Events</p>
                </button>
              </Link>
              <Link to="/create-events">
                <button className="home-button">
                  <p className="home-text">Create Events</p>
                </button>
              </Link>
            </div>
          )}
          <button className="home-button" onClick={handleLogout}>
            <p className="home-text">Log Out</p>
          </button>
        </>
      ) : (
        <>
          <p style={{ textAlign: "center" }}>
            Hello, <Link to="/auth">click to login/sing up</Link>
          </p>
        </>
      )}
      <h1 className="title">Horizon Events</h1>
      <h2 className="list-text">Top trending events</h2>
      <Link to="/">
        <button className="home-button">
          <p className="home-text">Home</p>
        </button>
      </Link>
    </header>
  );
};

export default Header;
