import "./CSS/App.css";
import EventList from "./Components/EventList";
import SingleEvent from "./Components/SingleEvent";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./Authentication/AuthForm";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<SingleEvent />} />
      </Routes>
    </>
  );
}

export default App;
