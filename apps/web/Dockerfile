FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

# Copy workspace configuration and lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/rust-data/package.json ./packages/rust-data/
COPY packages/tsconfig/package.json ./packages/tsconfig/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web
COPY packages ./packages

# Build Next.js app
RUN pnpm --filter "@obt/web..." build

# ── Runner Stage ──────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# standalone output contains server.js at its root
# In a monorepo, it is output to apps/web/.next/standalone/
# Copying it to WORKDIR (/app) puts server.js at /app/server.js
COPY --from=builder /app/apps/web/.next/standalone ./

# Static assets must be at /app/.next/static (same level as server.js)
COPY --from=builder /app/apps/web/.next/static ./.next/static

# Public assets must be at /app/public
COPY --from=builder /app/apps/web/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
