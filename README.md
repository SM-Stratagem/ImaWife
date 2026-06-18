# I'm a Wife App - Enhanced Version

A gentle communication app for wives to express feelings in a constructive way. Now with enhanced features including SMTP email sending, link sharing, and mobile-first design.

## New Features Added

### 1. **Enhanced Email Functionality**
- **SMTP Email Sending**: Now sends emails directly via Zoho SMTP (credentials in `.env.local`)
- **Dual Send Options**: Choose between opening your mail app or sending directly via SMTP
- **Custom Subject**: Email subject defaults to "You Messed Up" as requested
- **HTML Email Support**: Links are rendered as clickable HTML links in emails

### 2. **Link Sharing Feature**
- **Paste Any Link**: Paste product links, articles, videos, or any URL to share with him
- **Automatic Integration**: Pasted links automatically appear in the email body
- **Link Validation**: Automatically detects and formats URLs

### 3. **Expanded Content**
- **25 Affirmations** (up from 6): More supportive messages for difficult moments
- **12 Situation Options** (up from 6): More specific scenarios to choose from
- **12 Gift Options** (up from 6): More ideas for meaningful gestures

### 4. **Mobile-First Design**
- **Touch-Friendly**: Larger touch targets (44px minimum) for all buttons
- **Responsive Grids**: Adaptive layouts for all screen sizes
- **Safe Area Support**: Proper handling of notched phones
- **Optimized Typography**: Better readability on small screens
- **iOS-Friendly**: Prevents unwanted zoom on form inputs

### 5. **Improved User Experience**
- **Loading States**: Visual feedback during email sending
- **Success/Error Messages**: Clear notifications for all actions
- **Progress Indicators**: Visual step tracking
- **Enhanced Animations**: Smooth transitions and breathing animation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will run on `http://localhost:3001`

### 3. Update Gift Links (Optional)
Edit the `GIFT_OPTIONS` array in `ImAWifeApp.jsx` to replace the placeholder links with your actual product/store URLs.

### 4. Using the App
1. **Step 1**: Choose what happened from the expanded list of situations
2. **Step 2**: Use the breathing exercise to calm down
3. **Step 3**: Browse through 25 affirmations for support
4. **Step 4**: Select from 12 gift options (he's buying!)
5. **Step 5**: 
   - Paste any link you want to share
   - Enter his email and your name
   - Customize the message
   - Choose to send via SMTP or open mail app

## SMTP Configuration

The app uses Zoho Mail SMTP with credentials from `.env.local`:
```
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=your-email@example.com
ZOHO_SMTP_PASSWORD=your-password
ZOHO_SMTP_FROM=from-email@example.com
```

## Development

- **Frontend**: React app in `ImAWifeApp.jsx`
- **Backend**: Express server in `server.js`
- **Environment**: Configuration in `.env.local`

## Security Notes

1. Email credentials are stored in `.env.local` (not committed to Git)
2. The server runs on localhost for development
3. For production, consider:
   - Using environment variables on your hosting platform
   - Adding rate limiting to the email endpoint
   - Implementing proper CORS configuration

## Troubleshooting

### Email Not Sending
1. Check if server is running: `npm start`
2. Verify SMTP credentials in `.env.local`
3. Check Zoho Mail SMTP settings and app passwords

### Mobile Issues
1. The app is optimized for mobile but test on actual devices
2. For iOS issues, ensure font sizes are at least 16px for inputs

### Link Pasting Not Working
1. Make sure you're pasting a valid URL (starts with http:// or https://)
2. The link will appear in the email body automatically

## License

MIT License - Feel free to use and modify for personal use.