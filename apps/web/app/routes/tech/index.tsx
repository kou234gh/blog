import { Octokit } from "octokit";
import matter from "gray-matter";
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";

// Frontmatterの型定義
interface ArticleFrontmatter {
  title: string;
  emoji: string;
  description: string; // ブログ一覧で使いたいdescription
  published?: boolean;
}

// loaderが最終的に返す記事データの型
export interface ArticleSummary {
  slug: string; // ファイル名をslugとして使う
  title: string;
  emoji: string;
  description: string;
}

export const loader = async ({
  request,
  context,
}: LoaderFunctionArgs): Promise<ArticleSummary[]> => {
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
      path: "articles",
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

    // downloadURLとfetchで済む。
    // const fileResponse = await octokit.request(
    //   "GET /repos/{owner}/{repo}/contents/{path}",
    //   {
    //     owner: "kou234gh",
    //     repo: "content",
    //     path: file.path,
    //     mediaType: {
    //       format: "raw",
    //     },
    //   }
    // );

    // 3. 取得したrawコンテンツからfront-matterをパース
    const matterRes = matter(rawContent);
    // 4. 必要な情報だけを抽出して返す
    const frontmatter = matterRes.data as ArticleFrontmatter;
    const slug = file.name.replace(/\.md$/, "");

    return {
      slug: slug,
      title: frontmatter.title,
      emoji: frontmatter.emoji,
      description: frontmatter.description,
    };
  });

  // 5. Promise.allですべての記事取得処理を並列実行し、結果を待つ
  const articles = await Promise.all(articlePromises);

  return articles;
};

export default function ArticlesPage() {
  const articles = useLoaderData<ArticleSummary[]>();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white sm:text-xl lg:text-3xl mb-12">
        ブログ記事一覧
      </h1>

      {/* 記事が1件もなかった場合の表示 */}
      {articles?.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          投稿された記事はまだありません。
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              to={`/tech/${article.slug}`}
              key={article.slug}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">{article.emoji}</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
