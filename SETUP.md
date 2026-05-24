# Installation & Setup Guide

## Quick Start

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### Step 2: Start the Application

**Terminal 1 - Backend (Port 3000):**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend (Port 5173):**
```bash
cd client
npm run dev
```

### Step 3: Login

Open `http://localhost:5173` in your browser

**Default Credentials:**
- Email: `admin@crm.com`
- Password: `admin123`

## Detailed Setup

### Backend Setup

1. Navigate to server directory
```bash
cd server
```

2. Install dependencies
```bash
npm install
```

3. Environment variables are already configured in `.env`
   - Database will auto-create in `database/crm.db`
   - Admin user will be auto-seeded on first run

4. Start development server
```bash
npm run dev
```

Expected output:
```
✓ Database initialized
✓ Server running on http://localhost:3000
✓ Default admin: admin@crm.com / admin123
```

### Frontend Setup

1. Navigate to client directory
```bash
cd client
```

2. Install dependencies
```bash
npm install
```

3. Environment variables are already configured in `.env`

4. Start development server
```bash
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Project Structure Overview

### Backend Files

- `server.js` - Main server entry point
- `controllers/` - Business logic for routes
- `routes/` - API endpoint definitions
- `middleware/` - Authentication and validation
- `models/` - Database operations
- `database/init.js` - Database initialization
- `.env` - Configuration

### Frontend Files

- `src/App.jsx` - Main router setup
- `src/main.jsx` - React entry point
- `src/pages/` - Full page components
- `src/components/` - Reusable components
- `src/context/` - React context for state
- `src/services/api.js` - API client
- `src/hooks/` - Custom React hooks
- `src/utils/` - Helper functions

## Features to Test

### 1. Authentication
- [ ] Login with admin@crm.com / admin123
- [ ] Verify dashboard loads
- [ ] Logout from navbar

### 2. Dashboard
- [ ] View statistics cards
- [ ] See recent leads list
- [ ] Check conversion rates

### 3. Lead Management
- [ ] Add new lead
- [ ] Edit lead information
- [ ] Change lead status
- [ ] Delete lead
- [ ] Search leads by name/email/phone
- [ ] Filter by status

### 4. Additional Features
- [ ] Export leads to CSV
- [ ] View notifications on actions
- [ ] Test responsive design (mobile/tablet)

## Common Issues & Solutions

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Change PORT in server/.env
PORT=3001
npm run dev
```

### Issue: "Cannot find module better-sqlite3"
**Solution:**
```bash
cd server
npm install better-sqlite3 --build-from-source
```

### Issue: "Database is locked"
**Solution:**
- Ensure only one backend instance is running
- Delete `database/.wal` and `database/.shm` files if they exist
- Restart the server

### Issue: "Frontend can't connect to backend"
**Solution:**
1. Verify backend is running on port 3000
2. Check `client/.env` has correct API URL
3. Verify CORS is enabled in `server.js`

## Database

The SQLite database is automatically created in `database/crm.db` with:
- Users table (contains seeded admin user)
- Leads table (for managing leads)
- Indexes for performance

To reset the database:
```bash
# Stop the server
# Delete database/crm.db
# Restart the server (it will recreate with fresh admin user)
```

## API Testing

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"admin123"}'
```

### Get All Leads
```bash
curl -X GET http://localhost:3000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"555-1234",
    "company":"Acme Corp",
    "source":"Website",
    "status":"New"
  }'
```

## Production Build

### Frontend Build
```bash
cd client
npm run build
# Outputs to client/dist/
```

### Backend Production
```bash
cd server
npm start
```

Ensure `.env` is configured for production:
```
NODE_ENV=production
PORT=3000
JWT_SECRET=strong-secret-key-change-this
DATABASE_PATH=./database/crm.db
```

## Customization

### Change Admin Password
1. Login to app
2. Stop server
3. Delete `database/crm.db`
4. Modify `server/database/init.js` default password
5. Restart server

### Modify Lead Fields
Edit `server/models/index.js` and `server/database/init.js` to add/remove database columns

### Styling Changes
Modify `client/tailwind.config.js` and `client/src/index.css` for custom branding

## Next Steps

1. Deploy backend (Heroku, Railway, Vercel, etc.)
2. Deploy frontend (Vercel, Netlify, etc.)
3. Update `VITE_API_URL` to production backend URL
4. Change JWT_SECRET to a strong value
5. Implement additional security measures

## Support

- Check browser console for errors
- Check backend terminal for server errors
- Review API response in Network tab
- Check database integrity if data issues occur

---

**Happy CRM-ing!** 🚀
