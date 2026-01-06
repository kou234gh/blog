# Cloud Run へのデプロイ手順

このドキュメントでは、`apps/cms` を Google Cloud Run にデプロイする手順を説明します。

---

## 前提条件

- Google Cloud アカウントを持っていること
- プロジェクトが作成されていること
- GitHub リポジトリにコードがプッシュされていること

---

## 1. Google Cloud プロジェクトの準備

### Step 1: Google Cloud Console にログイン

<https://console.cloud.google.com/> にアクセスし、ログインします。

### Step 2: プロジェクトの作成（まだ作成していない場合）

```bash
# gcloud CLIをインストール済みの場合
gcloud projects create blog-cms-project --name="Blog CMS"

# または、Consoleから手動で作成
# https://console.cloud.google.com/projectcreate
```

### Step 3: 必要な API を有効化

```bash
# プロジェクトを選択
gcloud config set project blog-cms-project

# 必要なAPIを有効化
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com
```

---

## 2. データベースのセットアップ

### オプション A: Cloud SQL (PostgreSQL)

#### Cloud SQL インスタンスを作成

```bash
gcloud sql instances create blog-cms-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-northeast1
```

#### データベースを作成

```bash
gcloud sql databases create payload \
  --instance=blog-cms-db
```

#### ユーザーを作成

```bash
gcloud sql users create payload \
  --instance=blog-cms-db \
  --password=YOUR_SECURE_PASSWORD
```

#### 接続文字列を取得

```bash
gcloud sql instances describe blog-cms-db --format="value(connectionName)"
# 出力例: blog-cms-project:asia-northeast1:blog-cms-db
```

**DATABASE_URI の形式:**

```text
postgresql://payload:YOUR_SECURE_PASSWORD@/payload?host=/cloudsql/blog-cms-project:asia-northeast1:blog-cms-db
```

### オプション B: 外部のマネージド PostgreSQL

