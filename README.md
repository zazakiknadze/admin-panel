# Admin Panel

## Project Overview

This is a React + TypeScript admin panel for managing three gaming features:

- Wheel
- Raffle
- Leaderboard

The app allows you to:

- View lists with pagination and sorting
- See detailed records
- Create, update, and delete entries
  Data is powered by a mock REST API using `json-server`.

---

## Key Architectural Decisions

1. Feature-first folder organization (each of `wheel`, `raffle`, `leaderboard` owns its table/detail/form/hooks/`validations`). This keeps UI, API wrappers, and validation rules close together, reducing cross-feature coupling and making new features follow an established pattern.
2. Clear separation of concerns: UI -> feature API modules (using `axios`) -> React Query hooks. The UI stays focused on rendering/state, while React Query owns server-state concerns (caching, retries, request deduplication, and consistent error handling via toast).
3. Form correctness enforced with schema-driven validation (`react-hook-form` + `zod`), paired with a global error boundary (`react-error-boundary`). Using a schema prevents invalid payloads from being submitted, and the boundary ensures unexpected runtime errors fail gracefully instead of breaking the entire app.

## Project Structure

The project is organized by feature and responsibility.

### Pages (`src/pages/*`)

Each feature (`wheel`, `raffle`, `leaderboard`) contains:

- List view (table)
- Detail page
- Create/Edit form

Forms use:

- `react-hook-form` for state
- `zod` for validation (`validations/`)

---

### API Layer (`src/services/api/*`)

Each feature has its own API module using `axios`.

Responsibilities:

- Define endpoints
- Handle HTTP requests (`GET`, `POST`, `PUT`, `DELETE`)
- Keep API logic separate from UI

---

### Hooks (`src/pages/**/hooks/*`)

Custom hooks:

- Use `@tanstack/react-query` for data fetching
- Transform `x-total-count` header into `{ data, total }`

---

### React Query Provider

`src/services/react-query/provider.tsx`

- Configures global `QueryClient`
- Handles API errors with `react-toastify`

---

### Shared Components (`src/components/*`)

Reusable UI:

- Layout (AppBar + Sidebar)
- Navigation
- Breadcrumbs
- Loaders / Empty states
- Error boundaries

### Folderstructure diagram:

```text
.
├─ db.json                               # Mock database for json-server
├─ package.json
├─ .env / .env.example                  # VITE_API_BASE_URL
└─ src/
   ├─ App.tsx                            # RouterProvider + global providers
   ├─ main.tsx                           # React root mount
   ├─ router/
   │  └─ routes.tsx                      # Route tree for Layout + feature pages
   ├─ components/
   │  ├─ layout/                         # AppBar + Drawer + Outlet
   │  ├─ sidebar/                        # Sidebar links from routes
   │  ├─ breadcrumbs/
   │  └─ errorFallBack/                 # Global and page-level fallbacks
   ├─ pages/
   │  ├─ wheel/
   │  │  ├─ wheel.tsx                   # List view
   │  │  ├─ wheelTable.tsx             # Table UI
   │  │  ├─ wheelDetail.tsx           # Details view
   │  │  ├─ wheelForm.tsx             # Create/Edit form
   │  │  ├─ hooks/                     # useWheelData, mutations, etc.
   │  │  └─ validations/              # zod schema
   │  ├─ raffle/
   │  │  └─ (raffle.tsx, raffleTable.tsx, raffleDetail.tsx, raffleForm.tsx, hooks/, validations/)
   │  └─ leaderboard/
   │     └─ (leaderBoardTable.tsx, leaderBoardDetail.tsx, leaderboardForm.tsx, hooks/, validations/)
   ├─ services/
   │  ├─ api/
   │  │  ├─ axios.ts                    # axios instance (baseURL from env)
   │  │  ├─ wheel/index.ts            # /wheels wrapper functions
   │  │  ├─ raffle/index.ts           # /raffles wrapper functions
   │  │  └─ leaderboard/index.ts     # /leaderboards wrapper functions
   │  └─ react-query/
   │     └─ provider.tsx               # QueryClient + toast error handling
   ├─ interfaces/                         # Shared types + enums (Wheel/Raffle/Leaderboard)
   ├─ constants/                         # React-query query keys
   └─ utils/                              # Param cleaning & helpers
```

---

## Tech Stack

