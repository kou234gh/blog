# Personal Blog & Portfolio

エンジニアとしての技術ブログ、ポートフォリオ、製品紹介を掲載する個人サイトです。

## 🎯 目的

- **技術ブログ**: 学んだ技術や開発の知見を記事として公開
- **ポートフォリオ**: スキルセットやプロジェクト経験の紹介
- **製品紹介**: 個人開発したツールやサービスの紹介
- **収益化**: アフィリエイトや広告、将来的な有料コンテンツ販売の基盤

## 🛠 Tech Stack

| Category       | Technology                   | Why?                                   |
| :------------- | :--------------------------- | :------------------------------------- |
| **Frontend**   | **React Router v7**          | モダンなSSR対応フレームワーク          |
| **Deploy**     | **Cloudflare Pages**         | 無料枠で高速配信、帯域幅制限なし       |
| **UI**         | **Tailwind CSS + Shadcn/ui** | 素早く美しいUIを構築                   |
| **CMS (将来)** | **Payload CMS** (予定)       | 記事管理を効率化するためのHeadless CMS |

## 📂 プロジェクト構成

```text
.
├── app/
│   ├── routes/          # ページコンポーネント
│   ├── components/      # 共通コンポーネント
│   └── lib/             # ユーティリティ関数
├── public/              # 静的ファイル
└── docs/                # 技術ドキュメント
```

## 🚀 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# Cloudflareにデプロイ
npm run deploy
```
