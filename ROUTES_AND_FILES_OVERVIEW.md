# 🕉️ HareHare App - Complete Routes & Files Overview

## 📋 Project Summary
- **Framework:** React + TypeScript with Vite
- **Styling:** Tailwind CSS
- **i18n:** react-i18next (English & Hindi)
- **State Management:** React Context (Auth), localStorage
- **Dev Server:** localhost:8080

---

## 🛣️ ROUTING STRUCTURE

### Public Routes (No Auth Required)
```
/ → Onboarding.tsx
  └─ Splash screen with mantra quotes
  └─ Auto-redirects to /app/home if authenticated, else /auth/login

/auth/login → Login.tsx
  └─ Login page with email/password

/auth/register → Register.tsx
  └─ Registration page
```

### Protected Routes (Auth Required)
```
/app → AppLayout.tsx (Wrapper)
  ├─ /app/home → Home.tsx ✨ CHAT LANDING PAGE
  │   └─ God/deity selection grid (6 options)
  │   └─ Navigates to /app/chat with selectedGod state
  │
  ├─ /app/chat → Chat.tsx ✨ NEW CHAT INTERFACE
  │   └─ Requires selectedGod passed via location.state
  │   └─ Speech recognition (Hindi) + TTS
  │   └─ Message history per god
  │   └─ Credits system (25 per session)
  │   └─ Background: Selected god's image (low opacity)
  │
  ├─ /app/library → Library.tsx
  │   └─ Scripture library
  │
  ├─ /app/events → Events.tsx
  │   └─ Upcoming festivals calendar
  │
  ├─ /app/puja → Puja.tsx
  │   └─ Step-by-step puja guides
  │
  ├─ /app/donate → Donate.tsx
  │   └─ Donation interface
  │
  ├─ /app/profile → Profile.tsx
  │   └─ User profile page
  │
  └─ /app/settings → Settings.tsx
      └─ App settings & preferences
```

### Catch-All Route
```
* → NotFound.tsx (404 page)
```

---

## 📁 FILE STRUCTURE

### Core App Files
```
src/App.tsx
  ├─ Main router setup with BrowserRouter
  ├─ Imports all pages
  ├─ Wraps routes with providers:
  │   ├─ ErrorBoundary
  │   ├─ QueryClientProvider (React Query)
  │   ├─ TooltipProvider (Radix UI)
  │   ├─ AuthProvider (Custom Auth Context)
  │   └─ Toaster components (shadcn + Sonner)
  └─ Defines public + protected routes
```

### Components
```
src/components/
├─ AppLayout.tsx
│   ├─ Main layout wrapper for /app routes
│   ├─ Fixed header with:
│   │   ├─ Logo + app title
│   │   ├─ Streak counter (days)
│   │   ├─ Language toggle (EN/HI)
│   │   └─ Logout button
│   ├─ Fixed bottom nav (mobile) with:
│   │   ├─ Home, Library, Events, Profile icons
│   │   └─ Active state styling + ripple effects
│   ├─ Outlet for nested routes
│   └─ Touch effects: haptic feedback + ripple animation
│
├─ ErrorBoundary.tsx
│   └─ Catches React errors with fallback UI
│
├─ ProtectedRoute.tsx
│   ├─ Guards /app/* routes
│   ├─ Checks isAuthenticated from AuthContext
│   ├─ Shows SacredLoader while checking auth
│   └─ Redirects to /auth/login if not authenticated
│
├─ SacredLoader.tsx
│   └─ Animated loading spinner component
│
└─ ui/
    └─ 20+ shadcn UI components
        ├─ button.tsx, card.tsx, dialog.tsx, etc.
        └─ Fully styled with Tailwind
```

