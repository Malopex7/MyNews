# Code Conventions

## TypeScript

### Naming
- **Files:** `camelCase.ts` or `PascalCase.tsx` for React components
- **Interfaces:** `I` prefix (e.g., `IUser`, `IAuthStore`)
- **Types:** No prefix, PascalCase (e.g., `User`, `AuthResponse`)
- **Enums:** SCREAMING_SNAKE_CASE values

### Exports
- Use named exports for utilities and components
- Use default export for pages/screens
- Barrel exports via `index.ts` files

### Example
```typescript
// Good
export interface IUser {
  id: string;
  email: string;
}

export const formatDate = (date: Date): string => { ... }

export default function HomeScreen() { ... }
```

---

## React Native / Expo

### Components
- Functional components with hooks
- NativeWind for styling (Tailwind-like classes)
- Custom hooks in `hooks/` folder

### File Structure
```
screens/
  HomeScreen.tsx        # Screen component
  index.ts              # Barrel export

components/
  Button.tsx            # Reusable component
  index.ts              # Barrel export

hooks/
  useAuth.ts            # Custom hook
  index.ts              # Barrel export
```

### Styling Pattern
```tsx
// Use NativeWind className prop
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-gray-900">
    Hello
  </Text>
</View>
```

---

## Backend (Express)

### Route Pattern
```typescript
router.post('/endpoint', authenticate, async (req, res) => {
  try {
    // Validate with Zod
    const data = SomeSchema.parse(req.body);
    
    // Business logic via service
    const result = await someService.doSomething(data);
    
    // Respond
    res.json(result);
  } catch (error) {
    next(error);
  }
});
```

### Service Pattern
- Services contain business logic
- Controllers handle HTTP concerns
- Models define data structure

### Error Handling
- Use `next(error)` in routes
- Central error middleware catches all
- Zod errors return 400
- Auth errors return 401

---

## Git Commits

### Format
```
type(scope): description

type: feat, fix, docs, style, refactor, test, chore
scope: backend, mobile, schemas, api-client, domain, ci
```

### Examples
```
feat(backend): add password reset endpoint
fix(mobile): resolve login form validation
docs: update README with setup instructions
chore(ci): add code coverage reporting
```

---

## Testing (Future)

- Jest for unit tests
- React Native Testing Library for components
- Supertest for API endpoints
- Test files: `*.test.ts` or `*.spec.ts`
