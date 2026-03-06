# React Setup

A modern, professional React application built with TypeScript, Vite, and Material UI. This project demonstrates a robust architecture featuring authentication, dashboard management and many more.

## Features

- **Authentication System**: Secure Login, Signup, and Forgot Password flows using JWT.
- **Dashboard & Admin**: Protected routes and role-based views (Dashboard, Admin panel).
- **Routing**: Client-side routing with `react-router`.
- **State Management**: Global state handling with Redux Toolkit.
- **Form Handling**: Robust form validation using React Hook Form and Zod.
- **UI/UX**: Polished interface using Material UI (MUI) and custom animations.
- **Notifications**: Toast notifications for user feedback.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Material UI (MUI)](https://mui.com/) + Emotion
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Code Quality**: ESLint

## Project Structure

```bash
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components and Feature components
├── layouts/        # Layout wrappers (e.g., AuthLayout, AdminLayout)
├── pages/          # Page-level components
├── routes/         # Routing configuration
├── services/       # API services and loaders
├── libs/           # Reusable libraries and types
├── context/        # Global state management
├── store/          # Redux store and slices
└── styles/         # Global styles
```

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/abhishekk75way/react-setup.git
    cd react-setup
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173`.

## Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
