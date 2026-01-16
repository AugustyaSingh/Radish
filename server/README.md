# Radish Backend API 🌱

Node.js/Express backend with SQLite database for the Radish campus sustainability tracker.

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Start the Server
```bash
npm start
```

Server will run on **http://localhost:3000**

## API Endpoints

### POST `/api/actions`
Log a new action
```json
{
  "userId": "anon-abc123",
  "actionType": "recycled",
  "metadata": { "customText": "..." }
}
```

### GET `/api/actions/:userId`
Get user's actions and stats
```
GET /api/actions/anon-abc123?limit=100
```

### GET `/api/stats/community`
Get community-wide statistics

### GET `/api/stats/today`
Get today's statistics

### GET `/api/health`
Health check endpoint

## Environment Variables

Create a `.env` file:
```
PORT=3000
DATABASE_PATH=./radish.db
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Database

SQLite database stored in `radish.db`

**Schema:**
```sql
CREATE TABLE actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  metadata TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Tech Stack

- **Express** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## Deployment

For production, consider:
- PostgreSQL or MongoDB instead of SQLite
- **Render**, **Railway**, or **Vercel** for hosting
- Add rate limiting
- Enable HTTPS
- Set production CORS origin

---

Built for anonymous campus sustainability tracking 🌍
