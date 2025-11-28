# Installation & Setup Guide

## Prerequisites

Ensure you have the following installed:
- **Python 3.8+** (Check: `python --version`)
- **Node.js 16+** and npm (Check: `node --version` and `npm --version`)
- **Git** (optional, for cloning)

## Quick Start

### Option 1: Automated Start (Recommended)

**Using PowerShell:**
```powershell
cd "C:\Users\sishi\OneDrive\Documents\python\PackYourBags"
.\start.ps1
```

**Using Batch File:**
```cmd
cd C:\Users\sishi\OneDrive\Documents\python\PackYourBags
start.bat
```

This will:
1. Start the backend server on `http://localhost:5000`
2. Start the frontend server on `http://localhost:3000`
3. Open in separate windows

### Option 2: Manual Start

#### First-Time Setup

**1. Install Backend Dependencies:**
```bash
cd C:\Users\sishi\OneDrive\Documents\python\PackYourBags\backend
pip install -r requirements.txt
```

**2. Install Frontend Dependencies:**
```bash
cd C:\Users\sishi\OneDrive\Documents\python\PackYourBags\frontend_temp
npm install
```

#### Running the Application

**Terminal 1 - Backend:**
```bash
cd C:\Users\sishi\OneDrive\Documents\python\PackYourBags\backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\sishi\OneDrive\Documents\python\PackYourBags\frontend_temp
npm run dev
```

## Environment Configuration

### Backend Configuration

Edit `backend/.env`:
```env
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
HOST=0.0.0.0
```

### Frontend Configuration

Edit `frontend_temp/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Note**: For production, change to your production API URL.

## Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/ (shows available endpoints)

## Troubleshooting

### Backend Issues

**Problem**: `pip: command not found`
```bash
# Try:
python -m pip install -r requirements.txt
# Or:
py -m pip install -r requirements.txt
```

**Problem**: Port 5000 already in use
```bash
# Edit backend/.env and change PORT to another value
PORT=5001
# Then update frontend/.env
VITE_API_BASE_URL=http://localhost:5001/api
```

**Problem**: Module not found errors
```bash
# Reinstall dependencies:
cd backend
pip install --upgrade -r requirements.txt
```

### Frontend Issues

**Problem**: `npm: command not found`
- Ensure Node.js is installed: https://nodejs.org/

**Problem**: Port 3000 already in use
```bash
# Vite will automatically prompt to use another port
# Or edit frontend_temp/vite.config.js:
server: {
  port: 3001
}
```

**Problem**: Dependencies installation fails
```bash
# Clear npm cache and retry:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Common Issues

**Problem**: CORS errors
- Ensure backend is running on port 5000
- Check `VITE_API_BASE_URL` in frontend `.env` matches backend URL

**Problem**: API not responding
- Verify both servers are running
- Check firewall isn't blocking localhost connections
- Try accessing http://localhost:5000 directly

**Problem**: Environment variables not loading
- Ensure `.env` files exist (copy from `.env.example`)
- Restart both servers after changing `.env` files

## Verification Tests

### Backend Health Check
```bash
curl http://localhost:5000/
# Should return JSON with API information
```

### Test API Endpoints
```bash
# Get destinations
curl http://localhost:5000/api/destinations

# Get filtered destinations
curl "http://localhost:5000/api/destinations?filter=continent&value=Asia"

# Test subscription (POST)
curl -X POST http://localhost:5000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","preferences":{}}'
```

### Frontend Build Test
```bash
cd frontend_temp
npm run build
# Should build without errors
```

## Development Workflow

### Making Changes

1. **Backend changes**: Python automatically reloads if `FLASK_DEBUG=True`
2. **Frontend changes**: Vite hot-reloads automatically
3. **Environment changes**: Restart respective server

### Testing

Run backend tests:
```bash
cd backend
python -m pytest
```

Check frontend for errors:
```bash
cd frontend_temp
npm run dev
# Check browser console (F12)
```

## Production Deployment

### Backend

1. Set environment to production:
```env
FLASK_ENV=production
FLASK_DEBUG=False
```

2. Use a production server (not Flask's dev server):
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend

1. Build for production:
```bash
cd frontend_temp
npm run build
```

2. Serve the `dist/` folder with a web server (Nginx, Apache, or a service like Vercel/Netlify)

## Additional Resources

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Flask](https://flask.palletsprojects.com/)
- **CORS**: [Flask-CORS](https://flask-cors.readthedocs.io/)

## Support

For issues:
1. Check the console/terminal for error messages
2. Verify all dependencies are installed
3. Ensure environment variables are set correctly
4. Check firewall and antivirus settings
5. Refer to FIXES_APPLIED.md for recent changes

## Project Structure

```
PackYourBags/
├── backend/
│   ├── data/
│   │   ├── destinations.json
│   │   └── subscribers.json
│   ├── .env
│   ├── .gitignore
│   ├── app.py
│   └── requirements.txt
├── frontend_temp/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── config.js
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── start.bat
└── start.ps1
```

---

**Happy Coding! 🚀**
