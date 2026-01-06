import { Octokit } from "octokit";
import { useLoaderData, Link } from "react-router";
import { type LoaderFunctionArgs, type MetaArgs } from "react-router";
import Markdown from "react-markdown";

interface LoaderData {
  content: string;
  filename: string;
  error: string | null;
}

export function meta({ params }: MetaArgs) {
  return [
    { title: `${params.slug} - 技術ブログ` },
    { name: "description", content: "ブログ記事の詳細" },
  ];
}

export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug;

  if (!slug) {
    return {
      content: "",
      filename: "",
      error: "ファイル名が指定されていません",
    };
  }

  try {
    const githubToken = context?.cloudflare?.env?.GITHUB_TOKEN;

    const octokit = new Octokit({
      auth: githubToken,
      userAgent: "blog-app/v1.0.0",
    });

    // ファイル名に拡張子を追加
    const filename = slug.endsWith(".md") ? slug : `${slug}.md`;

    // ファイルの内容を取得（mediaType: raw で直接テキスト取得）
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "kou234gh",
        repo: "content",
        path: `articles/${filename}`,
        mediaType: {
          format: "raw",
        },
      }
    );

    // レスポンスデータは文字列として取得される
    const content = response.data as unknown as string;

    return {
      content,
      filename: slug,
      error: null,
    };
  } catch (error) {
    console.error("記事取得エラー:", error);
    return {
      content: "",
      filename: slug || "",
      error:
        error instanceof Error ? error.message : "記事の取得に失敗しました",
    };
  }
}

export default function BlogPost() {
  const { content, filename, error } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <Link
          to="/tech"
          className="inline-flex items-center text-blue-600 hover:underline mb-4"
        >
          ← 記事一覧に戻る
        </Link>
        <h1 className="text-3xl font-bold mb-2">{filename}</h1>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            ❌ エラーが発生しました
          </h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* 記事内容 */}
      {!error && content && (
        <article className="prose prose-lg max-w-none">
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-10 mb-5">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed">{children}</p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg my-4"
                />
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-2">{children}</li>,
              table: ({ children }) => (
                <table className="table-auto border-collapse border border-gray-300 mb-6">
                  {children}
                </table>
              ),
              tbody: ({ children }) => <tbody>{children}</tbody>,
              th: ({ children }) => (
                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-4 py-2">{children}</td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <code className="block bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </Markdown>
        </article>
      )}

      {/* 記事が見つからない場合 */}
      {!error && !content && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-700">記事が見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}
