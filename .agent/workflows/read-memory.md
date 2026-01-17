---
description: Load AI Memory Layer context at session start
---

# Read Memory

Load project context from the AI Memory Layer and initialize a new session document.

## Steps

1. Read the project overview:
   - View file `.ai-memory/context/project.md`

2. Read architectural decisions:
   - View file `.ai-memory/context/architecture.md`

3. Read code conventions:
   - View file `.ai-memory/context/conventions.md`

4. Check for recent session summaries:
   - List files in `.ai-memory/sessions/`
   - Read the most recent session if any exist

5. **Write a very short confirmation summary** (1-8 lines max):
   - Brief confirmation that context was loaded (project name, current phase)
   - Do NOT provide detailed summaries or long explanations

6. **Create a new session document**:
   - Create a new file at `.ai-memory/sessions/YYYY-MM-DD-session-N.md` where N is incremented if multiple sessions exist for the same day
   - Use this template:

```markdown
# Session: [Pending Topic]
**Date**: YYYY-MM-DD  
**Started**: HH:MM

## Objective
[To be filled as the session progresses]

## Progress
- [ ] [Tasks will be added as work proceeds]

## Files Changed
[To be populated during session]

## Notes
[Key decisions or context to remember]
```

- Remind the user to run `/update-memory` at the end of the session

// turbo-all