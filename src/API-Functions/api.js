import axios from "axios";

const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

const api = axios.create({
  baseURL: "https://app.ticketmaster.com/discovery/v2",
});

function getEvents() {
  return api
    .get("/events.json", {
      params: {
        apikey: apiKey,
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
        apikey: apiKey,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export { getEvents, getEventById };
