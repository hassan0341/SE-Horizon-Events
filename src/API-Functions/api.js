import axios from "axios";

const api = axios.create({
  baseURL: "https://app.ticketmaster.com/discovery/v2",
});

function getEvents() {
  return api
    .get("/events.json", {
      params: {
        apikey: "iuQORba1fu662UjAtHOGfZNbboHlXXgm",
        countryCode: "GB",
      },
    })
    .then((response) => {
      const results = response.data._embedded.events;
      return results;
    })
    .catch((error) => {
      throw error;
    });
}

function getEventById(id) {
  return api
    .get(`/events/${id}.json`, {
      params: {
        apikey: "iuQORba1fu662UjAtHOGfZNbboHlXXgm",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.message, "<<<< In GET EVENTS");
      throw error;
    });
}

export { getEvents, getEventById };
