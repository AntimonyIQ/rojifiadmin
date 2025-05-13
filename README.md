# Rojifi Admin Dashboard

A comprehensive admin dashboard for fintech operations built with React, TypeScript, and Tailwind CSS.

![Rojifi Admin Dashboard](generated-icon.png)

## Features

- **User Management**: View and manage user accounts
- **Transaction Monitoring**: Track and analyze financial transactions
- **Multi-Currency Support**: Handle NGN, USD, EUR, GBP, KES currencies
- **Staff Management**: Control roles and permissions
- **System Settings**: Configure payment processors, fees, and more
- **Messaging**: Send and track notifications to users
- **Modern UI**: Responsive design with dark/light mode support

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **State Management**: React Query, Zustand
- **Form Handling**: React Hook Form, Zod
- **Styling**: Tailwind CSS, CSS Modules

## Getting Started

### Prerequisites

- Node.js 20.x or later
- NPM 10.x or later

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/rojifi-admin-dashboard.git
   cd rojifi-admin-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Deployment

### Deploying to Vercel

This project is optimized for Vercel deployment:

1. Push your code to a GitHub repository
2. Create a new project on [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Use the following settings:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
5. Deploy

## Project Structure

```
rojifi-admin-dashboard/
├── api/                  # Serverless API functions for Vercel
├── client/               # Frontend React application
│   ├── src/              # Source code
│   │   ├── app/          # Route components
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   ├── services/     # API service functions
│   │   └── types/        # TypeScript type definitions
├── server/               # Express server code
│   ├── index.ts          # Server entry point
│   └── routes.ts         # API route definitions
└── shared/               # Shared code between client and server
    └── schema.ts         # Database schema and types
```

## Authentication

The dashboard uses a simple authentication system:

- Login with any email and password (development mode)
- Role-based access control for different dashboard sections

## Customization

### Themes

The application supports both light and dark modes. You can customize the theme colors in `tailwind.config.ts`.

### Adding New Features

1. Create new page components in `client/src/app/`
2. Add route entries in `client/src/App.tsx`
3. Create API endpoints in `server/routes.ts`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Designed and developed for Rojifi
- Built with [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)