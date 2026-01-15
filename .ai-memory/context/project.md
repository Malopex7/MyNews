# Project Context

## Overview
**FanFlick** is a creator-driven social platform for short, trailer-style storytelling.
(Formerly: Default-Mobile-First / MyNews)

## Purpose
Enable fans and creators to reimagine stories through original or parody trailers (30s–180s). It is a "Quality-First" video platform.

## Key Goals
1. **Cinematic Identity**: Dark mode, minimal, trailer-centric UI.
2. **Structured Creativity**: Content must be a "Trailer" (Original, Parody, etc.).
3. **Active Engagement**: Reponse trailers, polls, and constructive feedback.
4. **Mobile-First**: Optimized for editing and viewing on mobile.

## Constraints
- **Content**: 30s min, 180s max.
- **Rules**: Must be labeled (Parody/Original). No generic "vlog" content.
- **Tech**: Expo (Managed), Node/Express, MongoDB.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Mobile | React Native, Expo, NativeWind |
| State | Zustand |
| Backend | Express, Mongoose |
| Database | MongoDB |
| Media | S3-compatible storage (planned) |
| Auth | JWT with Refresh Tokens |

## Repository Structure
```
apps/mobile-expo/     # FanFlick Mobile Client
backend/              # API Server
packages/
  ├── schemas/        # Shared Zod definitions
  ├── api-client/     # Typed API Client
  └── domain/         # Constants (TrailerTypes, Roles)
Docs/                 # Project Documentation (Roadmap, Architecture)
```
