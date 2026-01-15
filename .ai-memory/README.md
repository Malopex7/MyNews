# AI Memory Layer

A drop-in, zero-cloud, git-only system for AI context persistence and architectural governance.

## Features

1. **Persistent Context** - AI reads project context on session start
2. **Decision Tracking** - Architecture Decision Records (ADRs)
3. **Regression Blocking** - CI workflow prevents breaking changes
4. **Session Summaries** - Document what was accomplished

---

## Quick Start

### 1. Context Files
AI reads these files to understand your project:

| File | Purpose |
|------|---------|
| `context/project.md` | Project overview, goals, constraints |
| `context/architecture.md` | Key architectural decisions |
| `context/conventions.md` | Code style and patterns |

### 2. Log a Decision
When making an architectural decision:

```bash
cp .ai-memory/decisions/001-template.md .ai-memory/decisions/002-my-decision.md
# Edit the new file
git add . && git commit -m "docs: ADR-002 my decision"
```

### 3. Summarize a Session
After completing work:

```bash
cp .ai-memory/sessions/_template.md .ai-memory/sessions/$(date +%Y-%m-%d)-topic.md
# Fill in the summary
git add . && git commit -m "docs: Session summary for [topic]"
```

---

## How Regression Blocking Works

The `decision-diff.yml` workflow runs on PRs and checks:

1. **No deletion of protected files** (models, schemas, routes)
2. **Required model fields exist** (User must have email, password, etc.)
3. **Required API endpoints exist** (register, login, refresh, logout)

If violations are found, the PR is blocked and a comment is added.

### Protected Patterns

Defined in `.ai-memory/checkpoints/baseline.json`:
- `backend/src/models/*.ts`
- `packages/schemas/src/*.ts`
- `backend/src/routes/*.ts`

### Adding New Protected Patterns

Edit `baseline.json` and add to the `rules` array:

```json
{
  "id": "no-delete-myfile",
  "type": "no-delete",
  "path": "path/to/myfile.ts",
  "severity": "error",
  "message": "Cannot delete this file, it is protected by the AI Memory Layer."
}
```

---

## Configuration

Edit `.ai-memory/config.yaml` to customize behavior:

```yaml
checkpoints:
  enabled: true
  protected_paths:
    - "backend/src/models/**"
    
sessions:
  enabled: true
  auto_commit: false
```

---

## File Structure

```
.ai-memory/
├── config.yaml            # Configuration
├── context/
│   ├── project.md         # Project overview
│   ├── architecture.md    # Architectural decisions
│   └── conventions.md     # Code conventions
├── decisions/
│   └── 001-template.md    # ADR template
├── checkpoints/
│   └── baseline.json      # Protected patterns
└── sessions/
    └── _template.md       # Session summary template
```

---

## Best Practices

1. **Update context files** when project scope changes
2. **Create ADRs** for significant architectural decisions
3. **Summarize sessions** to maintain project history
4. **Review baseline.json** when adding critical new files

---

## Integration with AI Assistants

When starting a new AI session, the assistant can read:
- `.ai-memory/context/*.md` for project understanding
- `.ai-memory/decisions/*.md` for past decisions
- `.ai-memory/sessions/*.md` for recent work context

This provides persistent memory without cloud dependencies.
