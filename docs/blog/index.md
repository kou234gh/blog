# Payload CMS 導入ガイド

このプロジェクトに Payload CMS を導入し、モノレポ構成に移行する手順を解説します。

---

## 1. 全体の仕組み（ここが一番重要）

Cloudflare Pages は「静的ファイル」や「エッジ関数」を動かす場所で、**Docker コンテナを動かす場所ではありません。**

ですので、以下のように住み分けます。

1. **Frontend (`apps/web`)**
   - **技術:** React Router v7
   - **デプロイ先:** **Cloudflare Pages**
   - **仕組み:** ビルドしてできたファイルが世界中に配信される。
2. **Backend (`apps/cms`)**
   - **技術:** Payload CMS (Docker)
   - **デプロイ先:** **Google Cloud Run** (または AWS App Runner、Railway 等)
   - **仕組み:** Docker コンテナとして起動し、API サーバーとして待ち受ける。

Frontend（Cloudflare）は、インターネット越しに Backend（Cloud Run）の API を叩いてデータを取得します。

---

## 2. フォルダ構成 (Monorepo への移行)

現在の単一プロジェクト構成から、`pnpm workspaces` を使ったモノレポに移行します。

**移行後の構成:**

```text
blog/
├── package.json           # 全体を管理 (workspaces設定)
├── apps/
│   ├── web/               # 既存のReact Router v7プロジェクト
│   │   ├── app/           # ソースコード
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── ...
│   │
│   └── cms/               # 新規: Payload CMSプロジェクト
│       ├── src/           # CMS設定
│       ├── Dockerfile     # Cloud Run用の設定
│       ├── package.json
│       └── ...
├── docs/                  # 技術ドキュメント（既存）
├── public/                # 静的ファイル（既存から移動）
└── node_modules/
```

---

## 3. 移行手順

### Step 1: 既存プロジェクトのバックアップ

```bash
# 現在の状態をコミットしておく
git add .
git commit -m "feat: モノレポ移行前のバックアップ"
```

### Step 2: ルートの `package.json` をモノレポ対応に変更

既存の `package.json` を以下のように修正します:

```json
{
  "name": "blog",
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "dev": "concurrently \"pnpm run dev --workspace=apps/web\" \"pnpm run dev --workspace=apps/cms\"",
    "dev:web": "pnpm run dev --workspace=apps/web",
    "dev:cms": "pnpm run dev --workspace=apps/cms",
    "build": "pnpm run build --workspaces",
    "build:web": "pnpm run build --workspace=apps/web",
    "build:cms": "pnpm run build --workspace=apps/cms",
    "deploy:web": "pnpm run deploy --workspace=apps/web"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

**重要:** `concurrently` を使うと、`pnpm run dev` 一発で Web と CMS の両方をローカルで同時に立ち上げられます。

### Step 3: 既存プロジェクトを `apps/web` に移動

```bash
# apps ディレクトリを作成
mkdir -p apps/web

# 既存のファイルを移動（Git履歴を保持）
git mv app apps/web/
git mv public apps/web/
git mv build apps/web/
git mv workers apps/web/
git mv vite.config.ts apps/web/
git mv tsconfig.json apps/web/
git mv tsconfig.cloudflare.json apps/web/
git mv tsconfig.node.json apps/web/
git mv react-router.config.ts apps/web/
git mv wrangler.jsonc apps/web/
git mv worker-configuration.d.ts apps/web/
git mv components.json apps/web/