- [Supabase](https://supabase.com/) (無料枠あり)
- [Neon](https://neon.tech/) (無料枠あり)
- [Railway](https://railway.app/)

これらのサービスで PostgreSQL データベースを作成し、接続文字列を取得してください。

---

## 3. GitHub Secrets の設定

GitHub リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを追加します。

### 必須シークレット

#### 1. `GCP_SA_KEY` (サービスアカウントキー)

サービスアカウントを作成して JSON キーをダウンロード:

```bash
# サービスアカウントを作成
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# 必要な権限を付与
gcloud projects add-iam-policy-binding blog-cms-project \
  --member="serviceAccount:github-actions@blog-cms-project.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding blog-cms-project \
  --member="serviceAccount:github-actions@blog-cms-project.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding blog-cms-project \
  --member="serviceAccount:github-actions@blog-cms-project.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# JSONキーを作成
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions@blog-cms-project.iam.gserviceaccount.com
```

生成された `github-actions-key.json` の内容をコピーして、GitHub Secrets の `GCP_SA_KEY` に貼り付けます。

#### 2. `GCP_PROJECT_ID`

```text
blog-cms-project
```

（あなたのプロジェクト ID を入力）

---

## 4. Secret Manager でシークレットを作成

Cloud Run では、環境変数の代わりに Secret Manager を使用することが推奨されています。

### Step 1: Secret Manager API を有効化

```bash
gcloud services enable secretmanager.googleapis.com
```

### Step 2: シークレットを作成

#### DATABASE_URI

```bash
echo -n "postgresql://payload:YOUR_PASSWORD@/payload?host=/cloudsql/..." | \
  gcloud secrets create blog-cms-database-uri --data-file=-
```

#### PAYLOAD_SECRET

```bash
# ランダムな安全なシークレットを生成
openssl rand -base64 32 | \
  gcloud secrets create blog-cms-payload-secret --data-file=-
```

### Step 3: Cloud Run サービスアカウントに権限を付与

```bash
# Cloud Runが使用するデフォルトのサービスアカウントに権限を付与
gcloud secrets add-iam-policy-binding blog-cms-database-uri \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding blog-cms-payload-secret \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

プロジェクト番号は以下のコマンドで確認できます:

```bash
gcloud projects describe blog-cms-project --format="value(projectNumber)"
```

---

## 5. デプロイの実行

### 方法 A: GitHub Actions 経由（推奨）

`apps/cms` に変更を加えて、main ブランチにプッシュするだけです。

```bash
git add .
git commit -m "feat: Cloud Run用の設定を追加"
git push origin main
```

GitHub Actions が自動的に以下を実行します:

1. Docker イメージのビルド
2. Google Container Registry へのプッシュ
3. Cloud Run へのデプロイ

デプロイが完了すると、Actions のログに URL が表示されます。

### 方法 B: ローカルから手動デプロイ

#### オプション 1: Docker CLI を使用（推奨）

```bash
# 認証
gcloud auth login
gcloud config set project blog-cms-project

# Dockerの認証設定
gcloud auth configure-docker

# モノレポのルートディレクトリから実行
docker build -f apps/cms/Dockerfile -t gcr.io/blog-cms-project/blog-cms:latest .

# イメージをプッシュ
docker push gcr.io/blog-cms-project/blog-cms:latest

# Cloud Runにデプロイ
gcloud run deploy blog-cms \
  --image gcr.io/blog-cms-project/blog-cms:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "DATABASE_URI=blog-cms-database-uri:latest,PAYLOAD_SECRET=blog-cms-payload-secret:latest" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080
```

#### オプション 2: Cloud Build を使用

Cloud Build を使う場合は、`cloudbuild.yaml` を作成する必要があります。

`apps/cms/cloudbuild.yaml` を作成:

```yaml
steps:
  # Docker イメージをビルド
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "build"
      - "-f"
      - "apps/cms/Dockerfile"
      - "-t"
      - "gcr.io/$PROJECT_ID/blog-cms:$COMMIT_SHA"
      - "-t"
      - "gcr.io/$PROJECT_ID/blog-cms:latest"
      - "."

  # イメージをプッシュ
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "push"
      - "gcr.io/$PROJECT_ID/blog-cms:$COMMIT_SHA"

  - name: "gcr.io/cloud-builders/docker"
    args:
      - "push"
      - "gcr.io/$PROJECT_ID/blog-cms:latest"

  # Cloud Run にデプロイ
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    entrypoint: gcloud
    args:
      - "run"
      - "deploy"
      - "blog-cms"
      - "--image"
      - "gcr.io/$PROJECT_ID/blog-cms:$COMMIT_SHA"
      - "--platform"
      - "managed"
      - "--region"
      - "asia-northeast1"
      - "--allow-unauthenticated"

images:
  - "gcr.io/$PROJECT_ID/blog-cms:$COMMIT_SHA"
  - "gcr.io/$PROJECT_ID/blog-cms:latest"
```

その後、以下のコマンドで実行:

```bash
# モノレポのルートディレクトリから実行
gcloud builds submit --config=apps/cms/cloudbuild.yaml .
```

**重要:** ビルドコンテキストは `.`（リポジトリルート）にする必要があります。

---

## 6. デプロイ後の確認

### サービス URL を確認

```bash
gcloud run services describe blog-cms \
  --platform managed \
  --region asia-northeast1 \
  --format 'value(status.url)'
```

出力例:

```text
https://blog-cms-xyz-an.a.run.app
```

### 動作確認

1. **CMS 管理画面:** `https://blog-cms-xyz-an.a.run.app/admin`
2. **API エンドポイント:** `https://blog-cms-xyz-an.a.run.app/api/posts`

---

## 7. Frontend (Cloudflare Pages) の環境変数を更新

Cloudflare Pages のダッシュボードで、環境変数を追加します:

```bash
VITE_API_URL=https://blog-cms-xyz-an.a.run.app
```

これで Frontend から Cloud Run の API を呼び出せるようになります。

---

## トラブルシューティング

### `COPY failed: file not found` エラーが発生する場合

**エラー例:**

```text
COPY failed: file not found in build context or excluded by .dockerignore:
stat pnpm-workspace.yaml: file does not exist
```

**原因:** ビルドコンテキストが間違っています。`apps/cms` ディレクトリではなく、**リポジトリルート**から実行する必要があります。

**修正方法:**

```bash
# ❌ 間違い
cd apps/cms
docker build -t gcr.io/PROJECT_ID/blog-cms .

# ✅ 正解（リポジトリルートから実行）
docker build -f apps/cms/Dockerfile -t gcr.io/PROJECT_ID/blog-cms .
```

`gcloud builds submit` を使う場合も同様:

```bash
# ❌ 間違い
cd apps/cms
gcloud builds submit --tag gcr.io/PROJECT_ID/blog-cms

# ✅ 正解（リポジトリルートから実行）
gcloud builds submit --config=apps/cms/cloudbuild.yaml .
```

### ビルドエラーが発生する場合

```bash
# ログを確認
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=blog-cms" --limit 50
```

### データベース接続エラーが発生する場合

1. Cloud SQL インスタンスが起動しているか確認
2. DATABASE_URI の形式が正しいか確認
3. Cloud Run サービスアカウントに Cloud SQL Client 権限があるか確認

```bash
gcloud projects add-iam-policy-binding blog-cms-project \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

### メモリ不足エラーが発生する場合

```bash
# メモリを増やす
gcloud run services update blog-cms \
  --memory 1Gi \
  --region asia-northeast1
```

---

## コスト最適化のヒント

1. **最小インスタンス数を 0 に設定**: アクセスがない時は自動的にスケールダウン
2. **CPU 割り当て**: リクエスト処理中のみ CPU を割り当て（デフォルト）
3. **Cloud SQL の自動バックアップ**: 不要な場合は無効化
4. **古いコンテナイメージの削除**: GCR の Storage 料金を節約

```bash
# 古いイメージを削除（最新3つを残す）
gcloud container images list-tags gcr.io/blog-cms-project/blog-cms \
  --format="get(digest)" --filter="NOT tags:*" \
  | xargs -I {} gcloud container images delete gcr.io/blog-cms-project/blog-cms@{} --quiet
```

---

## まとめ

この設定により、以下が実現されます:

✅ `apps/cms` への変更を main にプッシュすると自動デプロイ  
✅ Docker コンテナとして Cloud Run で動作  
✅ 世界中からアクセス可能な API エンドポイント  
✅ 無料枠から始められる（月間 200 万リクエストまで無料）  
✅ 自動スケーリング（アクセス増加に自動対応）

何か問題が発生した場合は、GitHub Actions のログと Cloud Run のログを確認してください。
