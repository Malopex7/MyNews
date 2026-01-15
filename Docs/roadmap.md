# FanFlick Roadmap

This roadmap outlines the phased development of FanFlick, a creator-driven social platform for short trailers.

## Phase 1: Foundation & Identity (Weeks 1-2)
**Goal:** Establish the core infrastructure, branding, and user system.

- [x] **Project Setup**
    - [x] Initialize branding (Cinematic, Dark Mode, Minimal).
    - [x] Set up navigation structure (Feed, Discover, Post, Inbox, Profile).
    - [x] Configure specialized typography and assets.

- [x] **Authentication & Profiles**
    - [x] Sign up/Login (Email, Social).
    - [x] User Onboarding (Role selection: Viewer/Creator).
    - [x] Profile Management (Bio, Avatar, "Creative Focus").

- [x] **Core Backend**
    - [x] User Service & DB Schema.
    - [x] Basic Media Storage (GridFS setup).

## Phase 2: The Studio (Weeks 3-4)
**Goal:** Build the "Trailer Creation Flow" - the heart of the app.

- [/] **Media Capture**
    - [-] Camera interface (Record clips) - *Deferred (No physical device)*
    - [ ] Gallery import.

- [ ] **Trailer Editor**
    - [ ] Timeline-based sequencing (30s - 180s constraint).
    - [ ] Tool: Title Cards ("Coming Soon", "What If").
    - [ ] Tool: Audio (Voiceover recording, Music selection).
    - [ ] Tool: Text overlays and cinematic fonts.

- [ ] **Publishing Flow**
    - [ ] Metadata: Title, Description, Type (Original, Parody, etc.), Genre, Tone.
    - [ ] Legal disclaimer injection ("Fan-created content...").
    - [ ] Publishing endpoint.

## Phase 3: The Stage (Weeks 5-6)
**Goal:** Discovery, playback, and consumption.

- [ ] **Feed Experience**
    - [ ] Vertical, full-screen, cinematic player.
    - [ ] Discovery logic (Quality > Recency).
    - [ ] Categories: "Top Parodies", "New Concepts", "Sci-Fi Thrillers".

- [ ] **Player Interactions**
    - [ ] Auto-play with sound strategy.
    - [ ] "Save to Watchlist".
    - [ ] "Explore Creator" transition.

## Phase 4: Creative Exchange (Weeks 7-8)
**Goal:** Engagement interactions specific to storytelling.

- [ ] **Structured Feedback**
    - [ ] Trailer-specific Polls ("Sequel?", "Cast this?").
    - [ ] Comments section with "Critique" vs "Hype" sorting.

- [ ] **Response Trailers**
    - [ ] "Stitch" or "Response" workflow.
    - [ ] Linking answering trailers to originals.

- [ ] **Notifications**
    - [ ] Engagement alerts.
    - [ ] "New Trailer from [Creator]" push notifications.

## Phase 5: Polish & Safety (Week 9)
**Goal:** Prepare for launch.

- [ ] **Moderation**
    - [ ] Report content flow.
    - [ ] Admin dashboard for review.
    - [ ] Copyright flagging system.

- [ ] **Performance**
    - [ ] Video optimization and caching.
    - [ ] Offline support for drafts.

- [ ] **Launch**
    - [ ] App Store / Play Store submission preparations.
