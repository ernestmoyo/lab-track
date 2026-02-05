# Contributing to LabTrack

Thank you for your interest in contributing to LabTrack! This guide will help you get started.

## How to Contribute

### Reporting Bugs
1. Search [existing issues](https://github.com/ernestmoyo/lab-track/issues) to avoid duplicates
2. Use the **Bug Report** template when creating a new issue
3. Include steps to reproduce, expected behavior, and actual behavior
4. Add screenshots or logs if possible

### Suggesting Features
1. Open an issue with the **Feature Request** template
2. Describe the use case and how your lab would benefit
3. Be open to discussion about implementation approaches

### Submitting Code

#### First-Time Setup
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/lab-track.git
cd lab-track
git remote add upstream https://github.com/ernestmoyo/lab-track.git

# Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..
```

#### Development Workflow
1. Create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes following our coding standards
3. Write or update tests for your changes
4. Run tests to ensure everything passes:
   ```bash
   cd server && npm test
   cd client && npm test
   ```
5. Commit with a clear message:
   ```bash
   git commit -m "feat: add sample barcode scanning"
   ```
6. Push and open a Pull Request

#### Commit Message Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### Non-Code Contributions
- **Documentation**: Fix typos, improve explanations, add tutorials
- **Translation**: Help translate the interface and docs
- **Design**: Submit mockups or UX improvements as issues
- **Testing**: Try LabTrack in your lab and report your experience

## Coding Standards

### General
- Write clean, readable code with meaningful variable names
- Keep functions small and focused
- Add comments only where logic isn't self-evident

### Backend (Node.js)
- Use async/await for asynchronous code
- Validate all inputs at the API boundary
- Return consistent error responses
- Write unit tests for services, integration tests for routes

### Frontend (React)
- Use functional components with hooks
- Keep components small and composable
- Use TailwindCSS utility classes for styling
- Write tests for user interactions

## Code Review Process
1. All PRs require at least one review
2. CI must pass (tests, linting)
3. Maintainers may request changes
4. Once approved, a maintainer will merge

## Getting Help
- Comment on the issue you're working on
- Open a draft PR for early feedback
- Reach out at ernestmoyo35@gmail.com

## Recognition
All contributors are recognized in our releases. Your work matters and is appreciated!
