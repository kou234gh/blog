# Personal Blog & Portfolio

エンジニアとしての技術ブログ、ポートフォリオ、製品紹介を掲載する個人サイトです。

## 🎯 目的

- **技術ブログ**: 学んだ技術や開発の知見を記事として公開
- **ポートフォリオ**: スキルセットやプロジェクト経験の紹介
- **製品紹介**: 個人開発したツールやサービスの紹介
- **収益化**: アフィリエイトや広告、将来的な有料コンテンツ販売の基盤

## 🛠 Tech Stack

| Category     | Technology                   | Deploy Target        | Why?                          |
| :----------- | :--------------------------- | :------------------- | :---------------------------- |
| **Frontend** | **React Router v7**          | **Cloudflare Pages** | モダンなSSR対応フレームワーク |
| **Backend**  | **Payload CMS**              | **Google Cloud Run** | 記事管理のためのHeadless CMS  |
| **Database** | **PostgreSQL**               | **Google Cloud SQL** | リレーショナルデータベース    |
| **UI**       | **Tailwind CSS + Shadcn/ui** | -                    | 素早く美しいUIを構築          |

## 📂 プロジェクト構成 (Monorepo)

```text
blog/
├── apps/
│   ├── web/                 # Frontend (React Router v7)
│   │   ├── app/
│   │   │   ├── routes/      # ページコンポーネント
│   │   │   ├── components/  # 共通コンポーネント
│   │   │   └── lib/         # ユーティリティ関数・API Client
│   │   ├── public/          # 静的ファイル
│   │   └── package.json
│   │
│   └── cms/                 # Backend (Payload CMS)
│       ├── src/
│       │   ├── app/         # Next.js App Router
│       │   └── payload.config.ts
│       ├── docker-compose.yml
│       ├── Dockerfile
│       └── package.json
│
├── docs/                    # 技術ドキュメント
├── .github/
│   └── workflows/
│       └── deploy-cms.yml   # CMS自動デプロイ設定
└── package.json             # モノレポルート設定
```

## 🚀 開発

### 初回セットアップ

```bash
# 依存関係のインストール
npm install

# apps/web と apps/cms の環境変数を設定
cp apps/web/.env.example apps/web/.env
cp apps/cms/.env.example apps/cms/.env

# CMSのデータベースを起動
cd apps/cms
docker-compose up -d
cd ../..
```

### 開発サーバー起動

```bash
# Frontend と Backend を同時起動
npm run dev

# または個別に起動
npm run dev:web   # Frontend のみ (http://localhost:5173)
npm run dev:cms   # CMS のみ (http://localhost:3000)
```

### アクセス先

- **Frontend**: <http://localhost:5173>
- **CMS Admin**: <http://localhost:3000/admin>
- **CMS API**: <http://localhost:3000/api>

### ビルド

```bash
# すべてをビルド
npm run build

# 個別にビルド
npm run build:web
npm run build:cms
```

### デプロイ

```bash
# Frontend を Cloudflare Pages にデプロイ
npm run deploy:web

# Backend は GitHub Actions で自動デプロイ
# (apps/cms/ 配下の変更を main にpushすると自動実行)
```

## 📖 詳細ドキュメント

- [アーキテクチャ設計](docs/ARCHITECTURE.md)
- [技術スタック選定理由](docs/TECH_STACK.md)
- [開発ガイド](docs/DEVELOPMENT.md)
- [Payload CMS 導入ガイド](docs/blog/index.md)
- [GitHub Actions セットアップ](docs/GITHUB_ACTIONS_SETUP.md)

## 🔧 環境変数

### Frontend (`apps/web/.env`)

```bash
VITE_API_URL=http://localhost:3000  # 開発環境
# VITE_API_URL=https://your-cms.a.run.app  # 本番環境
```

### Backend (`apps/cms/.env`)

```bash
DATABASE_URI=postgresql://payload:payload@localhost:5432/payload
PAYLOAD_SECRET=your-secret-key-change-this
NODE_ENV=development
```