- React 18 | ^18.3.1` | UI library
- TypeScript | `~5.9.3` | Types for the app
- Vite | `^8.0.1` | Development/build tooling
- React Router DOM | `^6.30.3` | Routing between pages
- Material UI (MUI) | `^5.18.0` | App layout + tables and forms styling
- Axios | `^1.13.6` | HTTP client to mock API
- JSON Server | `^0.17.4` | Mock REST API server
- @tanstack/react-query | `^5.95.2` | Data fetching for tables and details
- react-hook-form | `^7.72.0` | Form state management
- zod | `^4.3.6` | Runtime form validation
- react-toastify | `^11.0.5` | Toast notifications for API errors/success
- react-error-boundary | `^6.1.1` | Global Error boundary UI

---

## Getting Started

### Prerequisites

- Node.js
- npm

---

### Installation

Prerequisites:

- Node.js and npm

1. Install dependencies:
   - `npm install`
2. Install dependencies:
   - `cp .env.example .env`
3. Start the mock API (json-server) in a terminal:
   - `npm run server`
   - It serves data from `db.json` on `http://localhost:3001` (controlled by `VITE_API_BASE_URL`).
4. Start the frontend (Vite) in another terminal:
   - `npm run dev`
5. Open the app in your browser (by default it is `http://localhost:5173`).

Notes:

- To run the whole app, keep `npm run server` running while you use `npm run dev`.
- If `.env` is missing or changed, ensure `VITE_API_BASE_URL` is set correctly (default in `.env.example` is `http://localhost:3001`).

---

### Available Scripts

```text

npm run dev       # Start dev server
npm run build     # Build project
npm run preview   # Preview build
npm run lint      # Run ESLint
npm run server    # Start json-server

```

---

### API Reference

Base URL:

- `VITE_API_BASE_URL` (default: `http://localhost:3001`)

The mock server is `json-server`, with collections backed by `db.json`:

- `wheels`
- `raffles`
- `leaderboards`

### Pagination / Sorting behavior

For list endpoints, the client sends json-server parameters:

- `_page`, `_limit` for pagination
- `_sort`, `_order` for sorting
  The UI reads the total count from the response header `x-total-count`.

### Common request/response

- List endpoints (`GET /{collection}`) return an array.
- Detail endpoints (`GET /{collection}/:id`) return a single object.
- Create/update endpoints (`POST`/`PUT`) return the created/updated object.
- Deletes are handled by `DELETE /{collection}/:id`.

### Wheels

Endpoints (paths are relative to `VITE_API_BASE_URL`):

- `GET /wheels`
  - Query parameters (all optional):
    - `_page`, `_limit`, `_sort`, `_order`
    - `status` (string; uses `WheelStatus` values: `draft|active|inactive`)
  - Response: `Wheel[]`
- `GET /wheels/:id`
  - Response: `Wheel`
- `POST /wheels`
  - Request body: `Partial<Wheel>`
  - Response: created `Wheel`
- `PUT /wheels/:id`
  - Request body: `Partial<Wheel>`
  - Response: updated `Wheel`
- `DELETE /wheels/:id`
  - Response: json-server delete response

Example: create/update request body (`Partial<Wheel>`)

```json
{
  "id": "4",
  "name": "Wheel 4",
  "description": "Wheel 4 description",
  "status": "draft",
  "spinCost": 100,
  "maxSpinsPerUser": 10,
  "backgroundColor": "#FF0000",
  "borderColor": "#FF0000",
  "segments": [
    {
      "id": "1",
      "label": "Segment 1",
      "color": "#FF0000",
      "weight": 50,
      "prizeType": "coins",
      "prizeAmount": 100,
      "imageUrl": ""
    },
    {
      "id": "2",
      "label": "Segment 2",
      "color": "#000000",
      "weight": 50,
      "prizeType": "nothing",
      "prizeAmount": 0,
      "imageUrl": ""
    }
  ],
  "createdAt": "2026-03-30",
  "updatedAt": "2026-03-30"
}
```

Example: `Wheel` (response)

```json
{
  "id": "1",
  "name": "Wheel 1",
  "description": "Wheel 1 descriptionxccx",
  "status": "active",
  "segments": [
    {
      "id": "1",
      "label": "Segment 1",
      "color": "#F54927",
      "weight": 20,
      "prizeType": "coins",
      "prizeAmount": 100,
      "imageUrl": ""
    }
  ],
  "maxSpinsPerUser": 10,
  "spinCost": 100,
  "backgroundColor": "#F54927",
  "borderColor": "#F54927",
  "createdAt": "2026-03-29",
  "updatedAt": "2026-03-29"
}
```

### Raffles

Endpoints:

- `GET /raffles`
  - Query parameters (all optional):
    - `_page`, `_limit`, `_sort`, `_order`
    - `status` (`draft|active|drawn|cancelled`)
    - `startDate_gte` (string date)
    - `endDate_lte` (string date)
  - Response: `Raffle[]`
- `GET /raffles/:id`
  - Response: `Raffle`
- `POST /raffles`
  - Request body: `Partial<Raffle>`
  - Response: created `Raffle`
- `PUT /raffles/:id`
  - Request body: `Partial<Raffle>`
  - Response: updated `Raffle`
