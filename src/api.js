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

// Fetch Organizations
function getOrganizations() {
  return eventBriteAPI
    .get("/users/me/organizations")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching organizations:", error.message);
      throw error;
    });
}

// Create Event
function createEvent(organizationId, eventData) {
  return eventBriteAPI
    .post(`/organizations/${organizationId}/events`, {
      event: {
        name: { html: eventData.event_name },
        start: {
          timezone: "America/Los_Angeles",
          utc: eventData.start_date,
        },
        end: {
          timezone: "America/Los_Angeles",
          utc: eventData.end_date,
        },
        currency: eventData.currency,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating event:", error.message);
      throw error;
    });
}

// Create Ticket Tier
function createTicketsTiers(eventId, ticketData) {
  return eventBriteAPI
    .post(`/events/${eventId}/inventory_tiers`, {
      inventory_tier: {
        name: ticketData.name,
        quantity_total: ticketData.quantity,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating ticket tiers:", error.message);
      throw error;
    });
}

// Assign Ticket Tier
function assignTicketTiersToEvent(eventId, ticketTierId, ticketData) {
  return eventBriteAPI
    .post(`/events/${eventId}/ticket_classes`, {
      ticket_class: {
        name: ticketData.name,
        cost: ticketData.cost, // e.g., USD,1000
        inventory_tier_id: ticketTierId,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error assigning ticket tiers:", error.message);
      throw error;
    });
}

export {
  getEvents,
  getEventById,
  getOrganizations,
  createEvent,
  createTicketsTiers,
  assignTicketTiersToEvent,
};
