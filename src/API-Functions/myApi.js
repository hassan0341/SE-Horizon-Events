import axios from "axios";

const myApi = axios.create({
  baseURL: "https://my-back-end-project.onrender.com/api",
});

function postEvents(eventData, token) {
  return myApi
    .post("/events", eventData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
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

function getEventsByCreator(creator, token) {
  return myApi
    .get(`/events/creator/${creator}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data.events)
    .catch((error) => {
      throw error;
    });
}

function getMyEventById(id) {
  return myApi
    .get(`/events/${id}`)
    .then((response) => {
      return response.data.event;
    })
    .catch((error) => {
      throw error;
    });
}

function deleteEventById(id, token) {
  return myApi.delete(`/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export {
  postEvents,
  getMyEvents,
  getEventsByCreator,
  getMyEventById,
  deleteEventById,
};
