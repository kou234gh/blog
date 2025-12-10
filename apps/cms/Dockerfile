# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# Monorepo対応版: apps/cms をCloud Runにデプロイするための設定

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

# モノレポのルートディレクトリに移動
WORKDIR /monorepo

# pnpm を有効化
RUN corepack enable && corepack prepare pnpm@latest --activate

# モノレポのルート設定ファイルをコピー
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# apps/cms の package.json をコピー
COPY apps/cms/package.json ./apps/cms/

# 依存関係をインストール（apps/cms のみ）
RUN pnpm install --filter cms --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /monorepo

# pnpm を有効化
RUN corepack enable && corepack prepare pnpm@latest --activate

# 依存関係をコピー
COPY --from=deps /monorepo/node_modules ./node_modules
COPY --from=deps /monorepo/apps/cms/node_modules ./apps/cms/node_modules

# モノレポのルート設定ファイルをコピー
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# apps/cms のソースコードをコピー
COPY apps/cms ./apps/cms

# Next.js テレメトリを無効化
ENV NEXT_TELEMETRY_DISABLED=1

# ビルド実行（apps/cms ディレクトリで）
WORKDIR /monorepo/apps/cms
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# public フォルダをコピー（存在する場合）
COPY --from=builder --chown=nextjs:nodejs /monorepo/apps/cms/public ./public

# standalone出力をコピー
COPY --from=builder --chown=nextjs:nodejs /monorepo/apps/cms/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /monorepo/apps/cms/.next/static ./.next/static

USER nextjs

# Cloud RunのデフォルトポートはPORT環境変数で指定される
EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
CMD ["node", "apps/cms/server.js"]
