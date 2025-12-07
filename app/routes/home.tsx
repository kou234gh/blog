import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
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
          Personal Blog & Portfolio
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          エンジニアとしての技術ブログ、ポートフォリオ、製品紹介を掲載する個人サイト
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/blog"
            className="px-8 py-3 bg-gray-900  rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ブログを読む
          </Link>
          <Link
            to="/products"
            className="px-8 py-3 border border-gray-900  rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            製品を見る
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 grid md:grid-cols-3 gap-8">
        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 ">技術ブログ</h3>
          <p className=" mb-4">
            最新の技術スタックと開発プラクティスを共有。React Router
            v7、Cloudflare Workers、Payload CMSなど。
          </p>
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            記事一覧を見る →
          </Link>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 ">製品紹介</h3>
          <p className=" mb-4">
            3Dモデルとインタラクティブなデモで製品を紹介。React Three
            Fiberを活用した没入型体験。
          </p>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            製品を見る →
          </Link>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-2xl font-bold mb-3 ">ポートフォリオ</h3>
          <p className=" mb-4">
            プロジェクトの設計思想、技術選定の理由、そして開発の裏側をドキュメントで公開。
          </p>
          <Link
            to="/about"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            詳細を見る →
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
            <h4 className="font-bold text-lg mb-2">Infrastructure</h4>
            <p className="">Cloudflare Workers/Pages</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">CMS</h4>
            <p className="">Payload CMS v3</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">Backend</h4>
            <p className="">AWS App Runner / Cloud Run</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">UI</h4>
            <p className="">Tailwind CSS + Shadcn/ui</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg mb-2">3D</h4>
            <p className="">React Three Fiber</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          技術で価値を生み出す
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          学んだ技術を記事にまとめ、作ったものを公開することで、
          より良い収入とキャリアにつなげていくためのサイトです。
        </p>
        <Link
          to="/about"
          className="inline-block px-8 py-3 bg-gray-900  rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          もっと詳しく
        </Link>
      </section>
    </div>
  );
}
