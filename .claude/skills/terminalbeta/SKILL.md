```markdown
# terminalbeta Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill provides guidance on contributing to the `terminalbeta` TypeScript codebase. It covers coding conventions, commit message patterns, and common workflows such as updating documentation, managing skills, and adjusting tracked files. The repository does not use a framework and emphasizes clarity, maintainability, and consistency in its development practices.

## Coding Conventions

**File Naming**
- Use camelCase for filenames.
  - Example: `userProfile.ts`, `commandHandler.ts`

**Import Style**
- Use relative imports for modules within the repository.
  - Example:
    ```typescript
    import { getUser } from './userService';
    ```

**Export Style**
- Prefer named exports.
  - Example:
    ```typescript
    // In userService.ts
    export function getUser(id: string) { ... }
    export const USER_ROLE = 'admin';
    ```

**Commit Messages**
- Follow [Conventional Commits](https://www.conventionalcommits.org/) format.
- Common prefixes: `fix`, `chore`, `feat`
- Example:
  ```
  feat: add user profile command
  fix: correct typo in quickstart instructions
  chore: update dependencies
  ```

## Workflows

### Update User Documentation
**Trigger:** When you need to clarify or fix installation instructions or user guidance in documentation.  
**Command:** `/update-docs`

1. Edit documentation files such as `docs/quickstart.md` or `README.md` to update or clarify instructions.
2. Commit the changes with a message referencing the specific clarification or fix.
   - Example:
     ```
     fix: clarify installation steps in README.md
     ```
3. Push your changes and open a pull request if required.

### Add or Update Skill
**Trigger:** When you want to introduce a new skill or update the set of available skills for users.  
**Command:** `/add-skill`

1. Create or update `SKILL.md` and reference files in the appropriate skills directory (e.g., `.claude/skills/` or `.xtrm/skills/`).
2. If adding a new skill, ensure references and supporting files are included.
3. Update `.gitignore` if necessary to track or untrack skill directories.
4. Commit the changes with a message referencing the new or updated skill.
   - Example:
     ```
     feat: add SKILL.md for terminalbeta contribution workflow
     ```
5. Push your changes and open a pull request if required.

### Adjust .gitignore and Untrack Files
**Trigger:** When you want to exclude dev-only files or directories from the repository or adjust which files are tracked.  
**Command:** `/update-gitignore`

1. Edit `.gitignore` to add or remove patterns for files/directories.
   - Example:
     ```
     # Ignore build artifacts
     dist/
     ```
2. Untrack files from git history as needed:
   ```sh
   git rm --cached path/to/file
   ```
3. Commit the changes with a message referencing the `.gitignore` update and untracked files.
   - Example:
     ```
     chore: update .gitignore to exclude dist directory
     ```
4. Push your changes and open a pull request if required.

## Testing Patterns

- Test files follow the `*.test.*` pattern (e.g., `userService.test.ts`).
- The specific testing framework is not specified, but tests are colocated with source files or in a dedicated test directory.
- Example test file:
  ```typescript
  // userService.test.ts
  import { getUser } from './userService';

  test('getUser returns correct user', () => {
    expect(getUser('123').id).toBe('123');
  });
  ```

## Commands

| Command         | Purpose                                                |
|-----------------|--------------------------------------------------------|
| /update-docs    | Update or clarify user-facing documentation            |
| /add-skill      | Add a new skill or update existing skills              |
| /update-gitignore | Adjust .gitignore and untrack files as needed        |
```