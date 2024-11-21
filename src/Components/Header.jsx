import "../CSS/Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
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
