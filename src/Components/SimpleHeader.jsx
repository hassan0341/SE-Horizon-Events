import "../CSS/Header.css";
import { Link } from "react-router-dom";

const SimpleHeader = () => {
  return (
    <header>
      <h1 className="title">Horizon Events</h1>
      <Link to="/">
        <button className="home-button">
          <p className="home-text">Home</p>
        </button>
      </Link>
    </header>
  );
};

export default SimpleHeader;
