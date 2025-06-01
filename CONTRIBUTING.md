# Contributing to Elira

Thank you for your interest in contributing to Elira! This document provides guidelines and information for contributors.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/elira.git
   cd elira
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and configure your environment variables.

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper types for all data structures
- Avoid `any` types unless absolutely necessary

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Write self-documenting code

### Git Workflow
- Create feature branches from `main`
- Use descriptive commit messages
- Keep commits focused and atomic
- Squash commits before merging

## Testing
- Write tests for new features
- Ensure all tests pass before submitting PR
- Test across different browsers and devices

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if necessary
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit PR with clear description

## Reporting Issues

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
- Screenshots if applicable

Thank you for contributing to Elira!