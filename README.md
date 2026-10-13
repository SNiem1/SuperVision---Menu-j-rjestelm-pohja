# Restaurant Digital Menu & Ordering System — White-Label Platform

A modular, multi-tenant digital menu and guest ordering web application designed for restaurants. To onboard a new restaurant client, you edit a configuration file and a menu data file — no code forks or hardcoded string replacements required.

---

## 🚀 Quick Onboarding Guide

To onboard a new restaurant client:

### 1. Update Restaurant Configuration (`src/config/restaurant.ts`)
Modify `restaurantConfig` to reflect the new client's identity:

```ts
import { RestaurantConfig } from '../types';
import LogoImg from '../assets/new-logo.png'; // or import from src/Images/

export const restaurantConfig: RestaurantConfig = {
  slug: 'new-restaurant',
  name: 'New Restaurant Name',
  tagline: {
    fi: 'Suomenkielinen slosani',
    en: 'English tagline or slogan',
  },
  description: {
    fi: 'Kuvaus ravintolasta suomeksi.',
    en: 'Description of the restaurant in English.',
  },
  foundingYear: 2024,
  address: 'Mannerheimintie 1',
  city: 'Helsinki',
  postalCode: '00100',
  phone: '+358 10 123 4567',
  email: 'info@newrestaurant.fi',
  openingHours: [
    { dayRange: { fi: 'Ma - Pe', en: 'Mon - Fri' }, hours: '11:00 - 22:00' },
    { dayRange: { fi: 'La - Su', en: 'Sat - Sun' }, hours: '12:00 - 23:00' },
  ],
  logoUrl: LogoImg,
  faviconUrl: '/favicon.png',
  brandColors: {
    blue: '#1e3a5f',      // Primary brand color
    gold: '#d4af37',      // Accent / highlight color
    goldText: '#997a15',  // Text accent color
    cream: '#fcfbf7',     // Background canvas color
    ink: '#1e1e1a',       // Main text color
  },
  legal: {
    entityName: 'New Restaurant Oy',
    businessId: '1234567-8',
  },
  currency: '€',
  locale: 'fi-FI',
  categories: [
    { id: 'starters', name: { fi: 'Alkuruoat', en: 'Starters' } },
    { id: 'mains', name: { fi: 'Pääruoat', en: 'Mains' } },
    { id: 'desserts', name: { fi: 'Jälkiruoat', en: 'Desserts' } },
    { id: 'wines', name: { fi: 'Viinit', en: 'Wines' } },
  ],
};
```

### 2. Configure Menu Items (`src/data/menuData.ts`)
Update the `MENU_ITEMS` array with the new restaurant's dishes, pricing, allergens, and images. The categories automatically map from `restaurantConfig.categories`.

```ts
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'starter-1',
    category: 'starters',
    name: { fi: 'Keitto', en: 'Soup' },
    description: { fi: 'Talon keitto', en: 'House soup' },
    allergens: ['G', 'L'],
    price: 12.00,
    imageUrl: 'https://images.unsplash.com/...',
  },
];
```

### 3. Replace Brand Assets
Place the new logo and favicon in `src/Images/` (or `assets/`) and reference them in `src/config/restaurant.ts`.

---

## 🎨 Dynamic Runtime Theme System

Brand colors are defined in `restaurantConfig.brandColors`. At runtime, these are injected onto the `:root` element as CSS variables:
- `--color-brand-blue`
- `--color-brand-gold`
- `--color-brand-gold-text`
- `--color-brand-cream`
- `--color-brand-ink`

Tailwind CSS picks up these variables via `@theme` in `src/index.css`. Changing the color HEX values in `restaurantConfig` updates the entire UI palette instantly.

---

## 📜 Dynamic Legal Documents (`src/config/legal.ts`)

Privacy Policy (GDPR), Terms of Service, and Cookie Policy documents are generated dynamically from `restaurantConfig` properties (`legal.entityName`, `legal.businessId`, `address`, `phone`, `email`, `name`). Client-specific legal copy automatically updates whenever the configuration changes.

---

## 🛠️ Architecture Overview

- **`src/types.ts`**: Contains the strict TypeScript `RestaurantConfig` interface enforcing all required fields at compile time.
- **`src/config/restaurant.ts`**: The single source of truth for restaurant metadata, branding, palette, contact info, and category structure.
- **`src/config/legal.ts`**: Dynamic generator functions for localized legal texts.
- **`src/data/menuData.ts`**: Dish definitions, pricing, price options, allergens, and pre-seeded reviews.
- **`src/components/Header.tsx`**: Header component reading logo and restaurant name from config.
- **`src/components/LegalModal.tsx`**: Modal rendering GDPR privacy, terms, and cookie policies dynamically.
- **`src/App.tsx`**: Main application state, theme binder, and footer component driven by config.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Lint codebase
npm run lint

# Production build
npm run build
```
