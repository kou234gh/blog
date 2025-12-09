import type { ComponentProps } from "react";
import type { MetaArgs } from "react-router";
import { Link, type LoaderFunctionArgs } from "react-router";

export function meta({ params }: MetaArgs) {
  return [
    { title: `${params.slug} - 技術ブログ` },
    { name: "description", content: "ブログ記事の詳細" },
  ];
}

// TODO: Payload CMSから記事データを取得
export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  // 仮データ - 将来的にはPayload CMS APIから取得
  const posts: Record<string, any> = {
    "react-router-v7-cloudflare": {
      title: "React Router v7とCloudflare Workersで実現する高速SSR",
      date: "2025-12-01",
      tags: ["React Router", "Cloudflare", "SSR"],
      content: `
## はじめに

React Router v7は、Remix v2の後継として、Web標準に基づいた強力なSSR機能を提供します。
本記事では、Cloudflare Workersランタイムを活用した高速なSSRの実装方法を解説します。

## セットアップ

まず、\`@react-router/cloudflare\`パッケージをインストールします。

\`\`\`bash
npm install @react-router/cloudflare
\`\`\`

## wrangler.tomlの設定

\`\`\`toml
name = "my-app"
compatibility_date = "2024-11-22"
pages_build_output_dir = "./build/client"
\`\`\`

## loaderでのデータフェッチ

\`\`\`typescript
export async function loader({ context }: Route.LoaderArgs) {
  // Cloudflare Workers環境でAPIを呼び出し
  const data = await fetch('https://api.example.com/data');
  return { data: await data.json() };
}
\`\`\`

## まとめ

Cloudflare Workersを活用することで、グローバルなエッジネットワーク上で高速なSSRを実現できます。
      `,
    },
    "payload-cms-setup": {
      title: "Payload CMS v3でHeadless CMSを構築する",
      date: "2025-11-25",
      tags: ["Payload CMS", "Headless CMS", "TypeScript"],
      content: `
## Payload CMS v3とは

TypeScript-firstな、Next.js上で動作する強力なHeadless CMSです。
完全にコントロール可能で、ベンダーロックインがありません。

## インストール

\`\`\`bash
npx create-payload-app@latest my-cms
\`\`\`

## コレクションの定義

\`\`\`typescript
import { CollectionConfig } from 'payload/types';

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
};
\`\`\`

## まとめ

Payload CMSは、開発者ファーストな設計で、柔軟性の高いCMSを構築できます。
      `,
    },
  };

  const post = posts[slug] || {
    title: "記事が見つかりません",
    date: new Date().toISOString(),
    tags: [],
    content: "指定された記事は存在しません。",
  };

  return { post, slug };
}

export default function BlogPost({ loaderData }: ComponentProps<any>) {
  const { post, slug } = loaderData as any;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          ← ブログ一覧に戻る
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 ">{post.title}</h1>
            <div className="flex items-center gap-4 ">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <div className="flex gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100  rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← ブログ一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
