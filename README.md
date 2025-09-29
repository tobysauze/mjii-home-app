# MJII Operations Hub

A centralized hub for M/Y MJII yacht operations, crew management, and resources.

## Features

- **Central Operations Ring**: Quick access to all yacht operations
- **Engine Monitoring**: Track engine start schedules with email notifications
- **Suggestion Box Integration**: Direct link to the MJ2 Suggestion Box app
- **Responsive Design**: Works on desktop and mobile devices

## Quick Links

- 💳 **Voly**: Expenses, AP, and budgets
- 🧭 **SMS**: Safety Management System
- 🛠️ **Permit to Work**: Work authorization and controls
- 📘 **Procedures**: Operational procedures
- 📚 **Manuals**: Technical and user manuals
- 📇 **Key Contacts**: Suppliers and shore-side contacts
- 👥 **Personnel**: Current crew onboard (POB)
- 📅 **Rotations**: Leave and rotation planning
- 💡 **Suggestion Box**: Share ideas and feedback

## Deployment

### GitHub Pages Setup

1. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it `mjii-home-app` (or your preferred name)

2. **Upload Your Code**:
   - Use GitHub Desktop, or
   - Use the web interface to upload files, or
   - Fix the Xcode license issue and use git commands

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access Your Site**:
   - Your site will be available at: `https://your-username.github.io/mjii-home-app`

### Update Suggestion Box Link

After deploying both apps, update the Suggestion Box URL in `script.js`:

```javascript
suggestion: "https://your-username.github.io/mj2-suggestion-box"
```

## Local Development

### Frontend Only
```bash
python3 -m http.server 8080
```
Visit: http://localhost:8080

### With Email Service
```bash
# Terminal 1: Start email service
cd server && npm start

# Terminal 2: Start frontend
python3 -m http.server 8080
```

### With Suggestion Box
```bash
# Terminal 1: Start Suggestion Box
cd "../MJ2 Suggestion Box" && npm start

# Terminal 2: Start email service
cd server && npm start

# Terminal 3: Start frontend
python3 -m http.server 8080
```

## Configuration

### Email Service
- Configure SMTP settings in `server/.env`
- Default recipients in `script.js` (DEFAULT_RECIPIENTS)

### Engine Monitoring
- Engines should be started every 5 days (configurable)
- Email notifications sent on due date
- Test email functionality available

## File Structure

```
mjii-home-app/
├── index.html          # Main homepage
├── script.js           # Frontend logic and links
├── styles.css          # Styling
├── assets/             # Images and logos
├── pages/              # Individual operation pages
├── server/             # Email service backend
└── README.md           # This file
```

## License

© 2024 M/Y MJII • Operations Hub

