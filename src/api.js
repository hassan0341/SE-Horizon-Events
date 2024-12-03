import axios from "axios";

const api = axios.create({
  baseURL: "https://app.ticketmaster.com/discovery/v2",
});

const eventBriteAPI = axios.create({
  baseURL: "https://www.eventbriteapi.com/v3",
  headers: {
    Authorization: "Bearer V2KMIQ75XD2WSBNCID4K",
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
    .post(
      `/organizations/${organizationId}/events/`,
      {
        event: {
          name: {
            html: eventData.event_name,
          },
          start: {
            timezone: "America/Los_Angeles", // Adjust to the event timezone
            utc: eventData.start_date, // Start date in UTC
          },
          end: {
            timezone: "America/Los_Angeles", // Adjust to the event timezone
            utc: eventData.end_date, // End date in UTC
          },
          currency: "USD", // Adjust currency as needed
        },
      },
      {
        headers: {
          Authorization: `Bearer V2KMIQ75XD2WSBNCID4K`,
        },
      }
    )
    .then((response) => {
      return response.data; // Success: Return the event data
    })
    .catch((error) => {
      console.error(
        error.response
          ? error.response.data.error_description
          : "Error creating event"
      );
      throw error;
    });
}

function createTicketClass(eventId, ticketData) {
  return eventBriteAPI
    .post(`/events/${eventId}/ticket_classes`, {
      ticket_class: {
        name: ticketData.name,
        quantity_total: ticketData.quantity,
        cost: ticketData.cost,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(
        error.response
          ? error.response.data.error_description
          : "Error creating ticket class"
      );
    });
}

function publishEvent(eventId) {
  return eventBriteAPI
    .post(`/events/${eventId}/publish/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(
        error.response
          ? error.response.data.error_description
          : "Error creating ticket class"
      );
    });
}

export {
  getEvents,
  getEventById,
  createEvent,
  createTicketClass,
  publishEvent,
};
