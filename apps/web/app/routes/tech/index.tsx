import { Octokit } from "octokit";
import {
  Link,
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaArgs,
} from "react-router";

interface ArticleFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  download_url: string | null;
  type: "file" | "dir";
}

interface LoaderData {
  articles: ArticleFile[];
  error: string | null;
}

export function meta({}: MetaArgs) {
  return [
    { title: "技術ブログ - Engineering Portfolio" },
    {
      name: "description",
      content: "最新の技術スタックと開発プラクティスを共有",
    },
  ];
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    const octokit = new Octokit({
      auth: context?.cloudflare?.env?.GITHUB_TOKEN,
      userAgent: "blog-app/v1.0.0",
    });

    const { data } = await octokit.rest.repos.getContent({
      owner: "kou234gh",
      repo: "content",
      path: "articles",
    });

    const articles = data;
    return { articles, error: null };
  } catch (error) {
    console.error("Loader エラー:", error);
    return {
      articles: [],
      error:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
    };
  }
}

export default function BlogIndex() {
  const { articles, error } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">ブログ</h1>
        <p className="text-xl mb-12">筆者の個人ブログを共有しています</p>

        {/* エラー表示 */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              ❌ エラーが発生しました
            </h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 記事一覧 */}
        {!error && articles.length > 0 && (
          <div className="space-y-8">
            {articles.map((article: ArticleFile) => (
              <article
                key={article.sha}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <Link
                  to={`/tech/${article.name.replace(/\.mdx?$/, "")}`}
                  className="block"
                >
                  <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 transition-colors">
                    {article.name.replace(/\.mdx?$/, "")}
                  </h2>
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>サイズ: {(article.size / 1024).toFixed(2)} KB</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 記事が見つからない場合 */}
        {!error && articles.length === 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-700">記事が見つかりませんでした。</p>
          </div>
        )}
      </div>
    </div>
  );
}
