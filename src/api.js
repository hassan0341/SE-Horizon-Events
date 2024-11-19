import axios from "axios";

const api = axios.create({
  baseURL: "https://app.ticketmaster.com/discovery/v2",
});

export function getEvents() {
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
    });
}
