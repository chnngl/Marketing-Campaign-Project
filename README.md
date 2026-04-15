# Campaign Email Dispatch & Lead Capture App

A full-stack web application that supports:
- viewing marketing campaigns and their associated events
- sending campaign emails through Nodemailer and Ethereal for preview
- viewing a campaign landing page by slug
- submitting lead information from the landing page
- viewing submissions in a dashboard with pagination
- exporting submissions as CSV

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- SQLite via `better-sqlite3`
- Nodemailer
- Ethereal Email

### Frontend
- React
- TypeScript
- Tailwind CSS


## Implementation

### Backend API
- GET http://localhost:4000/api/campaigns

  Returns all campaigns with their associated events
- GET http://localhost:4000/api/campaigns/:id

  Returns a single campaign with associated events
- POST http://localhost:4000/api/campaigns/:id/send

  Sends a campaign email to a provided address

  Request body:

  {

      "recipientEmail": 

      "someone@example.com"

  }

- POST http://localhost:4000/api/landing/:slug/submit

  Saves a landing page form submission

  Request body:

  {
  
      "firstName": "Chang",

      "lastName": "Liu",

      "email": "Chang@example.com",

      "company": "Test Company"
  }

- GET http://localhost:4000/api/submissions

  Returns all submissions with campaign name included
- GET http://localhost:4000/api/submissions/export
  
  Downloads submissions as CSV

### Frontend Pages
- Campaign list page: http://localhost:5173/

- Campaign landing page for a specific campaign: http://localhost:5173/landing/:slug

- Submissions dashboard: http://localhost:5173/submissions

### Database
This project uses SQLite for database. On application startup, the database file is created locally if it does not exist. Campaigns and events are seeded from seed_campaigns.json. Seeding only runs when the campaigns table is empty to avoid duplicates.


### Email Service
Campaign emails are sent using Nodemailer with Ethereal Email as the test SMTP service.

When an email is sent, the frontend displays a link to open the Ethereal preview. The previe url can also be found in the terminal running backend. Click the CTA button in the email and it will open the landing page for that campaign.

## How to Run Locally
### Clone the repository
git clone https://github.com/chnngl/Marketing-Campaign-Project

cd "marketing campaign project"

### Run the backend

Open a terminal under the project root and run:

cd backend

npm install

npm run dev


The backend runs on: **http://localhost:4000**

### Run the frontend
Open another terminal and run:

cd frontend

npm install

npm run dev


The frontend runs on: **http://localhost:5173**