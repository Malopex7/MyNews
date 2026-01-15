# FanFlick Data Schemas

## Models

### User
Represents a registered user (Viewer or Creator).

```typescript
interface IUser {
  _id: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: 'VIEWER' | 'CREATOR' | 'ADMIN';
  profile: {
    displayName: string;
    bio: string;
    avatarUrl: string;
    creativeFocus: string[]; // e.g., ["Sci-Fi", "Horror"]
    website?: string;
  };
  metrics: {
    followersCount: number;
    followingCount: number;
    totalLikesReceived: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Trailer
The core content unit.

```typescript
type TrailerType = 'ORIGINAL' | 'PARODY' | 'WHAT_IF' | 'CONTINUATION';

interface ITrailer {
  _id: ObjectId;
  creatorId: ObjectId; // Ref to User
  
  // Content
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number; // 30-180 constraint
  
  // Categorization
  type: TrailerType;
  genre: string; // e.g., "Action", "Drama"
  tone: string[]; // e.g., ["Dark", "Humorous"]
  tags: string[];
  
  // Engagement Stats
  stats: {
    views: number;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
    completionRate: number; // calculated field
  };
  
  // Status
  isVisible: boolean;
  isFlagged: boolean;
  
  createdAt: Date;
}
```

### Interaction (Engagement)
Tracks likes, saves, and report actions.

```typescript
interface IInteraction {
  _id: ObjectId;
  userId: ObjectId;
  trailerId: ObjectId;
  type: 'LIKE' | 'SAVE' | 'REPORT' | 'VIEW';
  metadata?: any; // For reports: reason, etc.
  createdAt: Date;
}
```

### Comment
Threaded comments on trailers.

```typescript
interface IComment {
  _id: ObjectId;
  trailerId: ObjectId;
  userId: ObjectId;
  parentId?: ObjectId; // For replies
  content: string;
  likesCount: number;
  createdAt: Date;
}
```

### Poll (Structured Feedback)
Attached to a trailer.

```typescript
interface IPoll {
  _id: ObjectId;
  trailerId: ObjectId;
  creatorId: ObjectId;
  question: string;
  options: {
    text: string;
    votes: number;
  }[];
  expiresAt: Date;
  active: boolean;
}
```
