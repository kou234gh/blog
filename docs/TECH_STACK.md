# Technology Decisions

本プロジェクトにおける技術選定の背景と「こだわり」について記述します。

## 1. Cloudflare Workers/Pages + React Router v7 (Frontend)

### Why Cloudflare Workers/Pages?

- **Edge Computing**: ユーザーに近い場所でコードを実行できるため、圧倒的なパフォーマンスを実現できます。
- **Cost Efficiency**: 帯域幅のコストが無料であり、将来的に画像や3Dモデルなどの大容量アセットを扱う「ものづくり系」サイトにおいて大きなメリットがあります。
- **Vercelとの比較**: Vercelも優秀ですが、AWS Lambdaベースの従量課金リスクやCold Startを避け、より「Web標準」に近いCloudflare Workers環境を選択しました。
- **Cloudflare Pages Functions**: Pages上でWorkersランタイムを利用したSSRが可能で、`@react-router/cloudflare`アダプターを使用してデプロイします。

### Why React Router v7?

- **Remix Philosophy**: Remix v2の後継として、Web標準（Request/Response API）に基づいたデータフェッチングが可能です。
- **Type Safety**: フロントエンドからバックエンドAPIの型までを一貫して扱うことができ、保守性が向上します。
- **Cloudflare Workers対応**: `@react-router/cloudflare`パッケージにより、Workersランタイムに最適化されたSSRを実現します。

## 2. Payload CMS (Backend)

### Why Payload CMS?

- **TypeScript First**: 設定ファイルから全てTypeScriptで記述でき、開発体験（DX）が非常に高いです。
- **No Vendor Lock-in**: SaaS型CMSと異なり、コードとして所有できるため、データの構造や機能を完全にコントロールできます。将来的に独自のEC機能や会員サイト機能を実装する際も、CMS自体を改造可能です。
- **Headless**: フロントエンドのフレームワークに依存せず、純粋なAPIサーバーとして機能させることができます。

### Why not Next.js for Frontend?

- Payload CMS自体は管理画面のためにNext.jsを使用していますが、フロントエンド（ユーザーが見るサイト）までNext.jsに統一する必要はありません。
- 今回は「エッジでのパフォーマンス」と「Cloudflareへの最適化」を優先し、フロントエンドにはより軽量で柔軟な React Router v7 を採用しました。

## 3. UI & Design System

### Tailwind CSS + Shadcn/ui

- **Customizability**: コンポーネントライブラリ（MUI等）に依存するのではなく、コードをコピーして所有する Shadcn/ui を採用。
- これにより、デザインの細部まで完全にコントロールでき、ブランドの個性を表現する「ものづくり」に適したUIを構築できます。
