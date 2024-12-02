import { useNavigate } from "react-router-dom";
import "../CSS/Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>Access Denied</h1>
      <p>You do not have permission to access this page.</p>
      <div className="button-group">
        <button className="go-home-button" onClick={() => navigate("/")}>
          Go to Homepage
        </button>
        <button className="go-auth-button" onClick={() => navigate("/auth")}>
          Register as Staff
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
