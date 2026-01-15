# Mobile-First App Starter Template Structure

This is a recommended file/folder structure for a starter mobile-first app based on the defined tech stack.

```
mobile-app/
├── apps/
│   └── mobile-expo/                  # Expo app root
│       ├── App.tsx                    # Entry point
│       ├── app.json                    # Expo config
│       ├── assets/                     # Images, fonts, icons
│       ├── components/                 # Shared UI components
│       ├── navigation/                 # React Navigation stacks and tabs
│       ├── screens/                     # App screens/views
│       ├── state/                       # Zustand stores
│       ├── styles/                      # NativeWind configs or design tokens
│       ├── services/                    # API clients, auth services
│       ├── utils/                       # Utility functions, helpers
│       └── hooks/                       # Custom hooks
│
├── packages/                           # Shared logic between mobile and backend
│   ├── domain/                          # Business rules, validations
│   ├── api-client/                       # Shared API request logic
│   └── schemas/                          # Zod schemas, DTOs
│
├── backend/                             # Node.js backend
│   ├── src/
│   │   ├── controllers/                 # Express/Fastify route handlers
│   │   ├── routes/                       # API route definitions
│   │   ├── models/                       # MongoDB models
│   │   ├── middlewares/                  # Auth, error handling, logging
│   │   ├── services/                     # Business logic / service layer
│   │   └── utils/                        # Helpers, utilities
│   ├── package.json
│   ├── tsconfig.json
│   └── server.ts                         # Backend entry point
│
├── .gitignore
├── package.json                          # Root package for workspace management
├── tsconfig.json                          # Root TypeScript config
└── README.md
```

**Notes:**

* `packages/` is for **shared code** like API clients, domain logic, and Zod schemas.
* `apps/mobile-expo/` is the **native mobile frontend** using Expo.
* `backend/` contains Node.js APIs and MongoDB models.
* This structure is compatible with monorepo tooling like Yarn Workspaces or PNPM Workspaces.
* Keep assets, hooks, and utils modular for maintainability.
