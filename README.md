# Horizon Events: Event Management Platform

## Project Summary
Horizon Events is a responsive, user-friendly platform designed to make event browsing, sign-ups, and event management. With this application, users can explore a list of events, sign up for their favourites, and add them to their Google Calendar. Staff members can create, manage, and edit events.

### Key Features:
- **Browse Events:** Users can browse a list of events from a freely available API or custom data.  
- **Sign Up:** Users can sign up for events with ease.  
- **Google Calendar Integration:** Add signed-up events directly to Google Calendar.  
- **Staff Management:** Staff members can log in, create, edit, and delete events.  
- **Responsive Design:** Works across various devices and screen sizes.  

---

## Hosted Version
**[Hosted Version URL](#)**  
_This section will be updated once the hosted version is available._

---

## Backend Repository

[Link to Backend Repository](https://github.com/hassan0341/My-Back-End-Project)

## Minimum Node Version

Node.js v21.6.1 or higher is required to run this project locally.

## Local Setup

To run this project locally, follow these steps:

1. **Clone the repository:**

```sh
git clone https://github.com/hassan0341/SE-Events.git
```

2. **Navigate to the project directory:**

```sh
cd/project-directory
```

3. **Install dependencies:**

```sh
npm install
```

4. **Create Environment File:**

   - Create a `.env` For development environment variables, create a file named `.env.development`.
   - Ticketmaster API Key:
     - You will need to create an account with Ticketmaster and get your API key. Once you have your API key, add it to the .env file like this:
      ```sh
      VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key
      ```
   - **Firebase Configuration**:  
  To use Firebase Authentication and Firestore, you need to set up Firebase in your project:
  
  - Create a Firebase project by following the instructions in the [Firebase Console](https://console.firebase.google.com/).
  - After setting up Firebase, you'll get your Firebase configuration details.
  - Now, create a `.env` file in the root of your project and add your Firebase configuration:

  ```sh
  VITE_FIREBASE_API_KEY=your_firebase_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
  VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
  VITE_FIREBASE_APP_ID=your_firebase_app_id
  ```


4. **Start the development server:**

```sh
npm run dev
```

5. **On terminal click `http://localhost:####` to open your web browser and view the app locally.**

```sh
http://localhost:####
```

## Tech Stack
- **Frontend:** React.js  
- **Backend:** Node.js with Express.js  
- **Database:** PostgreSQL  
- **Authentication:** Firebase Authentication  
- **API Integration:** Ticketmaster API and my custom event API  
- **Styling:** CSS  
- **Hosting:** Render for the backend, Netlify for the frontend  

---
