import "../CSS/SimpleHeader.css";
import { Link } from "react-router-dom";

const SimpleHeader = () => {
  return (
    <header className="simple-header">
      <div className="header-content">
        <h1 className="header-title">Horizon Events</h1>
        <Link to="/">
          <button className="home-button">Home</button>
        </Link>
      </div>
    </header>
  );
};

export default SimpleHeader;
