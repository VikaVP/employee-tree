FROM node:18-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm update && npm install

# If you want yarn update and  install uncomment the bellow

# RUN yarn install &&  yarn upgrade
# Update npm | Install pnpm | Set PNPM_HOME | Install global packages
RUN npm i -g npm@latest; \
    # Install pnpm
    npm install -g pnpm; \
    pnpm --version; \
    pnpm setup; \
    mkdir -p /usr/local/share/pnpm &&\
    export PNPM_HOME="/usr/local/share/pnpm" &&\
    export PATH="$PNPM_HOME:$PATH"; \
    pnpm bin -g &&\
    pnpm install --frozen-lockfile;


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=development
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]

