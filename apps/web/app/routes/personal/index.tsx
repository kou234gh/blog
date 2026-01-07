import matter from "gray-matter";
import { Octokit } from "octokit";
import {
  Link,
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaArgs,
} from "react-router";

interface ArticleFile {
  matterRes: matter.GrayMatterFile<string>;
  file: {
    name: string;
    download_url: string | null;
    type: string;
  };
}

interface LoaderData {
  articles: ArticleFile[];
  error: string | null;
}

export function meta({}: MetaArgs) {
  return [
    { title: "個人ブログ - Personal Blog" },
    {
      name: "description",
      content: "事業アイデア、日々の気付き、思考のシェア",
    },
  ];
}

export const loader = async ({
  request,
  context,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  // Octokitのインスタンス化（実際には認証情報などを設定）
  const octokit = new Octokit({
    auth: context?.cloudflare?.env?.GITHUB_TOKEN,
    userAgent: "blog-app/v1.0.0",
  });

  // 1. まずはディレクトリ内の全ファイル情報を取得
  const dirContentsResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: "kou234gh",
      repo: "content",
      path: "private/50_Public",
    }
  );

  // レスポンスが配列でない、またはファイルでないものは除外
  if (!Array.isArray(dirContentsResponse.data)) {
    throw new Error("Article directory not found or is not a directory.");
  }

  const files = dirContentsResponse.data.filter(
    (item) => item.type === "file" && item.name.endsWith(".md")
  );

  // 2. 各ファイルのrawコンテンツを取得するPromiseの配列を作成
  const articlePromises = files.map(async (file) => {
    const res = await fetch(file?.download_url ?? "");
    const rawContent = await res.text();
    // 3. 取得したrawコンテンツからfront-matterをパース
    const matterRes = matter(rawContent);
    // 4. 必要な情報だけを抽出して返す

    return {
      file,
      matterRes,
    };
  });

  // 5. Promise.allですべての記事取得処理を並列実行し、結果を待つ
  const articles = await Promise.all(articlePromises);

  return {
    articles,
    error: null,
  };
};

export default function PersonalIndex() {
  const { articles, error } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">個人ブログ</h1>
        <p className="text-base text-gray-600 mb-12">
          アイデア、日々の気付き、思考のシェア
        </p>

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
          <div className="space-y-8 grid grid-cols-1 md:grid-cols-3">
            {articles.map((article: ArticleFile) => (
              <Link
                to={`/personal/${article.file.name.replace(/\.md$/, "")}`}
                key={article.matterRes.data.slug}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="flex flex-col gap-2 items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.matterRes?.data?.title}
                  </h2>
                  <p className={"text-sm"}>
                    {article.matterRes?.data?.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 記事が0件の場合 */}
        {!error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">まだ記事がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
