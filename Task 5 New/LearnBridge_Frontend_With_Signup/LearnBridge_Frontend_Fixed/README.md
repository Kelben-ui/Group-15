# EduFlow - Adaptive E-Learning Platform

A comprehensive, modern adaptive e-learning platform built with React, Next.js, and TypeScript. EduFlow provides role-based dashboards for learners, instructors, parents, and administrators, with a cohesive design system and responsive UI.

## 🎯 Project Overview

EduFlow is Task 5: UI Design and Implementation for CEF 440 (Group 15). The platform showcases:

- **App Identity**: Professional "EduFlow" brand with consistent design language
- **Visual Design**: Modern, accessible UI with WCAG AA compliance
- **Frontend Implementation**: Complete React PWA with role-based dashboards

## ✨ Features

### User Roles & Dashboards

1. **Learner Dashboard**
   - Active courses with progress tracking
   - Live class notifications and schedules
   - Study resources and course materials
   - Learning statistics (hours, badges, progress)

2. **Instructor Dashboard**
   - Course management (create, edit, delete)
   - Student enrollment tracking
   - Revenue analytics and ratings
   - Recent activity notifications

3. **Parent Dashboard**
   - Monitor child's learning progress
   - Track enrolled courses and completion status
   - View recent activity and achievements
   - Receive alerts for important milestones

4. **Admin Dashboard**
   - Platform analytics and metrics
   - User management and role distribution
   - Course performance tracking
   - Recent user activity monitoring

### Design System

- **Color Palette**: Blue primary (#0066cc), Green secondary (#00aa66), Orange accent (#ff6b35)
- **Typography**: 2-font system (Geist Sans for body, Geist Mono for code)
- **Components**: Reusable UI components (Card, Button, Input, Badge, etc.)
- **Responsive**: Mobile-first design with breakpoints at 768px and 1024px
- **Accessibility**: WCAG AA compliant with proper contrast ratios and semantic HTML

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ or later
- pnpm 10+ (recommended package manager)
- npm or yarn (alternative package managers)

### Installation

#### Option 1: Using the Project Folder Directly

1. **Navigate to project directory:**
   ```bash
   cd eduflow
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

#### Option 2: Using shadcn CLI (Recommended)

If you're integrating into an existing project:

```bash
# Download the project ZIP and extract

# Option A: Create a new project with the downloaded files
cd downloaded-eduflow-folder
pnpm install

# Option B: Use shadcn CLI to integrate
pnpm dlx shadcn-ui@latest init
# Follow the prompts and select the extracted files

# Start development
pnpm dev
```

### Demo Accounts

You can test the platform using these demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Learner | learner@example.com | any password |
| Instructor | instructor@example.com | any password |
| Parent | parent@example.com | any password |
| Admin | admin@example.com | any password |

**Note**: Click the demo account buttons on the login page for quick access.

## 📁 Project Structure

```
eduflow/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main app entry point
│   └── globals.css         # Global styles & design tokens
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   └── progress-bar.tsx
│   ├── dashboards/         # Role-specific dashboards
│   │   ├── learner-dashboard.tsx
│   │   ├── instructor-dashboard.tsx
│   │   ├── parent-dashboard.tsx
│   │   └── admin-dashboard.tsx
│   ├── auth/
│   │   └── login-page.tsx  # Authentication page
│   └── app-shell.tsx       # Main app wrapper with sidebar
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── utils.ts            # Utility functions
│   └── auth-store.ts       # Zustand auth store
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Dependencies
```

## 🛠 Technology Stack

- **Frontend Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Utilities**: classnames, class-variance-authority (CVA)

## 📦 Available Scripts

```bash
# Development
pnpm dev                  # Start dev server
pnpm build                # Build for production
pnpm start                # Start production server
pnpm lint                 # Run ESLint

# Type checking
pnpm type-check           # Check TypeScript errors

# Formatting (if configured)
pnpm format               # Format code with Prettier
```

## 🎨 Design System

### Colors

The design system uses CSS variables defined in `globals.css`:

```css
--primary: #0066cc          /* Main brand blue */
--secondary: #00aa66        /* Action green */
--accent: #ff6b35           /* Highlight orange */
--destructive: #dc3545      /* Error red */
--background: #ffffff       /* Light mode background */
--foreground: #1a1a2e       /* Dark text */
--muted: #e8e8f0            /* Disabled/subtle elements */
```

### Typography

- **Headings**: Geist Sans (bold, 24-32px)
- **Body**: Geist Sans (regular, 14-16px)
- **Code**: Geist Mono (monospace)
- **Line Height**: 1.4-1.6 for readability

### Spacing Scale

- Base unit: 4px (Tailwind's `size-1`)
- Gap: 16px (`gap-4`), 8px (`gap-2`), etc.
- Padding: 24px (`p-6`), 16px (`p-4`), etc.

## 🔐 Authentication

The platform uses Zustand for client-side state management with mock authentication for demo purposes.

### User Store (`lib/auth-store.ts`)

```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login(email: string, password: string): Promise<void>;
  logout(): void;
  register(userData): Promise<void>;
}
```

### Using Authentication

```typescript
import { useAuthStore } from '@/lib/auth-store';

export function MyComponent() {
  const { user, logout } = useAuthStore();
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components are optimized for mobile-first experience.

## ♿ Accessibility

EduFlow follows WCAG 2.1 AA guidelines:

- Semantic HTML with proper heading hierarchy
- Color contrast ratios ≥ 4.5:1 for text
- Keyboard navigation support
- ARIA labels and roles where necessary
- Focus indicators on interactive elements

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your repository
   - Click "Deploy"

### Deploy to Other Platforms

```bash
# Build for production
pnpm build

# The build output is in .next/
# Deploy the contents according to your hosting provider
```

## 🔄 Future Enhancements

- Backend integration with Neon/Supabase
- Real-time collaboration features
- Video streaming for live classes
- Mobile native apps (React Native)
- AI-powered personalized learning recommendations
- Advanced analytics and reporting
- Integration with external tools (Zoom, Teams, etc.)

## 📝 File Size Optimization

Current build optimizations:
- Code splitting and lazy loading
- Image optimization with next/image
- CSS optimization with Tailwind
- JavaScript compression

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process using port 3000 (macOS/Linux)
kill -9 $(lsof -ti:3000)

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependency Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

```bash
# Check for type errors
pnpm type-check
```

## 📄 License

This project is created for educational purposes as part of CEF 440 coursework (Group 15, Task 5).

## 👥 Team

**CEF 440 - Group 15**

**Task 5: UI Design and Implementation (10 marks)**

- App Identity: EduFlow brand system
- Visual Design: Comprehensive design system with color palette, typography, and components
- Frontend Implementation: Complete React PWA with role-based dashboards

## 📧 Support

For issues or questions about the platform, please refer to the documentation or create an issue in the project repository.

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://zustand-demo.vercel.app/)

---

**Built with ❤️ for education**

Last Updated: June 2026
