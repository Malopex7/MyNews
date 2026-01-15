# User Service & DB Schema

Technical documentation for FanFlick's User system.

---

## Database Models

### User Model

```typescript
interface IUser {
  _id: ObjectId;
  username: string;        // Unique, lowercase, 3-30 chars
  email: string;           // Unique, lowercase
  password: string;        // Hashed with bcrypt
  name: string;            // 2-100 chars
  role: 'user' | 'admin';
  profileType?: 'viewer' | 'creator';
  profile: IUserProfile;
  metrics: IUserMetrics;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserProfile {
  displayName: string;     // 2-50 chars
  bio: string;             // Max 160 chars
  avatarUrl?: string;
  creativeFocus: Genre[];  // Multi-select genres
  website?: string;
}

interface IUserMetrics {
  followersCount: number;
  followingCount: number;
  totalLikesReceived: number;
}
```

### Follow Model

```typescript
interface IFollow {
  _id: ObjectId;
  followerId: ObjectId;    // User who follows
  followingId: ObjectId;   // User being followed
  createdAt: Date;
}
```

---

## User Service API

### Basic Operations

| Function | Description |
|----------|-------------|
| `findById(id)` | Get user by MongoDB ID |
| `findByEmail(email)` | Get user by email |
| `findByUsername(username)` | Get user by username |
| `findAll(page, limit)` | Paginated user list |
| `remove(id)` | Delete user |

### Profile Operations

| Function | Description |
|----------|-------------|
| `update(id, data)` | Update user profile (nested fields via dot notation) |
| `getPublicProfile(username)` | Get public-facing profile (no email/password) |

### Follow Operations

| Function | Description |
|----------|-------------|
| `follow(followerId, followingId)` | Create follow relationship |
| `unfollow(followerId, followingId)` | Remove follow relationship |
| `isFollowing(followerId, followingId)` | Check if following |
| `getFollowers(userId, page, limit)` | Get paginated followers |
| `getFollowing(userId, page, limit)` | Get paginated following |
| `incrementMetric(userId, metric, amount)` | Update user metrics |

---

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:username/profile` | Get public profile |
| GET | `/users/:id/followers` | List user's followers |
| GET | `/users/:id/following` | List who user follows |

### Authenticated Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user |
| PATCH | `/users/:id` | Update user (self or admin) |
| POST | `/users/:id/follow` | Follow a user |
| DELETE | `/users/:id/follow` | Unfollow a user |
| GET | `/users/:id/follow` | Check if following |

### Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| DELETE | `/users/:id` | Delete user |

---

## Genres (Creative Focus)

```typescript
type Genre = 
  | 'action' 
  | 'comedy' 
  | 'drama' 
  | 'sci-fi' 
  | 'horror' 
  | 'documentary' 
  | 'thriller' 
  | 'romance';
```

---

## Response Format

### Full User (authenticated)

```json
{
  "id": "...",
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "profileType": "creator",
  "profile": {
    "displayName": "John Doe",
    "bio": "Trailer enthusiast",
    "avatarUrl": "https://...",
    "creativeFocus": ["action", "sci-fi"],
    "website": "https://..."
  },
  "metrics": {
    "followersCount": 150,
    "followingCount": 42,
    "totalLikesReceived": 1024
  },
  "createdAt": "2026-01-15T...",
  "updatedAt": "2026-01-15T..."
}
```

### Public User (unauthenticated)

Same as above but **excludes**: `email`, `role`
