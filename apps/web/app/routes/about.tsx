import type { MetaArgs } from "react-router";
import { Link } from "react-router";

export function meta({}: MetaArgs) {
  return [
    { title: "About - Engineering Portfolio" },
    {
      name: "description",
      content: "プロジェクトの設計思想と技術選定について",
    },
  ];
}

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 ">About This Project</h1>

        {/* Concept Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            このサイトについて
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              エンジニアとしての技術ブログ、ポートフォリオ、製品紹介を掲載する個人サイトです。
            </p>
            <p className="text-gray-700 leading-relaxed">
              学んだ技術を記事にまとめ、個人開発した製品を公開することで、
              より良い収入とキャリアにつなげていくことを目的としています。
              このサイト自体も、モダンな技術スタックを使った実践例として機能します。
            </p>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 ">技術構成</h2>
          <p className=" mb-6 leading-relaxed">
            現在はシンプルなフロントエンドのみの構成です。記事が増えてきたら、
            記事管理を効率化するためにCMSの導入を検討します。
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 ">現在の構成</h3>
              <ul className="space-y-2 ">
                <li>
                  <strong>Framework:</strong> React Router v7
                </li>
                <li>
                  <strong>Deployment:</strong> Cloudflare Pages
                </li>
                <li>
                  <strong>UI:</strong> Tailwind CSS + Shadcn/ui
                </li>
                <li>
                  <strong>Data:</strong> コード内の静的データ
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 ">将来的に追加予定</h3>
              <ul className="space-y-2 ">
                <li>
                  <strong>CMS:</strong> Payload CMS v3
                </li>
                <li>
                  <strong>Hosting:</strong> AWS / GCP (無料枠)
                </li>
                <li>
                  <strong>Database:</strong> MongoDB Atlas
                </li>
                <li>
                  <strong>Features:</strong> 記事管理、画像管理
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 ">なぜこの技術を選んだか</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-bold mb-2 ">Cloudflare Pages</h3>
              <p className=" leading-relaxed">
                無料枠が優秀で、帯域幅制限がないのが大きな理由です。
                画像が多いブログでもコストを気にせず運用できます。
                デプロイも簡単でGitHubと連携するだけで自動デプロイされます。
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="text-xl font-bold mb-2 ">React Router v7</h3>
              <p className=" leading-relaxed">
                モダンなSSR対応で、Reactの知識があればすぐに使えます。
                TypeScriptとの相性も良く、型安全にルーティングを実装できます。
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-xl font-bold mb-2 ">
                Tailwind CSS + Shadcn/ui
              </h3>
              <p className=" leading-relaxed">
                素早く美しいUIを構築できます。Shadcn/uiはコンポーネントを
                コピーして使うので、完全にカスタマイズ可能です。
              </p>
            </div>
          </div>
        </section>

        {/* Repository Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 ">ソースコード</h2>
          <p className=" mb-4 leading-relaxed">
            このサイトはポートフォリオとして<strong>Public</strong>
            で公開されています。
          </p>
          <a
            href="https://github.com/kou234gh/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            GitHub Repository を見る
          </a>
        </section>

        {/* Call to Action */}
        <section className="bg-linear-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            学びと成長を共有
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            技術を学び、作ったものを公開し、それが誰かの役に立つ。
            そんなサイクルを回していくためのサイトです。
          </p>
          <div className="flex gap-4">
            <Link
              to="/blog"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              技術ブログを読む
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-white transition-colors font-medium"
            >
              製品を見る
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
