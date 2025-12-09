import type { ComponentProps } from "react";
import { Link, type LoaderFunctionArgs, type MetaArgs } from "react-router";

export function meta({}: MetaArgs) {
  return [
    { title: "技術ブログ - Engineering Portfolio" },
    {
      name: "description",
      content: "最新の技術スタックと開発プラクティスを共有",
    },
  ];
}

// TODO: Payload CMSからデータを取得
export async function loader({ context }: LoaderFunctionArgs) {
  // 仮データ - 将来的にはPayload CMS APIから取得
  const posts = [
    {
      slug: "react-router-v7-cloudflare",
      title: "React Router v7とCloudflare Workersで実現する高速SSR",
      excerpt:
        "React Router v7の@react-router/cloudflareアダプターを使用して、エッジコンピューティング環境で高速なSSRを実装する方法を解説します。",
      date: "2025-12-01",
      tags: ["React Router", "Cloudflare", "SSR"],
    },
    {
      slug: "payload-cms-setup",
      title: "Payload CMS v3でHeadless CMSを構築する",
      excerpt:
        "TypeScript-firstなPayload CMS v3を使用して、柔軟性の高いHeadless CMSを構築する手順とベストプラクティス。",
      date: "2025-11-25",
      tags: ["Payload CMS", "Headless CMS", "TypeScript"],
    },
  ];

  return { posts };
}

export default function BlogIndex({ loaderData }: ComponentProps<any>) {
  const { posts } = loaderData;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 ">技術ブログ</h1>
        <p className="text-xl  mb-12">
          最新の技術スタックと開発プラクティスを共有しています
        </p>

        <div className="space-y-8">
          {posts.map((post: any) => (
            <article
              key={post.slug}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <Link to={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-3  hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className=" mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm ">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <div className="flex gap-2">
                  {post.tags.map((tag: any) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100  rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
