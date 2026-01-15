# Architecture Decisions

## Overview
This document captures the key architectural decisions for the project.

---

## Authentication

**Decision:** JWT with refresh token rotation

**Rationale:**
- Stateless authentication for scalability
- Refresh tokens allow long sessions without long-lived access tokens
- Token stored in secure storage (expo-secure-store) on mobile

**Implementation:**
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Refresh endpoint rotates both tokens

---

## State Management

**Decision:** Zustand with persist middleware

**Rationale:**
- Minimal boilerplate compared to Redux
- Built-in persist support
- TypeScript-first design
- No context provider wrapping needed

**Stores:**
- `authStore` - Authentication state and tokens
- `appStore` - App-wide settings (theme, connectivity)

---

## API Architecture

**Decision:** Shared API client with automatic token refresh

**Rationale:**
- Single source of truth for API calls
- Interceptors handle auth automatically
- Type-safe with Zod schema validation

**Flow:**
1. Request interceptor adds access token
2. 401 response triggers refresh flow
3. Original request retried with new token

---

## Monorepo Structure

**Decision:** Yarn Workspaces with shared packages

**Rationale:**
- Code sharing without npm publishing
- Single dependency tree
- Consistent tooling across packages

**Packages:**
- `@packages/schemas` - Validation (shared by frontend & backend)
- `@packages/api-client` - HTTP client (frontend only)
- `@packages/domain` - Business logic (shared)

---

## Database

**Decision:** MongoDB with Mongoose

**Rationale:**
- Flexible schema for rapid iteration
- Native JavaScript/TypeScript support
- Easy cloud deployment (MongoDB Atlas)

---

## DO NOT CHANGE

The following patterns are protected:

1. **User model must include:** `email`, `password`, `name`, `role`, `refreshToken`
2. **Auth endpoints must exist:** `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`
3. **Shared packages must use `@packages/*` naming**
4. **Mobile app must use Expo managed workflow**
