---
description: Update AI Memory session document at end of chat
---

# Update Memory

Finalize and update the session document created by `/read-memory`.

## Steps

1. **Find the current session document**:
   - List files in `.ai-memory/sessions/`
   - Find today's session file (the one created by `/read-memory`)

2. **Update the session document** with:
   - A descriptive title (replace "[Pending Topic]" with actual topic)
   - Summary of what was accomplished
   - Mark completed tasks with ✅
   - List of files changed during the session
   - Any important notes or follow-up tasks

3. **Use this final format**:

```markdown
# Session: <Descriptive Topic>
**Date**: YYYY-MM-DD  
**Duration**: ~X hours

## Summary
Brief 1-2 sentence summary of what was accomplished.

## Completed
- ✅ Task 1
- ✅ Task 2

## Key Files Modified
| Area | Files |
|------|-------|
| Backend | `file1.ts`, `file2.ts` |
| Mobile | `file3.tsx`, `file4.tsx` |

## Next Steps
- Follow-up task 1
- Follow-up task 2
```

4. **Confirm update**:
   - Show the user the updated session file
   - Ask if they want to commit to git

// turbo-all
