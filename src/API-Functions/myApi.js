import axios from "axios";

const myApi = axios.create({
  baseURL: "https://my-back-end-project.onrender.com/api",
});

function postEvents(eventData) {
  return myApi
    .post("/events", eventData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

function getMyEvents() {
  return myApi.get("/events").then((response) => {
    console.log(response.data.events);
    return response.data.events;
  });
}

export { postEvents, getMyEvents };
