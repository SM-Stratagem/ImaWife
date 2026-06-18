# 🚀 Quick Start Guide

## 1-Minute Setup

### Option A: Automatic Setup (Recommended)
```bash
# Make the script executable (if not already)
chmod +x setup.sh

# Run the setup script
./setup.sh
```

### Option B: Manual Setup
```bash
# Install dependencies
npm install

# Start the server
npm start
```

## What's Running

### Backend Server (Port 3001)
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Email Endpoint**: POST http://localhost:3001/api/send-email

### Frontend App
- **File**: `index.html` (open in browser)
- **Main App**: `ImAWifeApp.jsx` (React component)

## Key Files

| File | Purpose |
|------|---------|
| `.env.local` | SMTP credentials (Zoho Mail) |
| `server.js` | Backend API with email sending |
| `ImAWifeApp.jsx` | Enhanced React app with all new features |
| `index.html` | Browser interface with server status |
| `README.md` | Complete documentation |
| `setup.sh` | Automated setup script |

## Testing Email Sending

1. **Start the server**: `npm start`
2. **Open**: `index.html` in your browser
3. **Navigate** to Step 5 in the app
4. **Enter** a test email address
5. **Choose** "Send via SMTP"

## Mobile Testing

The app is fully responsive. Test on:
- **Real devices**: Best for touch experience
- **Browser DevTools**: Mobile device emulation
- **Different screen sizes**: 320px to 1920px supported

## Troubleshooting

### ❌ "Server Offline" in index.html
```bash
# Make sure server is running
npm start

# Check if port 3001 is in use
lsof -i :3001
```

### ❌ Email Not Sending
1. Check `.env.local` credentials
2. Verify Zoho SMTP settings
3. Check server logs for errors
4. Try using "Open Mail App" option instead

### ❌ App Not Loading
- Check browser console for errors
- Ensure you're opening `index.html` after server starts
- Try a hard refresh (Ctrl+F5 or Cmd+Shift+R)

## New Features Checklist

- [x] **SMTP Email** with "You Messed Up" subject
- [x] **Link Pasting** - paste any URL to share
- [x] **Mobile-First Design** - touch-optimized
- [x] **25 Affirmations** (was 6)
- [x] **12 Situations** (was 6)
- [x] **12 Gift Options** (was 6)
- [x] **Dual Send Options** (Mail app or SMTP)
- [x] **Loading States** for better UX
- [x] **Error Handling** with helpful messages

## Need Help?

1. Check the `README.md` for detailed instructions
2. Look at server logs for error messages
3. Test with "Open Mail App" first to verify basic functionality
4. Ensure SMTP credentials are correct in `.env.local`

## Ready to Deploy?

For production:
1. Update `.env.local` with production credentials
2. Consider adding CORS restrictions
3. Add rate limiting to email endpoint
4. Use environment variables on your hosting platform

---
*Made with care for constructive communication* ❤️