# Ship Inventory Management System

## Overview

A professional web-based inventory management system designed for ship operations. The application helps maritime crews track ship stores, provisions, spare parts, and supplies onboard vessels. It features a maritime-inspired design optimized for tablet use in bright onboard conditions, with comprehensive stock tracking, low-stock alerts, order management with chandler bidding, and invoice tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using a single-page application (SPA) architecture with client-side routing via Wouter.

**UI Component Library**: Radix UI primitives with custom shadcn/ui components following the "New York" style variant. All components are built with TypeScript and use Tailwind CSS for styling.

**State Management**: TanStack Query (React Query) handles server state with aggressive caching (staleTime: Infinity) to minimize unnecessary refetches. No global client state management library - component state and React Query cover all needs.

**Styling Approach**: Tailwind CSS utility-first with a custom maritime theme. Light mode only (no dark mode) due to bright onboard vessel conditions. Custom CSS variables define the color system with navy blue primary colors, ocean blue accents, and status-based color coding (green for success, amber for warnings, red for critical alerts).

**Design System**: Material Design principles adapted for data-dense maritime applications. Uses Inter font family from Google Fonts with tabular numbers for data alignment. Spacing follows Tailwind's standard scale (2, 4, 6, 8, 12, 16).

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js in ESM mode.

**API Design**: RESTful API with conventional HTTP methods (GET, POST, PATCH, DELETE) at `/api/*` endpoints. All requests/responses use JSON. Error handling middleware provides consistent error responses with status codes and messages.

**Request Logging**: Custom middleware logs API requests with timing information, truncating long response bodies to 80 characters for readability.

**Session Management**: Express sessions backed by PostgreSQL using connect-pg-simple for persistent session storage across server restarts.

**Validation**: Zod schemas validate all incoming data, with schema definitions shared between client and server via the `@shared` directory.

### Data Storage

**Database**: PostgreSQL accessed via Neon's serverless driver with WebSocket support for edge deployment compatibility.

**ORM**: Drizzle ORM provides type-safe database queries with zero-cost abstractions. Schema definitions in TypeScript generate both runtime validation (via drizzle-zod) and database migrations.

**Schema Design**:
- **Users**: Authentication with bcrypt-hashed passwords, role-based access (captain, chief officer, staff)
- **Items**: Core inventory with categories (Engine Store, Deck Store, Provision Store), stock levels, minimum thresholds, and locations
- **Transactions**: Audit trail of all stock movements (in/out) with timestamps and remarks
- **Chandlers**: Supplier directory with contact information and ratings
- **Orders**: Purchase orders with multi-chandler bidding workflow
- **OrderItems**: Line items for each order
- **Bids**: Chandler quotes on orders with item-level pricing
- **BidItems**: Individual line items within bids
- **Invoices**: Financial records linked to approved orders

**Relationships**: All foreign keys use CASCADE deletion where appropriate (e.g., deleting an item removes its transaction history). UUID primary keys generated via PostgreSQL's `gen_random_uuid()`.

**Migration Strategy**: Drizzle Kit manages schema migrations with push-based deployment (`db:push` script).

### Authentication & Authorization

**Authentication**: Username/password-based with bcrypt password hashing (10 salt rounds). Sessions persist in PostgreSQL.

**Authorization**: Role-based access control with three tiers:
- Staff: Basic inventory operations
- Chief Officer: Order creation and management
- Captain: Full administrative access including user management

User context available via session data on all authenticated routes.

### External Dependencies

**Third-Party Services**:
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support
- **Google Fonts CDN**: Inter font family delivery

**Key NPM Packages**:
- **@neondatabase/serverless**: PostgreSQL client with WebSocket pooling
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **bcryptjs**: Password hashing
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight client-side routing
- **date-fns**: Date formatting and manipulation
- **zod**: Runtime type validation and schema definition
- **@radix-ui/***: Headless UI primitives for accessible components
- **tailwindcss**: Utility-first CSS framework

**Development Tools**:
- **Vite**: Frontend build tool and dev server with HMR
- **esbuild**: Backend bundling for production
- **tsx**: TypeScript execution for development server
- **drizzle-kit**: Database migration tooling

**Replit-Specific Integrations**:
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Code navigation
- `@replit/vite-plugin-dev-banner`: Development environment indicator

### Build & Deployment

**Development**: `npm run dev` starts both frontend (Vite dev server) and backend (Express with tsx) in a single process using Vite middleware mode. Hot module replacement enabled for instant feedback.

**Production Build**: Two-stage process:
1. `vite build` compiles React frontend to `dist/public`
2. `esbuild` bundles Express server to `dist/index.js` with external packages

**Production Server**: `npm start` serves the built application with static file serving for the compiled frontend.

**Type Checking**: `npm run check` runs TypeScript compiler in noEmit mode to validate types without building.

### Code Organization

**Monorepo Structure**:
- `/client`: React frontend with pages, components, hooks, and styles
- `/server`: Express backend with routes, database layer, and utilities  
- `/shared`: TypeScript types and Zod schemas used by both client and server
- `/migrations`: Drizzle-generated SQL migration files

**Import Aliases**:
- `@/*`: Client source files
- `@shared/*`: Shared types and schemas
- `@assets/*`: Static assets

**Component Organization**: UI components in `/client/src/components/ui` (shadcn), business components in `/client/src/components`, page components in `/client/src/pages`.