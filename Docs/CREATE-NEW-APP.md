# How to Create New Apps from Template

This guide explains how to use the **Default-Mobile-First** template to create new mobile applications.

## Prerequisites

- Node.js >= 18
- Yarn (installed globally)
- Git
- GitHub CLI (`gh`) - optional but recommended
- MongoDB (local or Atlas)

---

## Option 1: GitHub Template (Recommended)

### Step 1: Create from Template

Go to the repository and click **"Use this template"** → **"Create a new repository"**

Or use GitHub CLI:

```powershell
gh repo create MyNewApp --template Malopex7/Default-Mobile-first --public --clone
cd MyNewApp
```

### Step 2: Install Dependencies

```powershell
yarn install
```

### Step 3: Configure Environment

```powershell
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your values:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Generate a secure random string
- `JWT_REFRESH_SECRET` - Generate another secure random string

### Step 4: Update App Identity

1. Edit `apps/mobile-expo/app.json`:
   - Change `name`, `slug`, `bundleIdentifier`, and `package`
   
2. Replace icons in `apps/mobile-expo/assets/`

### Step 5: Start Development

```powershell
# Terminal 1 - Backend
yarn dev:backend

# Terminal 2 - Mobile
yarn dev:mobile
```

---

## Option 2: Manual Clone

```powershell
git clone https://github.com/Malopex7/Default-Mobile-first.git MyNewApp
cd MyNewApp

# Remove original git history
Remove-Item -Recurse -Force .git

# Initialize fresh repo
git init
git add .
git commit -m "Initial commit from template"

# Install dependencies
yarn install
```

---

## Post-Setup Checklist

- [ ] Update `package.json` name in root and all workspaces
- [ ] Update `app.json` with your app details
- [ ] Replace placeholder icons/splash screens
- [ ] Configure your MongoDB database
- [ ] Update GitHub Actions secrets if using CI/CD
- [ ] Push to your new repository

---

## Project Structure

```
your-new-app/
├── apps/mobile-expo/     # Expo mobile app
├── backend/              # Express + MongoDB API
├── packages/
│   ├── schemas/          # Zod validation
│   ├── api-client/       # Shared HTTP client
│   └── domain/           # Business logic
└── .github/workflows/    # CI/CD pipelines
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `yarn dev` | Start both backend and mobile |
| `yarn dev:backend` | Start backend only |
| `yarn dev:mobile` | Start mobile only |
| `yarn build:backend` | Build backend for production |
| `yarn typecheck` | Run TypeScript checks |

---

## Need Help?

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [NativeWind](https://www.nativewind.dev/)
