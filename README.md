# Payout Management System

A Vue 3 application for managing member payouts with timeline tracking, multi-wallet support, and comprehensive payout history.

## Features

- **Member Payout Management**: Track and manage individual member payouts
- **Timeline Tracking**: Visual timeline showing payout progression from initiation to completion
- **Multi-Wallet Support**: Support for multiple wallets with different payout schedules
- **Payout History**: Comprehensive history with filtering by date range and wallet
- **Status Management**: Track various payout states (pending, issued, deposited, failed, returned)
- **Error Handling**: Detailed error reporting for failed or returned payouts
- **Responsive Design**: Modern UI with Element Plus components

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/
│   ├── alerts/
│   │   └── ErrorAlert.vue        # Error alert component
│   ├── PayoutDetails.vue          # Main payout details view
│   ├── PayoutHistory.vue         # Member payout history
│   ├── Sidebar.vue               # Navigation sidebar
│   ├── TestStates.vue            # Testing component for different payout states
│   ├── Timeline.vue              # Timeline component
│   ├── TimelineDetailCard.vue   # Timeline step details
│   ├── TimelineStep.vue         # Individual timeline step
│   └── TopBar.vue               # Top navigation bar
├── data/
│   └── payoutData.js            # Data management and generation
├── router/
│   └── index.js                 # Vue Router configuration
├── App.vue                      # Main application component
├── main.js                      # Application entry point
└── style.css                    # Global styles
```

## Technologies Used

- Vue 3 with Composition API
- Vue Router 4
- Element Plus UI Library
- Vite (Build Tool)
- CSS3 (Flexbox, Grid, Modern Layout)
- Modern JavaScript (ES6+)

## Key Components

### PayoutHistory.vue
Displays member payout history with filtering capabilities:
- Date range filtering
- Wallet-specific filtering
- Member account details
- Payout status tracking

### PayoutDetails.vue
Shows detailed payout information:
- Timeline visualization
- Payment breakdown table
- Status management
- Error handling for failed/returned payouts

### Timeline Components
- **Timeline.vue**: Container for timeline steps
- **TimelineStep.vue**: Individual timeline step with status icons
- **TimelineDetailCard.vue**: Detailed information for specific steps

### TestStates.vue
Development/testing component for demonstrating different payout states and transitions.

## Data Management

The application uses a centralized data management system in `payoutData.js` that includes:
- Member management
- Payout account handling
- Wallet configuration
- Payment history generation
- Timeline step generation

## Production Deployment

The application is configured for production deployment with:
- Optimized Vite build configuration
- Element Plus component library
- Responsive design
- Error handling and validation