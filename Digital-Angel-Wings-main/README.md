# Digital Angel Wings

A modern web application showcasing Digital Angel Wings consultancy services focused on bridging advanced technology with sustainable development in emerging markets.

## Architecture

```
angel-wings/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── Navbar.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Hero.tsx            # Landing page with services
│   │   │   ├── Introduction.tsx    # About page
│   │   │   ├── Progress.tsx        # Services detail page
│   │   │   └── Contact.tsx         # Contact information
│   │   ├── App.tsx         # Main app component with routing
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Backend API (Node.js/Express)
│   ├── src/
│   └── package.json
│
└── supabase/              # Database
    └── schema.sql

```

## Design System

### Color Palette
- **Primary**: `#2563eb` - Professional blue for brand identity
- **Secondary**: `#10b981` - Green representing sustainability
- **Accent**: `#f59e0b` - Warm accent for highlights
- **Light**: `#f8fafc` - Clean background
- **Dark**: `#1e293b` - Text and headings
- **Muted**: `#64748b` - Secondary text

### Design Principles
- Clean, professional layout with light background
- Service cards with icons inspired by modern B2B websites
- Responsive design for mobile and desktop
- Smooth animations using Framer Motion
- Card-based content presentation

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript**
- API endpoints for contact information

### Database
- **Supabase** (PostgreSQL)

## Key Features

1. **Modern Landing Page**: Hero section with clear value proposition and service overview
2. **Service Cards**: Four main service areas with descriptions and features
3. **About Section**: Company vision and mission statement
4. **Contact Page**: Easy-to-use contact information with email integration
5. **Responsive Navigation**: Clean navbar with mobile support

## Services Offered

1. **Sustainable Solutions** - Green energy and environmental projects
2. **Knowledge Sharing** - Training and capacity building
3. **Outsourcing & Technology** - Custom solutions and local development
4. **Innovative Partnerships** - Public-private collaboration

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies for all packages
npm install

# Client setup
cd client
npm install
npm run dev

# Server setup
cd server
npm install
npm run dev
```

### Admin Panel
Access the admin panel at `/admin/login` (default password: `angel2024`)

See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for detailed instructions.

### Available Scripts
- `npm run type-check` - Type check all packages
- `npm run lint` - Lint all packages
- `npm run lint:fix` - Fix linting issues
- `npm run build` - Build all packages

## Recent Changes

### Design Overhaul (November 2025)
- Migrated from dark theme to professional light theme
- Updated color palette for modern B2B aesthetic
- Redesigned service cards with icon-based layout
- Improved content structure based on company documentation
- Simplified navigation (3 main sections instead of 6)
- Enhanced mobile responsiveness

## Contact

Email: dilwara4@yahoo.com

---

*Building bridges between innovation and sustainability*
