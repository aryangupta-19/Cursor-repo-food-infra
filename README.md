# FoodConnect

FoodConnect is a food redistribution prototype built for hackathon use. The goal is simple: let people post surplus food quickly, help nearby users or NGOs discover what is available, and add enough intelligence to prioritize food that should be acted on first.

The project is designed as a practical prototype rather than a static demo. It supports food listing, claiming, location-aware matching, urgency-based ranking, and AI-enriched recommendations.

## What The App Does

- Users can sign up, log in, and log out.
- Logged-in users can add food listings with food name, quantity in kilograms, expiry in hours, and location.
- Food listings are stored in Convex and shown in real time across the app.
- Listings can be claimed so that duplicate pickup is avoided.
- The system geocodes locations and estimates delivery feasibility based on distance and expiry.
- Listings are enriched with AI-generated fields such as urgency, suggested action, estimated people served, priority score, and recommended NGO categories.
- Urgent and deliverable items can be viewed separately through a focused urgent page.
- Each listing has a detailed view where users can inspect the full information and search for nearby organizations using Exa.

## Why We Built It

A lot of food donation flows break not because food is unavailable, but because the matching is slow, unclear, or poorly prioritized. We wanted to build a prototype that does more than just list food. FoodConnect tries to answer a more useful question:

"Which food should be picked up first, by whom, and can it realistically be delivered in time?"

That is why the project combines real-time infrastructure, location awareness, and AI-based prioritization.

## Main Features

### 1. Food Contribution

Users can add a food listing with:

- food name
- quantity in kilograms
- expiry time in hours
- location

### 2. Real-Time Food Listings

All data is stored in Convex, and listings update through Convex queries and mutations. This gives the project a real-time backend feel without having to manually refresh the interface.

### 3. Claim Flow

Users can claim food items, and claimed listings are clearly marked so the same food is not picked up twice.

### 4. AI Enrichment

When a listing is created, the backend enriches it with:

- urgency level
- estimated people served
- suggested action
- priority score
- deliverable / non-deliverable status
- recommended NGO categories

If the AI API is unavailable, the backend falls back to deterministic logic so the app still works in demo conditions.

### 5. Location and Delivery Logic

Locations are geocoded into coordinates. The app uses those coordinates to estimate delivery time and determine whether a food item can realistically be delivered before expiry.

### 6. Urgent View

There is a dedicated urgent page that shows only urgent and deliverable items. This makes it easier to surface the most time-sensitive opportunities first.

### 7. Exa Integration

The detailed listing page includes Exa-based organization search. In this prototype, that feature demonstrates how the platform can connect food opportunities with nearby recipient organizations and external discovery tools.

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
    │   ├── components /
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   └── convex/
    ├── vercel.json
    └── package.json
```

## Tech Stack

- React
- Vite
- React Router
- Convex
- OpenAI API
- Exa API
- OpenStreetMap Nominatim geocoding
- CSS

## How It Works

1. A user adds a food listing.
2. The backend geocodes the location.
3. The backend enriches the listing with AI-generated fields.
4. The food item is saved in Convex.
5. Logged-in users can browse, filter, inspect, and claim listings.
6. The app ranks listings by urgency and deliverability so the most useful items are easier to act on.

## Local Setup

### Prerequisites

- Node.js
- npm
- Convex account and project
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

Frontend:

Create `frontend/.env.local` and set:

```env
VITE_CONVEX_URL=your_convex_url
```

Backend:

Create `backend/.env.local` and set:

```env
OPENAI_API_KEY=your_openai_key
EXA_API_KEY=your_exa_key
```

### 3. Run the backend

```bash
cd backend
npx convex dev
```

### 4. Run the frontend

```bash
cd frontend
npm run dev
```

## Deployment

The frontend is set up for deployment on Vercel.

Recommended Vercel settings:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Required frontend environment variable:

- `VITE_CONVEX_URL`

Convex handles the backend deployment and runtime environment.

## Demo Flow

The simplest end-to-end demo flow is:

1. Log in
2. Add a new food listing
3. Show it in browse
4. Open the detailed listing page
5. Show urgency, deliverability, and AI-enriched information
6. Use Exa organization search
7. Claim a listing
8. Show the urgent page

## Notes

- This project is a hackathon prototype, not a production-ready platform.
- The authentication flow is intentionally lightweight and optimized for demo speed.
- Some UI elements, such as the expiry timer, are currently shown as prototype-facing product behavior rather than hard enforcement logic.

## Future Improvements

- Production-grade authentication
- True NGO-side food discovery at scale
- Automated expiry handling and alert delivery
- Better map visualization
- File uploads for food photos
- Richer multilingual and accessibility support

## Authors

Built as a hackathon project exploring real-time food redistribution, AI prioritization, and location-aware matching.
