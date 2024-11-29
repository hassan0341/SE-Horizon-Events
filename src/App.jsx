import "./CSS/App.css";
import EventList from "./Components/EventList";
import SingleEvent from "./Components/SingleEvent";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./Authentication/AuthForm";
import ManageEvents from "./Components/ManageEvents";
import CreateEvents from "./Components/CreateEvents";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/events/:id" element={<SingleEvent />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/create-events" element={<CreateEvents />} />
      </Routes>
    </>
  );
}

export default App;
