FROM node:20-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy workspace configuration and lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/bot/package.json ./apps/bot/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/rust-data/package.json ./packages/rust-data/
COPY packages/tsconfig/package.json ./packages/tsconfig/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/bot ./apps/bot
COPY packages ./packages

# Generate Prisma Client
RUN apk add --no-cache openssl
RUN cd apps/bot && pnpm run prisma:generate

# Build the bot using turborepo or tsc
RUN pnpm --filter @obt/bot build

EXPOSE 3001

CMD ["sh", "-c", "cd apps/bot && pnpm prisma:deploy && cd ../.. && pnpm --filter @obt/bot start"]
