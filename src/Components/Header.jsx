import "../CSS/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Authentication/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Header = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            setError("No user data found in Firestore.");
          }
        } catch (error) {
          setError("Error fetching user data:", error);
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
    } catch (error) {
      setError(error);
    }
  };

  return (
    <header className="header">
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : userDetails ? (
        <>
          <div className="welcome-section">
            <p className="welcome-message">
              Welcome, {userDetails.username || "Guest"}
            </p>
            {userDetails.role === "Staff Member" && (
              <div className="staff-buttons">
                <Link to="/manage-events">
                  <button className="nav-button">Manage Events</button>
                </Link>
                <Link to="/create-events">
                  <button className="nav-button">Create Events</button>
                </Link>
                <button className="logout-button" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="auth-message">
            Hello, <Link to="/auth">click to login/sign up</Link>
          </p>
          {error && <p className="error-text">{error}</p>}
        </>
      )}
      <div className="title-section">
        <h1 className="title">Horizon Events</h1>
        <h2 className="subtitle">Top trending events</h2>
        <Link to="/">
          <button className="home-button">Home</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
