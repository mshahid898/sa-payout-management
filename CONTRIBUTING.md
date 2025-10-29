# Contributing to Payout Management System

Thank you for your interest in contributing to this project!

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mshahid898/sa-payout-management.git
   cd sa-payout-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Code Style

- Use Vue 3 Composition API
- Follow ESLint rules (if configured)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and single-purpose

## Git Commit Messages

Please use clear, descriptive commit messages:

- Use present tense ("Add feature" not "Added feature")
- First line should be a brief summary (50 characters or less)
- Add detailed explanation if needed in the body

Example:
```
Add payout timeline visualization

- Create Timeline component with step indicators
- Add status-based styling for timeline steps
- Implement timeline detail cards for expanded information
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test locally (`npm run build` should succeed)
4. Commit with clear messages
5. Push to your fork
6. Create a pull request with a clear description

## File Structure

- `src/components/` - Vue components
- `src/router/` - Vue Router configuration
- `src/data/` - Data management and mock data
- `src/utils/` - Utility functions
- `public/` - Static assets (icons, images)
- `dist/` - Production build output (gitignored)

## Questions?

Feel free to open an issue for questions or suggestions.

