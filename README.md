# Engineering Driven Portfolio & Startup Platform

エンジニアリングを核とした「ものづくり起業」のためのプラットフォーム。
自身のポートフォリオ、技術ブログ、製品紹介、そして将来的なプロダクト販売を一元管理するためのWebアプリケーションです。

## 🚀 Concept

"Engineering as a Product"

単なる情報の羅列ではなく、サイトそのものが自身の技術力と拡張性を示すプロダクトであることを目指しています。
ベンダーロックインを極力排除し、エッジコンピューティングとコンテナ技術を組み合わせた、スケーラブルかつフルコントロール可能な構成を採用しています。

## 🛠 Tech Stack Overview

| Category           | Technology                         | Description                                |
| :----------------- | :--------------------------------- | :----------------------------------------- |
| **Frontend**       | **React Router v7**                | SSR with Cloudflare Workers runtime        |
| **Infrastructure** | **Cloudflare Workers/Pages**       | Edge deployment using Workers Functions    |
| **CMS (Backend)**  | **Payload CMS v3**                 | TypeScript-first, Self-hosted Headless CMS |
| **Backend Infra**  | **AWS App Runner / GCP Cloud Run** | Containerized hosting for CMS              |
| **UI / 3D**        | **Tailwind CSS + Shadcn/ui + R3F** | Fully customizable UI & 3D Product View    |

## 📂 Repository Structure (Monorepo)

```text
.
├── apps/
│   ├── web/        # Frontend (React Router v7 / Cloudflare Pages)
│   └── cms/        # Backend (Payload CMS / Docker Container)
├── docs/           # Architecture & Design Documents
└── package.json
```
