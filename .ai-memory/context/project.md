# Project Context

## Overview
**Default-Mobile-First** is a production-ready mobile app starter template using a monorepo architecture.

## Purpose
Provide a reusable foundation for building mobile applications with:
- React Native (Expo) frontend
- Node.js (Express) backend
- Shared packages for code reuse
- Pre-configured CI/CD pipelines

## Key Goals
1. **Developer Experience** - Fast setup, hot reload, TypeScript everywhere
2. **Code Sharing** - Shared schemas, API client, and domain logic
3. **Production Ready** - Authentication, state management, and CI/CD included
4. **Mobile-First** - Optimized for mobile with NativeWind styling

## Constraints
- Must work offline (no cloud dependencies for core functionality)
- Must support both iOS and Android via Expo
- Must maintain strict TypeScript compliance
- MongoDB is the required database

## Tech Stack
| Layer | Technology |
|-------|------------|
| Mobile | React Native, Expo, NativeWind |
| State | Zustand |
| Navigation | React Navigation |
| Backend | Express, Mongoose |
| Auth | JWT with refresh tokens |
| Validation | Zod (shared) |

## Repository Structure
```
apps/mobile-expo/     # Expo mobile application
backend/              # Express API server
packages/
  ├── schemas/        # Zod validation schemas
  ├── api-client/     # Shared HTTP client
  └── domain/         # Business logic & constants
```
