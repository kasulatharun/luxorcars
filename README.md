# Luxury Motors - Premium Car Dealership

A full-stack luxury car dealership website with admin panel.

## Features

- **Login System**: Password protected admin panel (Password: `1234`)
- **Car Comparison**: Compare up to 3 cars side-by-side
- **Financing Calculator**: Monthly payment estimator
- **Test Drive Booking**: Schedule appointments
- **Admin Panel**: Add your own cars and images

## Project Structure

```
├── backend/
│   ├── package.json
│   └── server.js      # Node.js API server
├── frontend/
│   └── index.html     # Frontend website
└── README.md
```

## Running the Project

### Backend (API Server)
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:3000

### Frontend
Open `frontend/index.html` in a browser, or serve it:
```bash
cd frontend
python -m http.server 8000
```

Then open http://localhost:8000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cars | Get all cars |
| POST | /api/cars | Add new car (requires password) |
| POST | /api/test-drive | Schedule test drive |
| POST | /api/contact | Contact form |
| POST | /api/verify | Verify admin password |

## Admin Login

- Password: `1234`
- After login, Admin Panel appears in navigation

## Adding Your Own Images

1. Login with password `1234`
2. Go to Admin Panel
3. Fill car details and enter image URL
4. Click "Add Car"

## Deployment

### Frontend (Static)
Deploy the `frontend/` folder to any static hosting:
- Netlify
- Vercel
- GitHub Pages

### Backend
Deploy `backend/` to:
- Render
- Railway
- Heroku
- DigitalOcean

Update `API_URL` in frontend/index.html to point to your backend.

