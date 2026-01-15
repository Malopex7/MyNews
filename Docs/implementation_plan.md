# implementation_plan.md - Phase 1: Foundation

This plan covers the immediate steps to initialize the FanFlick application foundation.

## Goal
Establish a working "Skeleton" of FanFlick with Authentication, Navigation, and Basic Profile management.

## 1. Project renaming & Cleanup
- [ ] Rename / refactor "MyNews" references to "FanFlick" where appropriate.
- [ ] Update `package.json` metadata.
- [ ] Verify Monorepo linking.

## 2. Shared Packages (`packages/`)
- [ ] **schemas**: Update/Create `user.ts` and `trailer.ts` Zod schemas matching `Docs/schema.md`.
- [ ] **domain**: Add `TrailerType` and `UserRole` constants/enums.
- [ ] **api-client**: Clean up old endpoints; prepare Auth configuration.

## 3. Backend Implementation (`backend/`)
- [ ] Update Mongoose connection to use `fanflick` db.
- [ ] **User Model**: Implement schema with `profile` and `metrics` fields.
- [ ] **Auth Routes**: Ensure Register/Login supports `creativeFocus` and Role selection.
- [ ] **Profile Routes**: Add `GET /me` and `PUT /me/profile`.

## 4. Mobile Implementation (`apps/mobile-expo/`)
- [ ] **Theme**: Configure NativeWind with FanFlick "Cinematic Dark Mode" colors.
- [ ] **Navigation**:
    - [ ] Create `AuthStack` (Login, Register, Onboarding).
    - [ ] Create `MainTab` (Feed, Discover, Create, Inbox, Profile).
- [ ] **Screens**:
    - [ ] `OnboardingScreen`: Role and Bio setup.
    - [ ] `ProfileScreen`: Display user stats (empty for now) and "Edit Profile".
    - [ ] `FeedScreen`: Placeholder for the video feed.

## 5. Verification
- [ ] User can Register as a "Creator".
- [ ] User can Login.
- [ ] User can view their Profile with empty stats.
