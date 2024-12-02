import "./CSS/App.css";
import EventList from "./Components/EventList";
import SingleEvent from "./Components/SingleEvent";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./Authentication/AuthForm";
import ManageEvents from "./Components/ManageEvents";
import CreateEvents from "./Components/CreateEvents";
import Unauthorized from "./Components/Unauthorized";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/events/:id" element={<SingleEvent />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/create-events" element={<CreateEvents />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;
