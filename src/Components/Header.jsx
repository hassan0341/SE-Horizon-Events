import "../CSS/Header.css";
import { Link } from "react-router-dom";
import { auth } from "../Authentication/firebase";

const Header = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
      console.log("User logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <header>
      <h1 className="title">Horizon Events</h1>
      <h2 className="list-text">Top trending events</h2>
      <Link to="/events">
        <button className="home-button">
          <p className="home-text">Home</p>
        </button>
      </Link>
      <button className="home-button" onClick={handleLogout}>
        <p className="home-text">Log Out</p>
      </button>
    </header>
  );
};

export default Header;