### Pages
```
src/pages/
├─ Onboarding.tsx ⭐ ENTRY POINT
│   ├─ Shows rotating Sanskrit mantras
│   ├─ Displays partner logos
│   ├─ Double-tap to navigate
│   ├─ Auto-redirect after auth check
│   └─ Bilingual text (EN/HI)
│
├─ Login.tsx
│   ├─ Email/password login form
│   ├─ Auth context integration
│   └─ Link to register page
│
├─ Register.tsx
│   ├─ User registration form
│   └─ Stores auth token
│
├─ Home.tsx ✨ DEITY SELECTION
│   ├─ 6 Gods array with:
│   │   ├─ id, name (EN/HI), description (EN/HI)
│   │   ├─ color (gradient Tailwind classes)
│   │   └─ image (path from /public)
│   ├─ Gods: Shiva, Hanuman, Ram, Krishna, Ganesha, Saraswati
│   ├─ 3-column responsive grid layout
│   ├─ Background: main_bg.png with low opacity (15%)
│   ├─ Gradient overlay (90% opacity)
│   ├─ Circular image bubbles (20x20 Tailwind)
│   ├─ Click navigates to /app/chat with selectedGod state
│   └─ Bilingual UI text
│
├─ Chat.tsx ✨ NEW CHAT INTERFACE
│   ├─ Gets selectedGod from location.state
│   ├─ Storage keys: chat_{godId}, history_{godId}
│   ├─ Background: selectedGod.image (10% opacity)
│   ├─ Fixed header with:
│   │   ├─ Back button
│   │   ├─ God name
│   │   └─ Credits display
│   ├─ Fixed controls bar:
│   │   ├─ View Chats / New Chat buttons
│   │   └─ Chat history dropdown
│   ├─ Scrollable messages area:
│   │   ├─ User messages (right, orange bubbles)
│   │   ├─ God messages (left, white bubbles with glow)
│   │   ├─ Typing indicator (WhatsApp-style dots)
│   │   └─ Auto-scroll to latest message
│   ├─ Fixed input bar at bottom:
│   │   ├─ Mic button (Speech Recognition - Hindi)
│   │   ├─ Text input field
│   │   └─ Send button
│   ├─ Speech Features:
│   │   ├─ Speech Recognition: hi-IN (Hindi only, hardcoded)
│   │   ├─ Text-to-Speech: Replies spoken in Hindi (hi-IN)
│   │   └─ Listening state shows mic active
│   ├─ Credits system:
│   │   ├─ 25 credits per chat session
│   │   ├─ Popup on credit low/out
│   │   └─ Stored in localStorage
│   ├─ Chat persistence:
│   │   ├─ Saves messages per god ID
│   │   ├─ Welcome message on first chat
│   │   └─ History with timestamps
│   └─ Message types:
│       ├─ User: { from: 'user', text, time }
│       ├─ God: { from: 'god', text, time, composing }
│       └─ System: { from: 'system', text, time }
│
├─ Library.tsx
│   ├─ Scripture library (mock API)
│   ├─ Fetches from api.ts
│   └─ Displays sacred texts
│
├─ Events.tsx
│   ├─ Upcoming festivals calendar
│   ├─ Fetches from getUpcomingEvents() API
│   ├─ Date formatting + details
│   └─ Map icon location
│
├─ Puja.tsx
│   ├─ Puja guides (step-by-step)
│   ├─ Fetches from getPujaGuides() API
│   ├─ Shows duration, steps, start button
│   └─ Toast notifications
│
├─ Donate.tsx
│   ├─ Donation interface
│   ├─ Multiple donation amounts
│   └─ Impact information
│
├─ Profile.tsx
│   ├─ User profile display
│   ├─ Stats (streak, credits, etc.)
│   └─ User settings quick access
│
├─ Settings.tsx
│   ├─ App settings & preferences
│   ├─ Seva plans (Basic, Weekly, Monthly, Yearly)
│   ├─ Price + benefits per tier
│   ├─ Current plan indicator
│   ├─ Toast on selection
│   └─ Bilingual support
│
└─ NotFound.tsx
    ├─ 404 page with emoji (🙏)
    ├─ "Path Not Found" message
    └─ Return Home button
```

