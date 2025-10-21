# 🕉️ Sacred Hindu App

A beautiful, responsive Ionic React app with a sacred Hindu theme, featuring internationalization support (English & Hindi), mock authentication, and multiple devotional features.

## ✨ Features

- **🙏 Mock Authentication**: OTP-based login/registration (ready for backend integration)
- **🌐 Internationalization**: Full English & Hindi support with react-i18next
- **📱 Responsive Design**: Optimized for both mobile and desktop
- **🎨 Sacred Theme**: Beautiful saffron, red, and gold color palette
- **⚡ Smooth Animations**: Minimal, polished transitions throughout
- **🔐 Protected Routes**: Secure navigation with authentication guards
- **📖 Core Features**:
  - Daily Shlokas & Cultural Highlights
  - Upcoming Festivals Calendar
  - Puja Guides & Timers
  - Donation Interface
  - Sacred Library
  - User Profile
  - Comprehensive Settings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

The app uses a comprehensive design system with semantic tokens:

### Sacred Colors

- **Saffron** (`#F57C00`): Primary brand color
- **Deep Red** (`#C62828`): Secondary color
- **Gold** (`#F6C85F`): Accent color
- **Deep Blue** (`#0B3D91`): Cultural depth
- **Deep Green** (`#2E7D32`): Natural harmony

### Design Tokens

All colors, gradients, shadows, and animations are defined in:
- `src/index.css` - CSS variables
- `tailwind.config.ts` - Tailwind theme extension

### Usage

```tsx
// Use semantic tokens, never hard-coded colors
<div className="bg-primary text-primary-foreground">
  Content
</div>

// Sacred gradients
<div className="sacred-gradient">Saffron to Gold</div>
<div className="devotion-gradient">Calm background</div>
<div className="divine-gradient">Red to Saffron</div>

// Sacred effects
<div className="sacred-card hover-sacred">Card with effects</div>
```

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn UI components
│   ├── AppLayout.tsx       # Main app layout with navigation
│   ├── ErrorBoundary.tsx   # Error handling component
│   ├── ProtectedRoute.tsx  # Auth guard component
│   └── SacredLoader.tsx    # Loading spinner
├── context/
│   └── AuthContext.tsx     # Authentication context
├── i18n/
│   ├── config.ts           # i18next configuration
│   └── locales/
│       ├── en.json         # English translations
│       └── hi.json         # Hindi translations
├── pages/
│   ├── Onboarding.tsx      # Welcome/splash screen
│   ├── Login.tsx           # Login page
│   ├── Register.tsx        # Registration page
│   ├── Home.tsx            # Main feed
│   ├── Events.tsx          # Festivals calendar
│   ├── Puja.tsx            # Puja guides
│   ├── Donate.tsx          # Donation interface
│   ├── Library.tsx         # Scriptures library
│   ├── Profile.tsx         # User profile
│   ├── Settings.tsx        # App settings
│   └── NotFound.tsx        # 404 page
├── services/
│   └── api.ts              # Mock API functions (replace with real APIs)
├── App.tsx                 # Main app component with routing
└── main.tsx                # App entry point
```

## 🔌 Backend Integration

The app is designed for easy backend integration:

### Mock API Service (`src/services/api.ts`)

All data-fetching functions are centralized here. Simply replace mock functions with real API calls:

```typescript
// Current (mock)
export const getDailyShloka = async (): Promise<Shloka> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockShloka;
};

// Replace with
export const getDailyShloka = async (): Promise<Shloka> => {
  const response = await fetch(`${API_URL}/shloka/daily`);
  return response.json();
};
```

### Authentication (`src/context/AuthContext.tsx`)

Replace localStorage-based auth with real backend:

```typescript
// Replace login/register functions with actual API calls
const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  // Store tokens, update state, etc.
};
```

### Environment Variables

Create `.env.local` for backend URLs:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_BACKEND_URL=https://yourdomain.com
```

## 🌐 Internationalization

The app supports English and Hindi through `react-i18next`:

### Adding Translations

Edit `src/i18n/locales/en.json` and `src/i18n/locales/hi.json`:

```json
{
  "nav": {
    "home": "Home",
    "events": "Events"
  }
}
```

### Using Translations

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('nav.home')}</h1>;
};
```

### Language Toggle

Users can switch languages via:
- Header button (always visible)
- Settings page

Language preference is stored in `localStorage`.

## ⚙️ Settings & Accessibility

### Font Size

Users can choose between Normal and Large font sizes.

### Reduce Motion

For users sensitive to animations, the app supports:
- Manual toggle in Settings
- Automatic detection via `prefers-reduced-motion`

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy (auto-detected as Vite app)

The `vercel.json` ensures proper SPA routing.

### Other Platforms

Build and deploy the `dist` folder:

```bash
npm run build
# Upload dist/ folder to your hosting
```

## 🎯 Key Features Explained

### Protected Routes

All `/app/*` routes require authentication:

```tsx
<ProtectedRoute>
  <AppLayout />
</ProtectedRoute>
```

### Error Boundary

Catches React errors and shows graceful fallback UI.

### Responsive Navigation

- **Mobile**: Bottom tab bar (5 main items)
- **Desktop**: Sidebar navigation (all items)

### Mock Data

All data is currently mocked in `src/services/api.ts`. This allows:
- Frontend development without backend
- Easy replacement with real APIs later
- Consistent TypeScript types

## 🛠️ Tech Stack

- **Ionic React** - Mobile-first UI components
- **React** 18 - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **react-i18next** - Internationalization
- **React Router** - Navigation
- **shadcn/ui** - UI components
- **Vite** - Build tool

## 📱 Progressive Web App

The app is PWA-ready. To enable:
1. Add a service worker
2. Create a manifest.json
3. Add offline functionality

## 🎨 Customization

### Colors

Edit `src/index.css` to change the color scheme:

```css
:root {
  --primary: 30 100% 48%; /* Saffron */
  --secondary: 0 67% 46%; /* Red */
  --accent: 45 89% 67%; /* Gold */
}
```

### Animations

Adjust in `tailwind.config.ts`:

```ts
animation: {
  'fade-in': 'fade-in 0.3s ease-out',
}
```

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

Built with devotion using modern web technologies.

Om Namah Shivaya 🕉️
