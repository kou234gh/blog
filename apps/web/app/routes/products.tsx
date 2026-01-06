import type { ComponentProps } from "react";
import type { LoaderFunctionArgs } from "react-router";
import type { MetaArgs } from "react-router";

export function meta({}: MetaArgs) {
  return [
    { title: "製品紹介 - Engineering Portfolio" },
    { name: "description", content: "個人開発したツールやサービスの紹介" },
  ];
}

// 仮データ - 将来的にはPayload CMS APIから取得

const mockProducts = [
  {
    id: "1",
    name: "SaaS Dashboard Template",
    description:
      "モダンな管理画面テンプレート。React Router v7、Tailwind CSS、Shadcn/uiを使用した、すぐに使えるダッシュボード。",
    image: "https://via.placeholder.com/400x300",
    tags: ["React", "Tailwind CSS", "SaaS"],
    status: "開発中",
  },
  {
    id: "2",
    name: "3D Product Viewer",
    description:
      "React Three Fiberを使用した製品ビューアー。GLTFモデルをインタラクティブに表示し、ユーザーエンゲージメントを向上。",
    image: "https://via.placeholder.com/400x300",
    tags: ["R3F", "3D", "WebGL"],
    status: "リリース予定",
  },
  {
    id: "3",
    name: "Edge CMS Starter",
    description:
      "Payload CMS + Cloudflare Workersで構築するエッジファーストCMSスターターキット。",
    image: "https://via.placeholder.com/400x300",
    tags: ["Payload CMS", "Cloudflare", "Headless CMS"],
    status: "構想中",
  },
];

// TODO: Payload CMSから製品データを取得
export async function loader({ context }: LoaderFunctionArgs) {
  return { mockProducts };
}

export default function Products({ loaderData }: ComponentProps<any>) {
  // const { mockProducts } = loaderData;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 ">製品紹介</h1>
        <p className="text-xl  mb-12">
          エンジニアリングの力で生み出すプロダクト
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold ">{product.name}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {product.status}
                  </span>
                </div>
                <p className=" mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100  rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Viewer Section (Future) */}
        <section className="mt-16 p-8 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 ">
            インタラクティブ3Dビューアー
          </h2>
          <p className=" mb-6">
            React Three Fiberを使用した製品の3D表示機能は現在開発中です。
            近日中に実装予定です。
          </p>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <p className=" text-lg">3D Model Loading...</p>
          </div>
        </section>
      </div>
    </div>
  );
}
