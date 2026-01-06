# モノレポ移行後のセットアップ手順

モノレポ構成に移行した後、以下の手順で環境をセットアップしてください。

## 1. 依存関係のインストール

```bash
# ルートディレクトリで実行
npm install
```

これにより、`apps/web` と `apps/cms` の依存関係が自動的にインストールされます。

## 2. 環境変数の設定

### Frontend (apps/web)

```bash
cp apps/web/.env.example apps/web/.env
```

`apps/web/.env` を開いて、必要に応じて編集:

```bash
VITE_API_URL=http://localhost:3000
```

### Backend (apps/cms)

```bash
cp apps/cms/.env.example apps/cms/.env
```

`apps/cms/.env` を開いて、必要に応じて編集:

```bash
DATABASE_URI=postgresql://payload:payload@localhost:5432/payload
PAYLOAD_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## 3. データベースの起動

```bash
cd apps/cms
docker-compose up -d
cd ../..
```

データベースが起動したか確認:

```bash
docker ps
```

## 4. 開発サーバーの起動

ルートディレクトリから:

```bash
npm run dev
```

これで以下が同時に起動します:

- Frontend: <http://localhost:5173>
- CMS: <http://localhost:3000>

## 5. 初回管理者アカウント作成

1. <http://localhost:3000/admin> にアクセス
2. 初回起動時に管理者アカウントを作成

## トラブルシューティング

### ポートが既に使用されている

```bash
# ポート3000を使用しているプロセスを確認
lsof -i :3000

# または
lsof -i :5173
```

### データベース接続エラー

```bash
# PostgreSQLコンテナのログを確認
docker logs blog-cms-postgres

# コンテナを再起動
cd apps/cms
docker-compose down
docker-compose up -d
```

### ビルドエラー

```bash
# node_modules を削除して再インストール
rm -rf node_modules apps/*/node_modules
npm install
```
