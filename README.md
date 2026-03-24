# Font License Checker

A clean, minimal web application to look up font licensing information quickly and accurately.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Prisma ORM** + PostgreSQL
- **iron-session** for admin authentication

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL` — your PostgreSQL connection string
- `SESSION_SECRET` — a long random string (min 32 chars). Generate with: `openssl rand -base64 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — initial admin credentials for the seed

### 3. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Seed the database with font data and admin user
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Access

Navigate to `/admin/login` and sign in with the credentials you set in `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

Set strong, unique credentials before running the seed. Never use default or placeholder values in production.

## Pages

| Path | Description |
|---|---|
| `/` | Homepage with search |
| `/font/[slug]` | Font license detail |
| `/search?q=` | Search results |
| `/report` | Report an issue |
| `/about` | About & disclaimer |
| `/admin` | Admin dashboard |
| `/admin/fonts` | Manage font records |
| `/admin/issues` | Review reported issues |
| `/admin/login` | Admin login |

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/fonts/search?q=&limit=5` | Autocomplete search |
| GET | `/api/v1/fonts/[slug]` | Font detail |
| POST | `/api/v1/issues` | Submit issue report |
| POST | `/api/v1/admin/auth/login` | Admin login |
| POST | `/api/v1/admin/auth/logout` | Admin logout |
| GET/POST | `/api/v1/admin/fonts` | List/create fonts |
| GET/PUT/DELETE | `/api/v1/admin/fonts/[id]` | Font detail/update/delete |
| GET | `/api/v1/admin/issues` | List issues |
| POST | `/api/v1/admin/issues/[id]/resolve` | Resolve issue |

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `SESSION_SECRET`
3. Run `npm run build && npm start`
4. Ensure your PostgreSQL instance is accessible

## License

MIT