### Context & Hooks
```
src/context/
├─ AuthContext.tsx
│   ├─ Provides isAuthenticated, isLoading, user, logout
│   ├─ Checks localStorage for auth token on mount
│   ├─ Manages global auth state
│   └─ Used in ProtectedRoute + AppLayout
│
src/hooks/
├─ use-mobile.tsx
│   └─ Mobile breakpoint detection hook
│
└─ use-toast.ts
    └─ Toast notification hook from shadcn
```

### i18n (Internationalization)
```
src/i18n/
├─ config.ts
│   ├─ i18next initialization
│   ├─ Language detection + fallback (en)
│   ├─ localStorage persistence
│   └─ Resources: en.json, hi.json
│
└─ locales/
    ├─ en.json (English translations)
    │   ├─ nav.*, auth.*, streak.*, app.*
    │   ├─ All UI strings
    │   └─ ~100+ translation keys
    │
    └─ hi.json (Hindi translations)
        └─ Same structure in Devanagari script
```

### Utilities & Services
```
src/lib/
└─ utils.ts
    └─ Tailwind className merge utility (cn function)

src/services/
└─ api.ts
    ├─ Mock API functions (all data hardcoded)
    ├─ Functions:
    │   ├─ getUpcomingEvents() → Event[]
    │   ├─ getPujaGuides() → PujaGuide[]
    │   ├─ getLibraryItems() → LibraryItem[]
    │   └─ getUserProfile() → User
    │
    ├─ TypeScript interfaces:
    │   ├─ Event { id, name, date, location, description }
    │   ├─ PujaGuide { id, name, description, duration, steps }
    │   ├─ LibraryItem { id, title, author, content, category }
    │   └─ User { id, name, email, avatar, streakCount }
    │
    └─ NOTE: Replace with real API calls when backend ready
```

### Config Files
```
src/
├─ main.tsx
│   └─ React app entry point
│   └─ Renders <App /> into #root
│
├─ index.css
│   ├─ Tailwind directives (@tailwind, @apply)
│   ├─ Global CSS variables for colors
│   ├─ Custom animations (fadeSlide, blinkCaret, etc.)
│   └─ Dark mode support
│
├─ vite-env.d.ts
│   └─ Vite + Vite modules type definitions
│
vite.config.ts
├─ Server: localhost:8080
├─ Plugins: React SWC, Component Tagger
├─ Path alias: @ → ./src
└─ React JSX compilation

tsconfig.json / tsconfig.app.json / tsconfig.node.json
└─ TypeScript configuration
└─ Strict null checks disabled for flexibility
└─ No unused locals/params warnings

tailwind.config.ts
├─ Design tokens (colors, spacing, etc.)
├─ Custom animations (logoPulse, rippleAnim, etc.)
└─ Dark mode configuration

postcss.config.js
└─ Tailwind CSS compilation

eslint.config.js
└─ Code linting rules

package.json
├─ Dependencies: react, react-router-dom, react-i18next, @tanstack/react-query
├─ UI: shadcn components, lucide-react icons
├─ Dev: vite, typescript, tailwindcss, eslint
└─ Scripts: dev, build, preview, lint

components.json
└─ shadcn configuration (Tailwind paths, aliases)

vercel.json
└─ Vercel deployment config (SPA routing)
```

---

## 🎯 KEY DATA FLOWS

### 1. Authentication Flow
```
Onboarding.tsx
  ↓ (Check isAuthenticated)
  ├─ YES → Redirect to /app/home
  └─ NO → Redirect to /auth/login
    ↓
  Login.tsx → AuthContext.login() → localStorage token
    ↓
  ProtectedRoute checks isAuthenticated → Allow access
```

### 2. God Selection to Chat Flow
```
Home.tsx (God grid)
  ↓ (Click god)
  navigate("/app/chat", { state: { selectedGod: god } })
    ↓
  Chat.tsx receives selectedGod from location.state
    ↓ (Show god's image as background at 10% opacity)
    ↓ (Load chat history from localStorage using god.id)
    ↓ (Show welcome message with god-specific text)
```

