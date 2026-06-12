# EduFlow - Quick Start Setup Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Running the Application](#running-the-application)
4. [Demo Accounts](#demo-accounts)
5. [Troubleshooting](#troubleshooting)
6. [Project Files Overview](#project-files-overview)

---

## System Requirements

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.17 or later
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
  
- **Package Manager** (choose one):
  - **pnpm 10+** (Recommended) - `npm install -g pnpm`
  - **npm 9+** - Comes with Node.js
  - **yarn 3+** - `npm install -g yarn`
  
- **Git** (Optional, for version control)
  - Download from: https://git-scm.com/

---

## Installation Steps

### Step 1: Extract the Project

1. Download the provided ZIP file: `eduflow.zip`
2. Extract it to your desired location
3. Navigate into the directory:
   ```bash
   cd eduflow
   ```

### Step 2: Install Dependencies

Choose your preferred package manager:

**Option A: Using pnpm (Recommended)**
```bash
pnpm install
```

**Option B: Using npm**
```bash
npm install
```

**Option C: Using yarn**
```bash
yarn install
```

The installation will download all required packages and may take 2-5 minutes depending on your internet connection.

### Step 3: Environment Configuration

1. Create a `.env.local` file from the example:
   ```bash
   cp .env.example .env.local
   ```

2. The file should contain:
   ```env
   NODE_ENV=development
   NEXT_PUBLIC_APP_NAME=EduFlow
   ```

   (No additional configuration is needed for the demo)

---

## Running the Application

### Start the Development Server

**Using pnpm:**
```bash
pnpm dev
```

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```

### Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. The page should display the EduFlow login screen

**Note:** The first load may take a few seconds as the server starts up.

### Port Already in Use?

If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.) and will display it in the terminal output.

---

## Demo Accounts

The platform includes 4 pre-configured demo accounts for testing different roles:

### Account Details

| Role | Email | Password | Dashboard Features |
|------|-------|----------|-------------------|
| **Learner** | learner@example.com | any | Courses, Progress, Live Classes |
| **Instructor** | instructor@example.com | any | Course Management, Student Tracking |
| **Parent** | parent@example.com | any | Child Progress Monitoring |
| **Admin** | admin@example.com | any | Platform Analytics, User Management |

### How to Login

1. **Method 1 - Quick Demo Access:**
   - On the login page, look for "Try Demo Accounts:" section
   - Click any of the role buttons (Learner, Instructor, Parent, or Admin)
   - You'll be logged in automatically

2. **Method 2 - Manual Login:**
   - Enter the email address from the table above
   - Enter any password
   - Click "Sign In"

**Password Note:** For demo purposes, any password works (e.g., "password", "123456", or leave it blank and tab through).

---

## Project Structure

```
eduflow/
├── app/
│   ├── layout.tsx              # Main layout
│   ├── page.tsx                # Entry point
│   ├── globals.css             # Global styles
│   └── favicon.ico             # Favicon
│
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── card.tsx            # Card container component
│   │   ├── button.tsx          # Button component
│   │   ├── input.tsx           # Input field
│   │   ├── badge.tsx           # Status badges
│   │   ├── avatar.tsx          # User avatars
│   │   ├── progress-bar.tsx    # Progress visualization
│   │   ├── label.tsx           # Form labels
│   │   └── textarea.tsx        # Text areas
│   │
│   ├── dashboards/             # Role-specific dashboards
│   │   ├── learner-dashboard.tsx        # Learner portal
│   │   ├── instructor-dashboard.tsx     # Instructor portal
│   │   ├── parent-dashboard.tsx         # Parent portal
│   │   └── admin-dashboard.tsx          # Admin portal
│   │
│   ├── auth/
│   │   └── login-page.tsx      # Login interface
│   │
│   └── app-shell.tsx           # Main app wrapper with sidebar
│
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── utils.ts                # Utility functions
│   └── auth-store.ts           # Authentication state (Zustand)
│
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.mjs             # Next.js configuration
└── README.md                   # Comprehensive documentation
```

---

## Available Scripts

After installation, you can run the following commands:

### Development

```bash
# Start development server with hot reload
pnpm dev
# or
npm run dev
```

### Production Build

```bash
# Build optimized production version
pnpm build
# or
npm run build
```

### Start Production Server

```bash
# Start the production server (requires build first)
pnpm start
# or
npm start
```

### Linting

```bash
# Check for code quality issues
pnpm lint
# or
npm run lint
```

---

## Troubleshooting

### Issue: "Command not found: pnpm"

**Solution:** Install pnpm globally
```bash
npm install -g pnpm
```

### Issue: Port 3000 Already in Use

**Solution 1 - Let Next.js use another port:**
The dev server will automatically use the next available port (3001, 3002, etc.)

**Solution 2 - Kill the process using port 3000:**

**On macOS/Linux:**
```bash
kill -9 $(lsof -ti:3000)
```

**On Windows (PowerShell):**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Module not found" Errors

**Solution:** Reinstall dependencies
```bash
rm -rf node_modules
pnpm install
# or npm install
```

### Issue: Build Fails with TypeScript Errors

**Solution:** Check for type errors
```bash
pnpm type-check
# or npm run type-check
```

### Issue: Page Shows Blank White Screen

**Solution 1:** Check browser console for errors (F12)

**Solution 2:** Clear browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

**Solution 3:** Restart dev server
- Stop the server (Ctrl+C)
- Run `pnpm dev` again

### Issue: Styles Not Loading Correctly

**Solution:** Rebuild Tailwind CSS
```bash
# Stop the dev server
# Delete .next folder
rm -rf .next

# Restart dev server
pnpm dev
```

---

## Browser Compatibility

EduFlow works best on:

- **Chrome/Chromium** (Latest 2 versions)
- **Firefox** (Latest 2 versions)
- **Safari** (Latest 2 versions)
- **Edge** (Latest 2 versions)

For best performance, use a modern browser with JavaScript enabled.

---

## Testing Different Dashboards

1. **Access as Learner:**
   - Login with: `learner@example.com`
   - View: Courses, Progress Tracking, Live Classes

2. **Access as Instructor:**
   - Login with: `instructor@example.com`
   - View: Course Management, Student Analytics, Ratings

3. **Access as Parent:**
   - Login with: `parent@example.com`
   - View: Child Progress, Activity Monitoring, Alerts

4. **Access as Admin:**
   - Login with: `admin@example.com`
   - View: Platform Analytics, User Statistics, Course Performance

---

## Mobile Testing

To test on mobile devices:

### Using the Same Network

1. Find your computer's IP address:
   ```bash
   # On macOS/Linux:
   ifconfig | grep "inet "
   
   # On Windows:
   ipconfig | findstr IPv4
   ```

2. On your mobile device, visit:
   ```
   http://<YOUR_IP>:3000
   ```

### Using Chrome DevTools

1. Open DevTools (F12)
2. Click the device toggle icon (top-left)
3. Select your device from the dropdown

---

## Performance Tips

1. **Use pnpm**: Faster than npm, with better dependency resolution
2. **Clear Cache**: If experiencing issues, clear `.next` folder
3. **Update Node.js**: Keep Node.js up to date for better performance
4. **Modern Browser**: Use latest browser for best performance

---

## Next Steps After Setup

1. ✅ Explore each dashboard role
2. ✅ Test the responsive design (resize browser window)
3. ✅ Check mobile view (DevTools device emulation)
4. ✅ Review the code structure
5. ✅ Read TASK_5_REPORT.html for design documentation

---

## Getting Help

### Documentation Files

- **README.md** - Comprehensive project documentation
- **TASK_5_REPORT.html** - Detailed design and implementation report
- **.env.example** - Environment variables template

### Common Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## Deployment (Optional)

### Deploy to Vercel (Recommended)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy

Vercel will automatically detect it's a Next.js app and configure it correctly.

---

**Last Updated:** June 2026

**Questions?** Refer to README.md or TASK_5_REPORT.html for more detailed information.

Good luck with EduFlow! 🎓
