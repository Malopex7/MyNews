# FanFlick Architecture

## System Overview
FanFlick is a mobile-first distributed system designed for high-quality video content delivery and creation. It uses a monorepo structure to share types and logic between the mobile client and backend API.

## Tech Stack

| Component | Technology | Reasoning |
|-----------|------------|-----------|
| **Mobile Client** | React Native (Expo) | Cross-platform, fast development, OTA updates. |
| **Styling** | NativeWind | Utility-first, consistently matches design tokens. |
| **State** | Zustand | Simple, scalable global state management. |
| **Backend API** | Node.js / Express | Fast I/O, leverages shared TypeScript packages. |
| **Database** | MongoDB | Flexible schema for evolving content types (Trailers). |
| **Validation** | Zod | Runtime validation shared across full stack. |
| **Media Storage** | S3 / Cloudinary | scalable object storage for video blobs. |

## High-Level Diagram

```mermaid
graph TD
    Client[Mobile App (Expo)]
    API[Backend API (Express)]
    DB[(MongoDB)]
    Storage[(Media Storage)]
    Processing[Video Transcoder]

    Client -- Uploads --> API
    API -- Stores Metadata --> DB
    API -- Buffers/Streams --> Storage
    Storage -- Triggers --> Processing
    Processing -- Updates Status --> API
    Client -- Streams Video --> Storage
```

## Core Modules

### 1. The Studio (Client-Side)
- **Timeline Engine**: Manages sequencing of clips, audio, and overlays.
- **Draft Store**: Local persistence (SQLite/AsyncStorage) for works-in-progress.
- **Renderer**: Combines assets into a final `.mp4` for upload (FFmpeg kit or native modules).

### 2. Content Delivery (Backend)
- **Feed Algorithm**:
    1. Fetches candidate pool based on signals (Recency, Genre).
    2. Scores candidates (Completion Rate * 0.4 + Save Rate * 0.3 + Recency * 0.3).
    3. Injects diversity rules (limit consecutive posts from same creator).
- **Video Service**: Handles presigned URLs for secure uploads and CDN delivery.

### 3. Identity & Social
- **Auth**: JWT-based (Access + Refresh tokens).
- **Profile**: Aggregates User stats and Trailer collections.
- **Graph**: Follow/Follower relationships.

## Data Flow: "Publishing a Trailer"

1. **Draft**: User edits trailer locally. Assets stored in app cache.
2. **Compile**: App flattens timeline and renders final video file.
3. **Request**: App requests upload URL from `POST /api/trailers/upload-request`.
4. **Upload**: App uploads file directly to Storage (S3) via presigned URL.
5. **Confirm**: App calls `POST /api/trailers` with metadata and file key.
6. **Process**: Backend queues generic transcoding job (HLS/Dash if needed).
7. **Live**: Trailer becomes visible in Creator profile immediately, and Feed after processing.

## Security & Constraints
- **Content**: Enforce 180s max duration server-side.
- **Storage**: User quota limits (e.g., 5GB per free user).
- **API**: Rate limiting on all write endpoints.
