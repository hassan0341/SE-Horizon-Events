import "../CSS/Error.css";

// eslint-disable-next-line react/prop-types
function ErrorComponent({ error }) {
  return <p className="error-message">{error}</p>;
}

export default ErrorComponent;
