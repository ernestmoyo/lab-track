# LabTrack - Open Source Laboratory Information Management System

**LabTrack** is a modern, open-source LIMS designed to help laboratories of all sizes manage samples, track tests, and streamline workflows. Built with simplicity and extensibility in mind, it works online and offline, making it accessible to labs everywhere.

## The Problem

Laboratories worldwide struggle with:
- **Paper-based tracking** that leads to lost samples, transcription errors, and audit nightmares
- **Expensive commercial LIMS** that lock organizations into proprietary ecosystems
- **Disconnected workflows** where sample registration, testing, and reporting happen in silos
- **Unreliable connectivity** in many regions, making cloud-only solutions impractical

LabTrack solves these problems with a free, modular, offline-capable platform that any lab can adopt and customize.

## Features

- **Sample Management** - Register, track, and search samples with custom metadata
- **Test Workflows** - Define test templates, assign work, and record results
- **Dashboard & Analytics** - Real-time overview of lab activity and turnaround times
- **User Roles & Permissions** - Role-based access control (Admin, Lab Manager, Technician, Viewer)
- **Audit Trail** - Every action is logged for regulatory compliance
- **Offline-First** - Works without internet; syncs when connectivity is restored
- **API-First** - RESTful API for integration with instruments, EHR systems, and other tools
- **Multi-Language** - Internationalization support built in from day one

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express, PostgreSQL |
| **Frontend** | React, Vite, TailwindCSS |
| **Database** | PostgreSQL (production), SQLite (offline/dev) |
| **Containerization** | Docker, Docker Compose |
| **Testing** | Jest (backend), Vitest (frontend) |
| **API Docs** | OpenAPI / Swagger |

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ (or use Docker)
- Git

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/ernestmoyo/lab-track.git
cd lab-track
cp .env.example .env
docker compose up
```

The app will be available at `http://localhost:3000` with the API at `http://localhost:5000/api`.

### Option 2: Manual Setup

```bash
# Clone the repo
git clone https://github.com/ernestmoyo/lab-track.git
cd lab-track

# Setup backend
cd server
cp .env.example .env
npm install
npm run db:migrate
npm run dev

# In a new terminal, setup frontend
cd client
npm install
npm run dev
```

### Default Credentials
- **Admin**: admin@labtrack.local / labtrack-admin
- **Technician**: tech@labtrack.local / labtrack-tech

> Change these immediately in production!

## Project Structure

```
lab-track/
├── server/                  # Backend API
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── models/          # Database models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Shared utilities
│   │   └── validators/      # Input validation schemas
│   └── tests/               # Backend tests
├── client/                  # Frontend SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API client
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context providers
│   │   └── utils/           # Frontend utilities
│   └── public/              # Static assets
├── docs/                    # Additional documentation
├── docker-compose.yml       # Container orchestration
└── .github/                 # CI/CD and issue templates
```

## Contributing

We welcome contributions from everyone! Whether you're a developer, designer, translator, lab scientist, or documentation writer, there's a place for you here.

### Ways to Contribute
- **Code** - Fix bugs, add features, improve performance
- **Documentation** - Improve guides, write tutorials, translate docs
- **Testing** - Report bugs, write tests, try the app in your lab
- **Design** - Improve UI/UX, create icons, design workflows
- **Translation** - Help make LabTrack accessible in more languages
- **Domain Knowledge** - Share how your lab works to improve features

### Getting Started
1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
2. Check [Good First Issues](https://github.com/ernestmoyo/lab-track/labels/good%20first%20issue) for beginner-friendly tasks
3. Join discussions in [Issues](https://github.com/ernestmoyo/lab-track/issues)

See our [Code of Conduct](CODE_OF_CONDUCT.md) for community standards.

## Roadmap

### Phase 1 - Foundation (Current)
- [x] Project scaffolding and documentation
- [ ] Sample registration and tracking
- [ ] User authentication and authorization
- [ ] Basic dashboard

### Phase 2 - Core Workflows
- [ ] Test templates and result entry
- [ ] Barcode/QR code support
- [ ] Report generation (PDF)
- [ ] Audit trail

### Phase 3 - Advanced Features
- [ ] Offline-first with sync
- [ ] Instrument integration API
- [ ] Multi-language support
- [ ] Advanced analytics

### Phase 4 - Ecosystem
- [ ] Plugin system for custom modules
- [ ] Mobile-responsive progressive web app
- [ ] HL7/FHIR integration for health systems
- [ ] Community module marketplace

## Community

- **Issues**: [GitHub Issues](https://github.com/ernestmoyo/lab-track/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ernestmoyo/lab-track/discussions)
- **Email**: ernestmoyo35@gmail.com

## License

LabTrack is open source under the [MIT License](LICENSE).

---

**Built with care by [Ernest Moyo](https://github.com/ernestmoyo) | [7Square](https://github.com/ernestmoyo)**

If LabTrack helps your lab, consider giving it a star and sharing it with others who might benefit.
