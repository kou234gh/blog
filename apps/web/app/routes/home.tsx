import { Button } from "~/components/ui/button";
import { Link, type MetaArgs } from "react-router";

export function meta({}: MetaArgs) {
  return [
    { title: "Engineering Portfolio - ものづくり起業プラットフォーム" },
    {
      name: "description",
      content:
        "エンジニアリングを核としたポートフォリオ、技術ブログ、製品紹介を一元管理するプラットフォーム",
    },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Kou234 Blog
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          技術、アイデア、日々の気付きを発信する個人サイト
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/tech">
            <Button variant="default" size="lg">
              技術ブログを読む
            </Button>
          </Link>

          <Link to="/about">
            <Button variant="outline" size="lg">
              プロフィール
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 grid md:grid-cols-3 gap-8">
        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 ">技術ブログ</h3>
          <p className=" mb-4">
            最新の技術スタックと開発プラクティスを共有。React Router
            v7、Cloudflare Workers、GitHub API、Cloudflare R2など。
          </p>

          <Link to="/tech" className="">
            <Button variant="outline" size="lg">
              記事一覧を見る →
            </Button>
          </Link>
        </div>

        {/* <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 ">製品紹介</h3>
          <p className=" mb-4">...soon</p>

          <Link to="/products">
            <Button variant="outline" size="lg">
              製品を見る →
            </Button>
          </Link>
        </div> */}

        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 ">ポートフォリオ</h3>
          <p className=" mb-4">
            プロジェクトの設計思想、技術選定の理由、そして開発の裏側をドキュメントで公開。
          </p>

          <Link to="/about">
            <Button variant="outline" size="lg">
              詳細を見る →
            </Button>
          </Link>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-gray-50 -mx-4 px-4 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12 ">Tech Stack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">Frontend</h4>
            <p className="">React Router v7</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">Deployment</h4>
            <p className="">Cloudflare Workers/Pages</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">Content</h4>
            <p className="">GitHub (Private Repository)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">Storage</h4>
            <p className="">Cloudflare R2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">UI</h4>
            <p className="">Tailwind CSS + Shadcn/ui</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">API</h4>
            <p className="">GitHub REST API + Octokit.js</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          学びと成長を発信する
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          技術的な学びから、事業アイデア、日々の気付きまで。
          アウトプットを通じて成長していくためのサイトです。
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/tech">
            <Button variant="default" size="lg">
              技術ブログを読む
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg">
              プロフィールを見る
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
