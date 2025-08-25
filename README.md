# VSU OBE Management & Monitoring System

A comprehensive Outcomes-Based Education (OBE) management and monitoring system for Visayas State University. Built with Next.js, TypeScript, and modern React patterns to streamline curriculum development, program proposal management, and educational assessment processes.

## 🚀 Features

• **Multi-Role Authentication**: Separate dashboards for Admin, Dean, Department, Faculty, and Committee members

• **Program Proposal Management**: Complete workflow for creating, reviewing, and approving academic programs

• **Course Outcome Management**: Comprehensive ABCD model implementation with CPA classifications

• **Program Outcome Mapping**: Advanced CO-PO mapping system with IED (Introduce, Enable, Demonstrate) levels

• **Assessment Planning**: Teaching, Learning & Assessment (TLA) task management with weighted grading

• **Curriculum Templates**: Predefined program structures with customizable year/semester configurations

• **Real-time Collaboration**: Multi-step wizard forms with state persistence and revision tracking

• **Responsive Design**: Mobile-first approach optimized for all devices

• **Modern UI/UX**: Clean interface with shadcn/ui components and Tailwind CSS

## 🛠️ Tech Stack

• **Frontend**: Next.js 15 (App Router), React 19, TypeScript

• **Styling**: Tailwind CSS, PostCSS, shadcn/ui components

• **State Management**: Zustand with persistence

• **Data Fetching**: TanStack React Query (React Query v5)

• **Forms**: React Hook Form with Zod validation

• **Authentication**: NextAuth.js

• **Icons**: Lucide React

• **HTTP Client**: Axios

• **Date Handling**: date-fns, moment.js

• **Development**: ESLint, Turbopack

## 📋 Prerequisites

• [Node.js](https://nodejs.org/) (version 18+)

• VSU OBE Backend API (Clone the laravel api here: https://github.com/Orekidesu/vsu_obe_backend)

## ⚡ Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Orekidesu/vsu-obe-frontend.git
   cd vsu-obe-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy environment file and configure
   cp .env.example .env.local
   # Update API_URL and other environment variables
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser at `http://localhost:3000`**

## 📁 Project Structure

```
vsu-obe-frontend/
├── public/                     # Static assets and icons
│   ├── assets/
│   │   ├── icons/             # SVG icons and UI assets
│   │   └── images/            # VSU branding and visual assets
│   └── favicon files...
├── src/
│   ├── app/                   # Next.js App Router structure
│   │   ├── (authenticated)/   # Protected routes
│   │   │   ├── admin/         # Administrator dashboard
│   │   │   ├── dean/          # Dean management interface
│   │   │   ├── department/    # Department program management
│   │   │   └── faculty/       # Faculty member dashboard
│   │   ├── (unauthenticated)/ # Public routes
│   │   ├── api/               # API routes and authentication
│   │   │   ├── admin/         # Admin API endpoints
│   │   │   └── auth/          # NextAuth configuration
│   │   └── utils/             # Route-specific utilities
│   ├── components/            # React components
│   │   ├── admin-components/  # Admin-specific UI components
│   │   ├── committee-components/ # Committee workflow components
│   │   ├── dean-components/   # Dean review and approval components
│   │   ├── department-components/ # Program proposal components
│   │   ├── authentication/    # Login and auth components
│   │   ├── commons/           # Shared components
│   │   ├── navigation/        # Navigation and sidebar components
│   │   ├── section/           # Layout section components
│   │   └── ui/                # shadcn/ui base components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useApi.ts          # API interaction hooks
│   │   ├── useAuth.ts         # Authentication hooks
│   │   └── role-specific/     # Hooks for each user role
│   ├── lib/                   # Utility libraries
│   │   ├── reactQueryClient.ts # React Query configuration
│   │   └── utils.ts           # General utilities (cn, clsx)
│   ├── store/                 # Zustand state management
│   │   ├── wizard-store.ts    # Program proposal wizard state
│   │   ├── course/            # Course-related state stores
│   │   ├── program/           # Program management stores
│   │   └── revision/          # Course revision workflow stores
│   └── types/                 # TypeScript type definitions
│       ├── model/             # Data model interfaces
│       └── response/          # API response types
├── components.json            # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

### Key Directories Explained

• `src/app/(authenticated)/` - Role-based protected routes with separate dashboards for each user type

• `src/components/[role]-components/` - Role-specific UI components with specialized workflows

• `src/store/` - Centralized state management with persistence for form data and user sessions

• `src/hooks/` - Custom hooks for API calls, authentication, and shared logic across components

• `src/types/` - Comprehensive TypeScript definitions for OBE models and API contracts

## 🔧 Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint code quality checks
```

## 🌐 Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
API_BASE_URL=http://localhost:8000/api/v1

# Application Settings
NEXT_PUBLIC_APP_NAME=VSU OBE Management System
NEXT_PUBLIC_APP_ENV=development

# Authentication Provider Settings
# Add your OAuth provider credentials here
```

## 🎯 Key Features & Workflows

### Program Proposal Workflow

• **Department**: Create comprehensive program proposals with curriculum mapping

• **Committee**: Review course outcomes, ABCD models, and PO mappings

• **Dean**: Final approval with detailed program and course analysis

### OBE Implementation

• **Course Outcomes (COs)**: ABCD model implementation with CPA domain classification

• **Program Outcomes (POs)**: Comprehensive mapping with contribution levels (I-E-D)

• **Assessment Planning**: TLA task management with weighted assessment tools

• **Curriculum Mapping**: Year/semester organization with course categorization

### User Role Management

• **Admin**: System-wide configuration and user management

• **Dean**: Program approval and institutional oversight

• **Department**: Program proposal creation and curriculum development

• **Faculty**: Course outcome development and assessment planning

• **Committee**: Peer review and quality assurance processes

## 🔧 IDE Setup

**Recommended**: [VSCode](https://code.visualstudio.com/) with the following extensions:
• [TypeScript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

• [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

• [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

## 📱 Browser Support

• Chrome (latest)

• Firefox (latest)

• Safari (latest)

• Edge (latest)

## 🏗️ Architecture

This application follows modern React patterns with:
• **App Router**: File-system based routing with layout nesting

• **Server Components**: Optimized performance with selective client components

• **State Persistence**: Form data persistence across sessions using Zustand

• **Type Safety**: Full TypeScript coverage with strict type checking

• **Component Composition**: Reusable UI components with variant-based styling

## 🔗 Related Projects

• **VSU OBE Backend API**: Laravel-based API server (separate repository:https://github.com/Orekidesu/vsu_obe_backend)

## 📞 Support

For questions, issues, or contributions, please contact the development team or create an issue in this repository.
