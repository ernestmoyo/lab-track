# LabTrack Architecture

## Overview

LabTrack follows a standard three-tier architecture with a clear separation between the frontend SPA, backend API, and database layer.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend   │────▶│   Backend   │────▶│  PostgreSQL  │
│  React SPA   │◀────│ Express API │◀────│  Database    │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Backend Architecture

The backend follows a layered pattern:

```
Routes → Controllers/Middleware → Services → Database
```

- **Routes**: Define API endpoints and wire up middleware
- **Middleware**: Handle cross-cutting concerns (auth, validation, errors)
- **Services**: Contain business logic, decoupled from HTTP
- **Config/Database**: Database connection and migration management

### Key Design Decisions

1. **PostgreSQL with raw SQL**: Using `pg` directly instead of an ORM keeps the stack simple and gives full control over queries. Migrations are plain SQL.

2. **JWT Authentication**: Stateless auth with JWTs allows horizontal scaling. Tokens are short-lived (24h).

3. **Role-Based Access Control**: Four roles (admin, lab_manager, technician, viewer) enforced at the route level.

4. **Audit Trail**: Every create/update/delete on samples and tests is logged to the `audit_log` table.

5. **JSONB for Metadata**: Samples and test results use JSONB columns for flexible, schema-less data.

## Frontend Architecture

```
Pages → Components → Services/API → Context
```

- **Pages**: Top-level route components
- **Components**: Reusable UI pieces
- **Services**: API client module
- **Context**: Auth state management via React Context

### Key Design Decisions

1. **Vite + React**: Fast dev server, modern build tooling
2. **TailwindCSS**: Utility-first styling, no custom CSS overhead
3. **React Router**: Client-side routing with protected routes
4. **Fetch API**: No HTTP client library needed

## Data Model

```
users ──┐
        ├── samples ──── tests
        │       │            │
        └───────┴── audit_log┘
```

- A **user** can register many **samples**
- A **sample** can have many **tests**
- All mutations are recorded in **audit_log**

## Future Considerations

- **Offline-first**: Service Workers + IndexedDB for offline data, sync queue
- **Plugin system**: Dynamic module loading for custom lab workflows
- **Instrument integration**: Webhook/API endpoints for lab instruments to push results
