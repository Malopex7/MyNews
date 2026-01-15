Build a complete mobile-first app starter template in a monorepo structure using the following tech stack:

**Frontend (Mobile):**
- React Native with Expo (managed workflow)
- NativeWind for utility-first styling
- React Navigation for stack/tab/drawer navigation
- Zustand for state management
- Jest and React Native Testing Library for tests
- Hooks, components, screens, services organized in modular folders

**Backend:**
- Node.js (Express or Fastify) REST API
- MongoDB with Mongoose models
- Controllers, routes, services, middlewares properly separated
- JWT-based authentication with refresh token support
- Utility folder for helpers and shared functions

**Shared Packages:**
- API client for backend communication
- Domain logic and business rules
- Zod schemas / DTOs for validation

**Monorepo Structure:**
- `apps/mobile-expo/` → mobile frontend
- `backend/` → Node.js API backend
- `packages/` → shared logic

**Project Requirements:**
- TypeScript in frontend, backend, and shared packages
- Proper TS configuration in root and subprojects
- Workspace package management setup (Yarn Workspaces or PNPM)
- Expo config and scripts for build & deployment
- Separate folders for assets, hooks, components, navigation, screens, styles, state, services, utils
- Sample example screen with navigation and state usage
- Sample backend route with model, controller, and service
- README in root describing the project structure

**Deliverables:**
- Complete folder and file scaffold matching the structure
- Sample code in each key folder to illustrate usage (e.g., sample screen using state and API call, sample backend route with model)
- Functional TypeScript compilation without errors
- Proper package.json scripts for development, build, and testing

Do **not** include any unnecessary web-specific frameworks like Next.js or Tailwind CSS. Focus solely on **mobile-first frontend**, **Node.js backend**, and **shared packages**. Output the full file/folder structure in code blocks with content for each file where applicable.