# package.json を apps/web にコピー（後で調整）
cp package.json apps/web/package.json
```

### Step 4: `apps/web/package.json` を調整

`apps/web/package.json` を開き、`name` を変更します:

```json
{
  "name": "@blog/web",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "react-router build",
    "cf-typegen": "wrangler types",
    "deploy": "pnpm run build && wrangler deploy",
    "dev": "react-router dev",
    "postinstall": "pnpm run cf-typegen",
    "preview": "pnpm run build && vite preview",
    "typecheck": "pnpm run cf-typegen && react-router typegen && tsc -b"
  },
  "dependencies": {
    // ... 既存の依存関係をそのまま
  },
  "devDependencies": {
    // ... 既存の依存関係をそのまま
  }
}
```

### Step 5: Payload CMS プロジェクトを作成

```bash
# apps/cms ディレクトリで Payload を初期化
cd apps
npx create-payload-app@latest cms
```

初期化時の選択肢:

- **Template**: `blank` (シンプルなスタート)
- **Database**: `MongoDB` または `PostgreSQL` (おすすめ: PostgreSQL)
- **Install dependencies**: `Yes`

### 【修正版】Step 6: Payload で Markdown を自動生成する設定

`apps/cms` ディレクトリでの作業です。

#### 1. 必要なライブラリを追加

Lexical エディタのデータを裏側で変換するためのライブラリをインストールします。

```bash
cd apps/cms
pnpm add @lexical/headless @lexical/markdown
```

#### 2. コレクション定義の作成 (`src/collections/Posts.ts`)

記事（Posts）の定義ファイルを作成（または編集）します。
ここで **`hooks`** を使い、保存時に Markdown へ変換する処理を実装します。

```typescript
import { CollectionConfig } from "payload/types";
import { createHeadlessEditor } from "@lexical/headless";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    // 1. 人間が編集するフィールド (Lexical Editor)
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({}),
      required: true,
    },
    // 2. 自動生成されるMarkdown用フィールド (管理画面では読取専用)
    {
      name: "markdown",
      type: "textarea",
      admin: {
        readOnly: true,
        position: "sidebar", // サイドバーに配置して邪魔にならないようにする
        description: "保存時に自動生成されたMarkdownがここに表示されます",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // content (JSON) が存在する場合のみ実行
        if (data.content) {
          try {
            // ヘッドレスエディタ（画面のないエディタ）を初期化
            const headlessEditor = createHeadlessEditor({
              nodes: [], // カスタムノードがある場合はここに追加
              onError: (error) => {
                throw error;
              },
            });

            // 現在のJSONデータをエディタにセット
            headlessEditor.setEditorState(
              headlessEditor.parseEditorState(data.content)
            );

            // Markdownに変換して 'markdown' フィールドに保存
            headlessEditor.getEditorState().read(() => {
              // ここで提示されたライブラリを使用して正確に変換
              const markdownOutput = $convertToMarkdownString(TRANSFORMERS);
              data.markdown = markdownOutput;
            });
          } catch (e) {
            console.error("Markdown変換に失敗しました:", e);
            // エラー時も保存自体は止めない（必要に応じて throw e してください）
          }
        }
        return data;
      },
    ],
  },
};
```

#### 3. 設定ファイルへの登録 (`src/payload.config.ts`)

作成した `Posts` コレクションを登録します。

```typescript
import { buildConfig } from "payload/config";
import { mongooseAdapter } from "@payloadcms/db-mongodb"; // または postgresAdapter
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";

// 作成したコレクションをインポート
import { Posts } from "./collections/Posts";

