# GitHub Actions のセットアップ手順

このドキュメントでは、CMSを自動的にGoogle Cloud Runにデプロイするための設定方法を説明します。

## 必要な準備

### 1. Google Cloud プロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトIDをメモしておく

### 2. 必要なAPIの有効化

以下のコマンドをCloud Shellまたはローカルで実行:

```bash
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

### 3. サービスアカウントの作成

```bash
# サービスアカウント作成
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# 必要な権限を付与
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# キーファイルを生成
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 4. Secret Manager にシークレットを登録

```bash
# データベース接続文字列を登録
echo -n "postgresql://user:password@host:5432/dbname" | \
  gcloud secrets create blog-cms-database-uri --data-file=-

# Payload Secret を登録
echo -n "your-very-secure-random-string-here" | \
  gcloud secrets create blog-cms-payload-secret --data-file=-
```

### 5. GitHub Secrets の設定

GitHubリポジトリの Settings > Secrets and variables > Actions から以下を追加:

- **GCP_PROJECT_ID**: Google CloudのプロジェクトID
- **GCP_SA_KEY**: `key.json` の内容全体（JSON形式）

## デプロイの実行

`apps/cms` 配下のファイルを変更してmainブランチにpushすると、自動的にデプロイが開始されます。

```bash
git add .
git commit -m "feat: update CMS configuration"
git push origin main
```

GitHub ActionsのタブでデプロイログとURLを確認できます。
