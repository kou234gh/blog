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
        <h1 className="text-4xl font-bold mb-8 ">Profile</h1>

        {/* About Me Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">自己紹介</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              エンジニアとして技術を学び、アウトプットを通じて成長していくことを目指しています。
            </p>
            <p className="text-gray-700 leading-relaxed">
              このサイトでは、技術ブログ（Zennにも投稿）、個人ブログ（事業アイデアや気付き）、
              そしてポートフォリオとしての技術記事を公開しています。
            </p>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 ">技術構成</h2>
          <p className=" mb-6 leading-relaxed">
            GitHubのプライベートリポジトリをコンテンツストレージとして使用し、
            Cloudflare Pages + Workersでホスティングするシンプルな構成です。
          </p>

          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-3 ">現在の構成</h3>
            <ul className="space-y-2 ">
              <li>
                <strong>Framework:</strong> React Router v7
              </li>
              <li>
                <strong>Deployment:</strong> Cloudflare Pages / Workers
              </li>
              <li>
                <strong>Content Storage:</strong> GitHub (Private Repository)
              </li>
              <li>
                <strong>Image Storage:</strong> Cloudflare R2
              </li>
              <li>
                <strong>API:</strong> GitHub REST API + Octokit.js
              </li>
              <li>
                <strong>UI:</strong> Tailwind CSS + Shadcn/ui
              </li>
            </ul>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 ">なぜこの技術を選んだか</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-bold mb-2 ">
                Cloudflare Pages + Workers
              </h3>
              <p className=" leading-relaxed">
                無料枠が優秀で、帯域幅制限がないのが大きな理由です。
                エッジネットワークで高速なSSRを実現でき、GitHubと連携するだけで自動デプロイされます。
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="text-xl font-bold mb-2 ">
                GitHub + Cloudflare R2
              </h3>
              <p className=" leading-relaxed">
                記事はMarkdownでGitHubリポジトリに保存し、画像はCloudflare
                R2に配置。
                CMSを立てる必要がなく、シンプルで管理しやすい構成です。
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-xl font-bold mb-2 ">React Router v7</h3>
              <p className=" leading-relaxed">
                モダンなSSR対応で、Reactの知識があればすぐに使えます。
                TypeScriptとの相性も良く、型安全にルーティングを実装できます。
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-linear-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">記事を読む</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            技術的な学びから、事業アイデアや日々の気付きまで、
            様々なトピックで発信しています。
          </p>
          <div className="flex gap-4">
            <Link
              to="/tech"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              技術ブログ
            </Link>
            <Link
              to="/personal"
              className="px-6 py-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-white transition-colors font-medium"
            >
              個人ブログ
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
