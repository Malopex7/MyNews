# AI Memory Layer Guide

A zero-cloud, git-only system for AI context persistence and architectural governance.

## Overview

The AI Memory Layer provides:
- **Persistent Context** - AI reads project details across sessions
- **Decision Records** - Track architectural decisions with ADRs
- **Regression Blocking** - CI prevents breaking changes to protected files
- **Session Summaries** - Document what was accomplished

---

## Quick Reference

### File Structure
```
.ai-memory/
├── config.yaml              # Configuration
├── context/
│   ├── project.md           # Project overview
│   ├── architecture.md      # Architectural decisions
│   └── conventions.md       # Code conventions
├── decisions/
│   └── 001-template.md      # ADR template
├── checkpoints/
│   └── baseline.json        # Protected patterns
└── sessions/
    └── _template.md         # Session summary template
```

---

## Using Context Files

AI assistants should read these files at the start of each session:

| File | Purpose |
|------|---------|
| `context/project.md` | Project goals, constraints, tech stack |
| `context/architecture.md` | Key decisions and protected patterns |
| `context/conventions.md` | Code style and naming conventions |

### Updating Context
When project scope changes, update the relevant context file:

```bash
# Edit the file
code .ai-memory/context/project.md

# Commit
git add . && git commit -m "docs: Update project context"
```

---

## Logging Architectural Decisions

Use Architecture Decision Records (ADRs) for significant decisions:

```bash
# Create new ADR
cp .ai-memory/decisions/001-template.md .ai-memory/decisions/002-my-decision.md

# Edit with your decision details
code .ai-memory/decisions/002-my-decision.md

# Commit
git add . && git commit -m "docs: ADR-002 my decision"
```

### ADR Template Structure
- **Status** - Proposed, Accepted, Deprecated, Superseded
- **Context** - Problem that led to this decision
- **Decision** - What was decided
- **Consequences** - Positive and negative outcomes
- **Alternatives** - Options that were rejected

---

## Regression Blocking

The `decision-diff.yml` workflow runs on PRs and blocks merging if:

1. **Protected files are deleted** (models, schemas, routes)
2. **Required model fields are missing** (email, password, etc.)
3. **Required API endpoints are removed**

### Protected Patterns

Defined in `.ai-memory/checkpoints/baseline.json`:

| Pattern | Protection |
|---------|------------|
| `backend/src/models/*.ts` | No delete |
| `packages/schemas/src/*.ts` | No delete |
| `backend/src/routes/*.ts` | No rename |

### Adding Protection Rules

Edit `baseline.json`:

```json
{
  "rules": [
    {
      "id": "no-delete-myfile",
      "type": "no-delete",
      "path": "path/to/important.ts",
      "severity": "error",
      "message": "Cannot delete this file"
    }
  ]
}
```

---

## Session Summaries

After completing work, document what was accomplished:

```bash
# Create summary
cp .ai-memory/sessions/_template.md .ai-memory/sessions/$(date +%Y-%m-%d)-topic.md

# Edit
code .ai-memory/sessions/$(Get-Date -Format "yyyy-MM-dd")-topic.md

# Commit
git add . && git commit -m "docs: Session summary for [topic]"
```

### Summary Template
- **Summary** - Brief overview
- **Decisions Made** - Key choices with rationale
- **Files Changed** - What was modified
- **Follow-up Tasks** - Pending items

---

## Configuration

Edit `.ai-memory/config.yaml`:

```yaml
# Enable/disable features
checkpoints:
  enabled: true
  
sessions:
  enabled: true
  auto_commit: false

# Paths for AI to read
context_files:
  - context/project.md
  - context/architecture.md
  - context/conventions.md
```

---

## Best Practices

1. **Keep context files updated** when project scope changes
2. **Create ADRs** for decisions that affect multiple files
3. **Summarize sessions** to maintain project memory
4. **Add protection rules** for new critical files
5. **Review decisions** before major refactors
