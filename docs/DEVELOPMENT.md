# Development & Security Guide

ローカル開発環境のセットアップと、Publicリポジトリにおけるセキュリティ運用ルールについて。

## 🛠 Local Setup

### Prerequisites

- Node.js (v20+)
- Docker (for local DB testing)
- pnpm or npm

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install dependencies (Root)
npm install
```

````

### Environment Variables (.env)

**⚠️ 重要: `.env` ファイルは `.gitignore` に含まれており、GitHubにはアップロードされません。**
開発者は以下のひな形を元に、ローカル用の `.env` を作成する必要があります。

**apps/web/.env**

```env
# CMSのAPIエンドポイント
VITE_API_URL=http://localhost:3000
```

**apps/cms/.env**

```env
# データベース接続文字列
DATABASE_URI=mongodb://127.0.0.1/your-db
# Payloadのシークレットキー (ランダムな文字列)
PAYLOAD_SECRET=YOUR_SECRET_KEY
```

### Run Locally

```bash
# Run both Frontend and Backend concurrently (if configured in package.json)
npm run dev

# Or run individually
cd apps/cms && npm run dev
cd apps/web && npm run dev
```

## 🔐 Security Policy for Public Repository

本リポジトリはポートフォリオとして **Public** 公開されていますが、セキュリティを担保するために以下のルールを厳格に運用しています。

1. **No Secrets in Code**: APIキー、DBパスワード、アクセストークンなどの機密情報は、**絶対にコード内にハードコーディングしません**。
2. **Environment Variables**: 全ての機密情報は環境変数（`.env`）を通じて注入されます。
3. **Review Process**: 誤って機密情報をコミットしないよう、プッシュ前のセルフレビューを徹底します。
4. **Gitignore**: `.env`, `.DS_Store`, `node_modules` などのファイルが確実に除外されていることを確認しています。

万が一、機密情報が含まれるコミットを行ってしまった場合は、即座に該当のクレデンシャルを無効化し、Gitの履歴から抹消（BFG Repo-Cleaner等を使用）する手順を踏みます。
````
