---
name: scm
description: Guide for effective source control management with Git following modern best practices. Covers branching strategies, commit hygiene, PR workflows, and team collaboration patterns. Triggers on "git", "source control", "version control", "branching", "merge", "rebase", "git workflow", "pull request", "commit message", "git history", "git conflict", "git stash", "git cherry-pick", "git bisect", "git blame", "git log", "git diff", "git reset", "git checkout", "git switch", "git restore", "git tag", "git remote", "git fetch", "git pull", "git push", "git branch", "conventional commits", "squash", "force push", "git hooks", "pre-commit", "commit-msg", "gitignore", "git submodule", "git worktree", "feature branch", "trunk based", "git flow", "github flow", "commit and push", "commit changes", "push changes", "push to remote", "commit this", "commit these", "make a commit", "create commit". PROACTIVE: MUST invoke when performing complex Git operations or setting up workflows.
---

# Source Control Management (SCM) Skill

## Quick Reference

| Principle | Rule |
|-----------|------|
| Atomic Commits | One logical change per commit |
| Conventional Commits | `type(scope): description` format |
| Clean History | Rebase before merge for linear history |
| Branch Naming | `type/ticket-description` format |
| PR Size | < 400 lines of code changes |
| Never Force Push | To shared branches (main, develop) |

## Session Checkpoint

When a session is resumed from context compaction, verify Git state:

```
Before continuing Git operations:

1. Was I in the middle of Git operations?
   → Check summary for "commit", "merge", "rebase"

2. Current repository state:
   → Run: git status
   → Run: git log --oneline -5
   → Run: git branch -vv

3. Pending operations:
   → Check for: .git/MERGE_HEAD (merge in progress)
   → Check for: .git/rebase-merge (rebase in progress)
   → Check for: .git/CHERRY_PICK_HEAD (cherry-pick)

4. If operation was interrupted:
   → Complete or abort the pending operation
   → Verify working directory is clean
   → Ensure no uncommitted changes are lost
```

## Branching Strategies

### Git Flow (Traditional)

```
main ─────●─────────────────●─────────────●──────
          │                 ↑             ↑
          │         merge   │     merge   │
          ↓                 │             │
develop ──●──●──●──●──●─────●──●──●──●────●──────
              │     ↑           │     ↑
              ↓     │           ↓     │
feature/xyz ──●──●──┘   feature/abc ──●──┘
```

Use when: scheduled releases, multiple versions in production, formal QA process.

Branches: `main` (production), `develop` (integration), `feature/*`, `release/*`, `hotfix/*`.

### GitHub Flow (Simplified)

```
main ─────●───────●───────●───────●──────
          │       ↑       │       ↑
          ↓       │       ↓       │
feature ──●──●──●─┘ fix ──●──●────┘
```

Use when: continuous deployment, small teams, rapid iteration.

Branches: `main` (always deployable), `feature/*`/`fix/*`/`chore/*` (short-lived).

### Trunk-Based Development

Small, frequent commits directly to main. Requires mature CI/CD, feature flags, high-trust team.

## Branch Naming Convention

```
<type>/<brief-description>
```

| Type | Purpose |
|------|---------|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `chore/` | Maintenance tasks |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring |
| `test/` | Test additions |
| `hotfix/` | Emergency production fixes |

## Conventional Commits

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation only | None |
| `style` | Formatting, no code change | None |
| `refactor` | Code change, no feature/fix | None |
| `test` | Adding/fixing tests | None |
| `chore` | Build process, tooling | None |
| `perf` | Performance improvement | Patch |
| `ci` | CI configuration | None |
| `build` | Build system changes | None |
| `revert` | Revert previous commit | Varies |

### Examples

```bash
feat(auth): add OAuth2 login support
fix(api): handle null response from payment gateway
feat(api)!: change user endpoint response format

BREAKING CHANGE: The /api/users endpoint now returns
a paginated response object instead of an array.
```

## Commit Best Practices

### Atomic Commits

