# Mobile-First App Starter Template

A complete mobile-first monorepo starter template with React Native/Expo frontend, Express backend, and shared packages.

## Tech Stack

- **Frontend**: React Native + Expo, NativeWind, React Navigation, Zustand
- **Backend**: Node.js + Express, MongoDB + Mongoose, JWT Authentication
- **Shared**: Zod schemas, API client, Domain logic

## Project Structure

```
mobile-app/
├── apps/
│   └── mobile-expo/        # Expo mobile app
├── packages/
│   ├── schemas/            # Zod validation schemas
│   ├── api-client/         # Shared API client
│   └── domain/             # Business logic
├── backend/                # Express API server
└── Docs/                   # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn 4.x
- MongoDB (local or Atlas)
- Expo Go app (for mobile testing)

### Installation

```bash
# Install dependencies
yarn install

# Set up environment variables
cp backend/.env.example backend/.env
```

### Development

```bash
# Start both backend and mobile
yarn dev

# Or start individually
yarn dev:backend    # Start Express server
yarn dev:mobile     # Start Expo dev server
```

### Building

```bash
yarn build:backend  # Build backend for production
yarn build:mobile   # Build Expo app
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/mobile-app
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |

## Testing

```bash
# Run all tests
yarn test

# Type checking
yarn typecheck
```

## License

MIT