- `DELETE /raffles/:id`
  - Response: json-server delete response

Example: create/update request body (`Partial<Raffle>`)

```json
{
  "id": "12",
  "name": "Raffle 12",
  "description": "Raffle 12 description",
  "startDate": "2026-03-01",
  "endDate": "2026-04-01",
  "drawDate": "2026-04-05",
  "status": "active",
  "ticketPrice": 150,
  "maxTicketsPerUser": 10,
  "totalTicketLimit": null,
  "prizes": [
    {
      "id": "1",
      "name": "Gold Prize",
      "type": "coins",
      "amount": 1000,
      "quantity": 1,
      "imageUrl": ""
    }
  ],
  "createdAt": "2026-03-30",
  "updatedAt": "2026-03-30"
}
```

Example: `Raffle` (response)

```json
{
  "id": "1",
  "name": "Raffle 1",
  "description": "Raffle 1 description",
  "startDate": "2025-08-12",
  "endDate": "2026-04-01",
  "drawDate": "2026-04-05",
  "status": "active",
  "ticketPrice": 100,
  "maxTicketsPerUser": 10,
  "totalTicketLimit": 1000,
  "prizes": [
    {
      "id": "1",
      "name": "Gold Prize",
      "type": "coins",
      "amount": 1000,
      "quantity": 1,
      "imageUrl": "https://framerusercontent.com/images/oaSI2TKrLp2ZRsWhatqJVMG1lmY.png"
    }
  ],
  "createdAt": "2025-08-12",
  "updatedAt": "2026-03-01"
}
```

### Leaderboards

Endpoints:

- `GET /leaderboards`
  - Query parameters (all optional):
    - `_page`, `_limit`, `_sort`, `_order`
    - `status` (`draft|active|completed`)
  - Response: `Leaderboard[]`
- `GET /leaderboards/:id`
  - Response: `Leaderboard`
- `POST /leaderboards`
  - Request body: `Partial<Leaderboard>` (client also sets `id`, `createdAt`, `updatedAt`)
  - Response: created `Leaderboard`
- `PUT /leaderboards/:id`
  - Request body: `Partial<Leaderboard>`
  - Response: updated `Leaderboard`
- `DELETE /leaderboards/:id`
  - Response: json-server delete response

Example: create/update request body (`Partial<Leaderboard>`)

```json
{
  "id": "3",
  "title": "Leaderboard 3",
  "description": "Seasonal leaderboard",
  "startDate": "2026-03-01",
  "endDate": "2026-04-01",
  "status": "active",
  "scoringType": "points",
  "prizes": [
    {
      "id": "1",
      "rank": 1,
      "name": "Gold Prize",
      "type": "coins",
      "amount": 1000,
      "imageUrl": ""
    }
  ],
  "maxParticipants": 100,
  "createdAt": "2026-03-30",
  "updatedAt": "2026-03-30"
}
```

Example: `Leaderboard` (response)

```json
{
  "id": "1",
  "title": "Spring Tournament",
  "description": "Seasonal leaderboard",
  "startDate": "2025-08-12",
  "endDate": "2026-04-01",
  "status": "active",
  "scoringType": "points",
  "prizes": [
    {
      "id": "1",
      "rank": 1,
      "name": "Gold Prize",
      "type": "coins",
      "amount": 1000,
      "imageUrl": "https://framerusercontent.com/images/oaSI2TKrLp2ZRsWhatqJVMG1lmY.png"
    }
  ],
  "maxParticipants": 100,
  "createdAt": "2025-08-12",
  "updatedAt": "2026-03-01"
}
```

---

### Design Decisions

ცენტრალიზებული კომპონენტის გამოყენება ცხრილების ყველა გვერდებზე (StateHandler)

მონაცემების წამოღების დროს ყველა გვერდზე საჭირო იყო მოლოდინის და შეცდომის შემთხვევის გათვალისწინება.
ამისათვის შევქმენი high-level კომპონენტი რომელიც ამუშავებს მონაცემებს(Loading/Error/Empty?data) და გამოაქვს შესაბამისი კონტენტი.
ამით ცხრილების გვერდებზე შემცირდა კოდი და უფრო მატივი გახდა მისი წაკითხვა.

დინამიური Redirect

რადგან არ გვაქვს Home Page ამიტომ http://localhost:5173/-ზე შესვლისას დინამუირი გადამისამართების საშუალებით მომხმარებელი მოხვდება პირველივე ხელმისაწვდომ გვერდზე. როუთებიდან პირველივე ხელმისაწვდომი გვერდის ამოღების შემთხვევაში არაფერი იქნება შესაცვლელი და ავტომატურად გადამისამართდება შემდეგ ხელმისაწვდომ გვერდზე.
