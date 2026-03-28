# FoodConnect

FoodConnect is a real-time, AI-powered food redistribution platform built for hackathon impact. It helps surplus food reach the right people faster, smarter, and before it expires.

Live Demo: [https://cursor-repo-food-infra.vercel.app/](https://cursor-repo-food-infra.vercel.app/)
Video Demo: [https://drive.google.com/file/d/1lKcNUp3xP3iLN7fpfgY-704gDM5mr4qI/view?usp=drive_link](https://drive.google.com/file/d/1lKcNUp3xP3iLN7fpfgY-704gDM5mr4qI/view?usp=drive_link)

## Vision

Food waste isn't just about excess - it's about inefficient matching and delayed action.

FoodConnect solves this by answering a critical question:

> Which food should be picked up first, by whom, and can it realistically be delivered in time?

## Key Highlights

- Real-time backend powered by Convex with instant sync and no manual refresh
- AI enrichment using the OpenAI API for urgency, priority, and recommendations
- Smart discovery via the Exa API to find relevant NGOs dynamically
- Urgency-first ranking system that prioritizes critical food
- Location-aware delivery feasibility using geocoding and time estimation
- Modern UI inspired by v0 and Mobbin
- Deployed on Vercel

## What Makes It Different

Unlike basic listing platforms, FoodConnect is decision-driven.

It doesn't just show food - it helps users understand:

- Which food is urgent
- Whether it can be delivered in time
- Who should take action

## Core Features

### 1. Food Contribution

Users can quickly add listings with:

- Food name
- Quantity in kilograms
- Expiry time in hours
- Location

### 2. Real-Time Listings

- Instant updates across all users
- Reactive Convex queries and mutations
- No refresh required

### 3. Claim System

- Prevents duplicate pickups
- Marks items as claimed in real time

### 4. AI Enrichment

Each listing is enhanced with:

- Urgency level
- Priority score
- Estimated people served
- Suggested action
- Deliverability status
- Recommended NGO categories

Fallback logic keeps the demo working even if an API call fails.

### 5. Location Intelligence

- Geocoding via OpenStreetMap Nominatim
- Delivery feasibility calculation
- Time-versus-expiry comparison

### 6. Urgent View

- Dedicated page for urgent and deliverable food
- Focus on high-impact actions first

### 7. NGO Discovery

- Smart search for nearby organizations
- Connects food supply to real-world demand

## Tech Stack

### Frontend

- React
- Vite
- React Router
- UI inspired by v0 and Mobbin

### Backend

- Convex for the real-time backend and database

### AI and APIs

- OpenAI API for the intelligence layer
- Exa API for organization discovery
- OpenStreetMap Nominatim for geocoding

### Deployment

- Vercel for frontend hosting and integration

## How It Works

1. A user adds a food listing.
2. The location is geocoded.
3. AI enriches the listing.
4. Data is stored in Convex.
5. Listings update in real time.
6. Users browse, filter, and claim.
7. The system prioritizes urgent and feasible deliveries.

## Demo Flow

1. Log in
2. Add a food listing
3. View it in the real-time feed
4. Open the detailed page
5. Show AI insights such as urgency and priority
6. Demonstrate NGO search with Exa
7. Claim the listing
8. Visit the urgent page

## Project Structure

```text
food-redistributions/
├── backend/
│   └── convex/
│       ├── auth.js
│       ├── food.js
│       ├── schema.js
│       └── _generated/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   └── convex/
    ├── vercel.json
    └── package.json
```

## Local Setup

### Prerequisites

- Node.js
- npm
- Convex account
- OpenAI API key
- Exa API key

### 1. Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

### 2. Environment variables

Frontend (`frontend/.env.local`):

```env
VITE_CONVEX_URL=your_convex_url
```

Backend (`backend/.env.local`):

```env
OPENAI_API_KEY=your_openai_key
EXA_API_KEY=your_exa_key
```

### 3. Run backend

```bash
cd backend
npx convex dev
```

### 4. Run frontend

```bash
cd frontend
npm run dev
```

## Deployment

- Frontend deployed on Vercel
- Backend handled by Convex

Recommended Vercel settings:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

## Notes

- Prototype built for hackathon speed
- Lightweight authentication
- Some features are demo-optimized

## Future Improvements

- Production-grade authentication
- NGO-side platform
- Expiry alerts and notifications
- Map-based UI
- Image uploads
- Accessibility and multilingual support

## Author

Aryan Gupta

## Final Thought

FoodConnect is not just a project - it's a decision engine for food rescue.

It shows how real-time systems, AI, and smart discovery can work together to solve a real-world problem at scale.