Each commit should represent ONE logical change, be independently revertable, pass all tests, and have a clear message.

```bash
# BAD: Multiple unrelated changes
git add .
git commit -m "various fixes and updates"

# GOOD: Separate logical changes
git add src/auth/
git commit -m "feat(auth): implement password reset flow"
git add tests/auth/
git commit -m "test(auth): add password reset tests"
```

### Commit Message Guidelines

- Subject: max 50 chars, imperative mood, no period
- Body: wrap at 72 chars, explain WHAT and WHY
- Reference issues/tickets

## Merging vs Rebasing

### When to Merge

Use merge when preserving feature branch history is important, working with shared branches, or team prefers merge commits.

```bash
git checkout main
git merge feature/user-auth --no-ff
```

### When to Rebase

Use rebase when cleaning up local commits before PR, updating feature branch with main, or maintaining linear history.

```bash
git checkout feature/user-auth
git rebase main
```

### Interactive Rebase for Cleanup

```bash
git rebase -i HEAD~5

# Commands: pick, reword, edit, squash, fixup, drop
```

## Pull Request Workflow

### Before Creating PR

1. Ensure branch is up to date: `git fetch origin && git rebase origin/main`
2. Run tests locally
3. Check for linting issues
4. Review your changes: `git diff origin/main...HEAD`

### PR Size Guidelines

| Size | Lines | Review Time |
|------|-------|-------------|
| XS | < 50 | Minutes |
| S | 50-200 | < 30 min |
| M | 200-400 | < 1 hour |
| L | 400-800 | Hours |
| XL | > 800 | Split required |

### PR Description Template

```markdown
## Summary
Brief description of changes

## Changes
- Added X feature
- Modified Y component
- Fixed Z bug

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed

## Related Issues
Closes #123
```

## Conflict Resolution

```bash
# Keep current branch version
git checkout --ours path/to/file

# Keep incoming version
git checkout --theirs path/to/file

# After manual resolution
git add path/to/file
git rebase --continue  # or git merge --continue
```

## Git Configuration

### Essential Config

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global push.autoSetupRemote true
git config --global fetch.prune true
```

### Useful Aliases

```bash
[alias]
    st = status -sb
    lg = log --oneline --graph --decorate -20
    lga = log --oneline --graph --decorate --all -20
    co = checkout
    cob = checkout -b
    ci = commit
    ca = commit --amend
    can = commit --amend --no-edit
    unstage = reset HEAD --
    uncommit = reset --soft HEAD~1
```

## Common Operations

### Undo

```bash
git reset --soft HEAD~1   # Undo commit, keep changes staged
git reset HEAD~1           # Undo commit, keep changes unstaged
git reset --hard HEAD~1    # Undo commit, discard changes
git checkout -- file       # Undo uncommitted changes to file
git revert <sha>           # Revert pushed commit (safe)
```

### Stashing

```bash
git stash                  # Stash current changes
git stash save "message"   # Stash with message
git stash -u               # Include untracked files
git stash list             # List stashes
git stash pop              # Apply and drop most recent
git stash apply stash@{2}  # Apply specific stash
```

## Safety Guidelines

### Never Do on Shared Branches

- `git push --force origin main` — use `--force-with-lease` instead
- Rebase public branches
- Reset pushed commits — use `git revert` instead

### Before Committing Checklist

- [ ] Changes are atomic (one logical change)
- [ ] Commit message follows conventional format
- [ ] Tests pass locally
- [ ] No debug code or console.logs
- [ ] No secrets or credentials
- [ ] Branch is up to date with target

### Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| `git add .` blindly | Commits unintended files | Use `git add -p` or specific files |
| "WIP" commits | Unclear history | Squash before merge |
| Force push to shared | Overwrites team work | Use `--force-with-lease` |
| Long-lived branches | Merge conflicts | Keep branches < 1 week |
| Large PRs | Slow reviews, bugs | Split into smaller PRs |
| Ignoring CI failures | Broken main branch | Fix before merge |