export default buildConfig({
  // ...他の設定
  collections: [
    Posts, // ここに追加
    // Users, Media など
  ],
  editor: lexicalEditor({}),
  // ...
});
```

---

### 補足：画像の扱いについて（重要）

Markdown (`![alt](url)`) としてきれいに出力するためには、画像の URL が永続的である必要があります。Docker コンテナ内に画像を保存すると消えてしまうため、以下の追加設定を推奨します。

1.  **Payload Cloud Storage Plugin** をインストール。
2.  AWS S3 (または Cloudflare R2, Google Cloud Storage) に画像を保存するように設定。

これにより、生成される Markdown は `![image](https://my-bucket.s3.amazonaws.com/image.jpg)` のようになり、どこに移行しても画像が表示される状態になります。

### Step 7: Frontend (`apps/web`) と CMS の連携設定

React Router 側から、CMS の API を叩いてデータを取得します。

#### 開発環境の設定

`apps/web/.env` ファイルを作成:

```bash
# ローカルで立ち上がっているCMSを参照
VITE_API_URL=http://localhost:3000
```

#### 本番環境の設定

Cloudflare Pages の管理画面で環境変数を設定:

```bash
# Google Cloud RunのURLを指定
VITE_API_URL=https://your-cms-service-xyz.a.run.app
```

#### API 呼び出しの実装例

`apps/web/app/lib/api.ts` を作成:

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * ブログ記事一覧を取得
 */
export async function fetchBlogPosts() {
  const response = await fetch(`${API_URL}/api/posts`);
  if (!response.ok) {
    throw new Error("記事の取得に失敗しました");
  }
  return response.json();
}

/**
 * 特定のブログ記事を取得
 */
export async function fetchBlogPost(slug: string) {
  const response = await fetch(
    `${API_URL}/api/posts?where[slug][equals]=${slug}`
  );
  if (!response.ok) {
    throw new Error("記事の取得に失敗しました");
  }
  return response.json();
}
```

---

## 4. デプロイ設定

モノレポですが、デプロイのトリガーはそれぞれ別々に設定します。

### A. Cloudflare Pages へのデプロイ (`apps/web`)

Cloudflare のダッシュボードでプロジェクト設定を変更します。

**ビルド設定:**

- **Build command:** `pnpm run build:web`
- **Build output directory:** `apps/web/build/client`
- **Root directory:** `/` (リポジトリルート)
- **Install command:** `pnpm install`

**重要:** モノレポ構成なので、Root directory は `/` のままにし、build command でワークスペースを指定します。

**環境変数:**

- `VITE_API_URL`: `https://your-cms-service.a.run.app`

### B. Google Cloud Run へのデプロイ (`apps/cms`)

GitHub Actions を使って自動デプロイします。

`.github/workflows/deploy-cms.yml` を作成:

```yaml
name: Deploy CMS to Cloud Run

on:
  push:
    branches:
      - main
    paths:
      - "apps/cms/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Build and Push Docker Image
        run: |
          cd apps/cms
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/blog-cms

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy blog-cms \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/blog-cms \
            --platform managed \
            --region asia-northeast1 \
            --allow-unauthenticated
```

**必要な設定:**

- GitHub Secrets に `GCP_SA_KEY` (サービスアカウントキー) を登録
- GitHub Secrets に `GCP_PROJECT_ID` を登録

### C. Dockerfile の作成 (`apps/cms/Dockerfile`)

```dockerfile
FROM node:20-alpine AS base

# 依存関係のインストール
FROM base AS dependencies
WORKDIR /app
COPY package*.json ./
RUN pnpm ci

# ビルド
FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# 本番環境
FROM base AS production
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/build ./build
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "run", "serve"]
```

---

## 5. データベース設定

### PostgreSQL (推奨)

**開発環境:**

Docker Compose を使ってローカルで PostgreSQL を立ち上げます。

`apps/cms/docker-compose.yml`:

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: payload
      POSTGRES_PASSWORD: payload
      POSTGRES_DB: payload
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

`apps/cms/.env`:

```bash
DATABASE_URI=postgresql://payload:payload@localhost:5432/payload
PAYLOAD_SECRET=your-secret-key-change-this
```

**本番環境:**

Google Cloud SQL または他のマネージド PostgreSQL を使用します。

---

## 6. 開発の流れ

### ローカル開発

```bash
# ルートディレクトリから
pnpm install

# CMS用のデータベースを起動
cd apps/cms
docker-compose up -d

# 両方同時に起動
cd ../..
pnpm run dev
```

これで以下が起動します:

- **Frontend:** http://localhost:5173
- **CMS Admin:** http://localhost:3000/admin
- **CMS API:** http://localhost:3000/api

### 記事の作成

1. http://localhost:3000/admin にアクセス
2. 初回起動時は管理者アカウントを作成
3. `Posts` コレクションから新規記事を作成
4. Frontend 側から `http://localhost:3000/api/posts` でデータを取得

---

## まとめ

### アーキテクチャのポイント

1. **モノレポ構成:** `apps/web` (Frontend) と `apps/cms` (Backend) に分離
2. **デプロイ先の分離:**
   - Frontend: Cloudflare Pages (エッジ配信)
   - Backend: Google Cloud Run (API サーバー)
3. **スケーラビリティ:** Frontend と backend が独立しているため、一方に負荷がかかっても影響を受けにくい
4. **開発効率:** モノレポで管理することで、コード共有と同期がしやすい

### この構成の利点

- **パフォーマンス:** Cloudflare Pages で世界中に高速配信
- **コスト効率:** 両方とも無料枠から始められる
- **保守性:** Frontend/Backend が疎結合で、それぞれ独立して更新可能
- **型安全性:** TypeScript で一貫した開発体験

この構成なら、Web サイト（Cloudflare）がどれだけアクセス集中しても、CMS（API）側が落ちたり遅くなったりする影響を最小限に抑えられます。エンジニアリング的に非常に堅牢な設計です。
