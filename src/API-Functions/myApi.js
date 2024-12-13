import axios from "axios";

const myApi = axios.create({
  baseURL: "https://my-back-end-project.onrender.com/api",
});

function postEvents(eventData, token) {
  console.log("eventData: ", eventData, "token: ", token);
  return myApi
    .post("/events", eventData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

function getMyEvents() {
  return myApi
    .get("/events")
    .then((response) => {
      return response.data.events;
    })
    .catch((error) => {
      throw error;
    });
}

export { postEvents, getMyEvents };