### 3. Message Flow in Chat
```
User Input (text or speech)
  ↓
setInput() or Speech Recognition result
  ↓
Send Message Button / Enter Key
  ↓
Create User Message, add to messages[]
  ↓
Save to localStorage[chat_{godId}]
  ↓
Generate God Reply (simulated/placeholder)
  ↓
Typewriter animation (character by character)
  ↓
Add God Message to messages[]
  ↓
Speak reply using Text-to-Speech (Hindi)
  ↓
Auto-scroll to latest message
```

### 4. Storage Structure
```
localStorage:
├─ auth_token: "your-token-here"
├─ language: "en" or "hi"
├─ chat_{godId}: [{ id, from, text, time }, ...]
├─ history_{godId}: [{ text, time }, ...]
├─ credits: number
├─ lastVisitDate: "Date string"
└─ streakCount: number
```

---

## ⚠️ KNOWN ISSUES (Desktop Crash on Reload)

### Problem Identified
1. **Chat.tsx line 10**: Uses `selectedGod?.id` immediately to create storage keys
2. When page is reloaded directly (F5 on `/app/chat`), `selectedGod` is `undefined`
3. Creates storage key `chat_undefined` → Causes undefined behavior
4. Background image uses `selectedGod?.image` → Becomes `/undefined` (broken image)

### Solution Needed
In Chat.tsx:
```tsx
// Current (problematic):
const selectedGod = location.state?.selectedGod;
const STORAGE_KEY = `chat_${selectedGod?.id}`; // ❌ May be undefined

// Should be (fixed):
const selectedGod = location.state?.selectedGod;
const STORAGE_KEY = `chat_${selectedGod?.id || 'default'}`; // ✅ Fallback
```

Or better: Add a fallback redirect if selectedGod is missing:
```tsx
useEffect(() => {
  if (!selectedGod) {
    navigate('/app/home'); // Redirect to home if no god selected
  }
}, [selectedGod, navigate]);
```

---

## 🎨 DESIGN TOKENS

### Colors
```
Primary: Orange-600 (main actions)
Secondary: Orange-50 (backgrounds)
Accent: Amber/Yellow (highlights)
Destructive: Red (error)
Muted: Gray-500 (secondary text)
Card: White
Border: Orange-200
Text (light): Orange-700, Orange-800
```

### Spacing
```
Header height: 60px (h-16)
Bottom nav height: 64px
Chat fixed header: top-0, fixed
Chat controls: top-14 (fixed)
Chat input: bottom-0 (fixed)
```

### Animations
```
logoPulse: 2.2s ease-in-out infinite
fadeSlide: Message entry animation
blinkCaret: Typing cursor animation
rippleAnim: Touch ripple effect
```

---

## 📱 RESPONSIVE DESIGN

### Mobile (Default)
- Bottom navigation bar (5 icons)
- Full-width layouts
- Touch-friendly spacing
- Ripple effects on tap

### Desktop (md: breakpoint)
- Sidebar navigation (hidden on mobile)
- Larger fonts
- More spacing

---

## 🔧 DEVELOPMENT NOTES

1. **API Integration**: All data in `src/services/api.ts` is mocked
   - Replace with real API endpoints when backend ready
   - Keep TypeScript interfaces

2. **Speech Recognition**: Hardcoded to Hindi (`hi-IN`)
   - Not switching with i18n language toggle
   - Consider dynamic language switching in future

3. **Chat Responses**: Currently placeholder/simulated
   - Replace with real AI backend when ready
   - Keep message structure consistent

4. **State Management**: Uses React Context + localStorage
   - No Redux/Zustand needed currently
   - localStorage persists data across sessions

5. **Error Handling**: ErrorBoundary catches React errors
   - Add more specific error handling for API failures
   - Consider error toasts for user feedback

---

## 🚀 NEXT STEPS TO FIX DESKTOP RELOAD

1. Add fallback route guard in Chat.tsx
2. Provide default selectedGod value
3. Test reload on `/app/chat` directly
4. Test all navigation flows on desktop

