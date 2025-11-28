# 🚀 View Roulette on Localhost

## Quick Start

### Option 1: Automated (Easiest)

**PowerShell:**
```powershell
.\start.ps1
```

**Command Prompt:**
```cmd
start.bat
```

This starts both backend and frontend automatically!

---

### Option 2: Manual Start

#### Step 1: Start Backend (Terminal 1)
```bash
cd backend
python app.py
```
✅ Backend runs on: **http://localhost:5000**

#### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend_temp
npm run dev
```
✅ Frontend runs on: **http://localhost:3000**

---

## 🎡 View the Roulette

1. **Open your browser:**
   ```
   http://localhost:3000
   ```

2. **Navigate to Roulette:**
   - Scroll down to "Spin the Travel Roulette" section
   - OR go directly to: `http://localhost:3000/#roulette`

3. **Test the Animation:**
   - Click the **"SPIN NOW 🎡"** button
   - Watch the smooth 60fps rotation
   - See the destination card appear after spin

---

## ✅ What You Should See

### **Before Spinning:**
- Colorful 8-segment wheel
- Destination labels visible
- Red pointer at top
- "SPIN NOW 🎡" button

### **During Spin:**
- Labels disappear (performance optimization)
- Smooth rotation (3.5 seconds)
- 4 full rotations
- No lag or stuttering

### **After Spin:**
- Wheel stops at random destination
- Labels reappear
- Destination card slides in
- Confetti celebration! 🎉

---

## 🔍 Performance Testing

### Check FPS (Chrome DevTools):

1. **Open DevTools:**
   - Press `F12` or `Ctrl+Shift+I`
   - Go to **Performance** tab

2. **Record Animation:**
   - Click **Record** button
   - Click "SPIN NOW" button
   - Wait for animation to complete
   - Click **Stop** button

3. **Check Results:**
   - Should show **60 FPS** constant
   - CPU usage should be low
   - No frame drops

---

## 🎨 Visual Features

### **Optimized Roulette:**
- ✅ CSS Conic Gradient (smooth rendering)
- ✅ 8 vibrant color segments
- ✅ GPU-accelerated animation
- ✅ Labels hidden during spin
- ✅ Clean, minimal design

### **Color Segments:**
- 🔵 Blue
- 🟢 Green  
- 🟣 Purple
- 🟠 Orange
- 🩷 Pink
- 🔷 Teal
- 🔴 Red
- 🟦 Indigo

---

## 🐛 Troubleshooting

### **Frontend not loading:**
```bash
# Make sure you're in the right directory
cd frontend_temp

# Install dependencies if needed
npm install

# Start dev server
npm run dev
```

### **Backend not responding:**
```bash
# Make sure backend is running
cd backend
python app.py

# Check if port 5000 is available
# Backend should show: "Running on http://127.0.0.1:5000"
```

### **Roulette not spinning:**
- Check browser console for errors (F12)
- Make sure backend is running (destinations API)
- Verify destinations are loaded

### **Animation is laggy:**
- Open Chrome DevTools Performance tab
- Check if GPU acceleration is enabled
- Close other browser tabs/applications
- Try in Chrome/Edge (best performance)

---

## 📊 Expected Performance

- **FPS:** 60fps constant
- **Animation Duration:** 3.5 seconds
- **CPU Usage:** < 10% during spin
- **Memory:** Stable (no leaks)
- **Smoothness:** No jank or stutter

---

## 🎯 Quick Test Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Roulette section visible on page
- [ ] "SPIN NOW" button clickable
- [ ] Wheel rotates smoothly (no lag)
- [ ] Labels disappear during spin
- [ ] Destination card appears after spin
- [ ] Confetti celebration works
- [ ] 60 FPS in DevTools

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Endpoints:** http://localhost:5000/ (root shows all endpoints)
- **Roulette Section:** http://localhost:3000/#roulette

---

**🎡 Enjoy the smooth, optimized roulette wheel!**

