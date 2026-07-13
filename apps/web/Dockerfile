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
RUN pnpm --filter "@obt/web" build

# Debug: show what standalone contains
RUN echo "=== standalone root ===" && ls -la /app/apps/web/.next/standalone/ && \
    echo "=== standalone node_modules/next ===" && ls /app/apps/web/.next/standalone/node_modules/next 2>/dev/null || echo "next not found in standalone/node_modules"

# ── Runner Stage ──────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# outputFileTracingRoot=monorepo root means standalone output mirrors the monorepo structure
# server.js is at standalone root, but node_modules trace from monorepo root
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
