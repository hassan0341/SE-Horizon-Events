import axios from "axios";

const api = axios.create({
  baseURL: "https://app.ticketmaster.com/discovery/v2",
});

const eventBriteAPI = axios.create({
  baseURL: "https://www.eventbriteapi.com/v3/events",
  headers: {
    Authorization: "V2KMIQ75XD2WSBNCID4K",
    Accept: "application/json",
  },
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

function createEvent(eventData) {
  const organizationId = "199307250586";

  return eventBriteAPI
    .post(`/organizations/${organizationId}/events/`, {
      event: {
        name: {
          html: eventData.event_name,
        },
        description: {
          timezone: "Europe/London",
          html: eventData.description,
        },
        start: {
          timezone: "Europe/London",
          html: eventData.start_date,
        },
        end: {
          html: eventData.end_date,
        },
        venue_id: eventData.venue_id,
        currency: "GBP",
        logo_id: eventData.image_url,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(
        error.response
          ? error.response.data.error_description
          : "Error creating event"
      );
      throw error;
    });
}

export { getEvents, getEventById, createEvent };
