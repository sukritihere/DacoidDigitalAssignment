# Quiz Platform

A modern, interactive quiz application built with React, TypeScript, and Tailwind CSS. This platform offers a seamless quiz-taking experience with features like timed questions, instant feedback, and progress tracking.


## Features

### Core Functionality
- **Interactive Quiz Interface**
  - Multiple choice and numerical answer questions
  - 30-second timer for each question
  - Instant feedback on answers
  - Progress tracking during quiz

### User Experience
- **Responsive Design**
  - Mobile-friendly interface
  - Smooth transitions and animations
  - Dark/Light theme support
  - Accessible navigation

### Progress Tracking
- **Quiz History**
  - Stores attempt history using IndexedDB
  - Displays scores and completion times
  - Tracks individual question responses

### Technical Features
- **Modern Tech Stack**
  - React 18 with TypeScript
  - Tailwind CSS for styling
  - IndexedDB for local storage
  - Vite for fast development

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 7.0 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
quiz-platform/
├── src/
│   ├── components/     # React components
│   ├── data/          # Quiz questions and static data
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions and database operations
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── package.json       # Project dependencies and scripts
```

## Key Components

### Quiz Interface
- Timer-based questions (30 seconds per question)
- Multiple choice and numerical input support
- Instant feedback on answers
- Progress tracking

### Navigation
- Sidebar navigation for desktop
- Responsive mobile menu
- Smooth scrolling between sections

### History Tracking
- Stores quiz attempts locally
- Displays attempt history with scores
- Shows detailed results per question

### Theme Support
- Dark/Light mode toggle
- System preference detection
- Persistent theme selection

## Technical Details

### State Management
- React hooks for local state
- Context for theme management
- IndexedDB for persistent storage

### Styling
- Tailwind CSS for utility-first styling
- Custom animations and transitions
- Responsive design patterns

### Data Storage
- IndexedDB for quiz attempts
- Local storage for theme preference
- Type-safe data handling

## Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Optimized bundle size
- Lazy loading of components
- Efficient state updates
- Smooth animations and transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
