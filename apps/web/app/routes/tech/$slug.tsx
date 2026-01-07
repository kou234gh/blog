import matter from "gray-matter";
import { Octokit } from "octokit";
import { useLoaderData, Link } from "react-router";
import { type LoaderFunctionArgs, type MetaArgs } from "react-router";
import { MarkdownCustom } from "~/components/Markdown";

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

    const { content } = matter(response.data as unknown as string);

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
  const { content, error } = useLoaderData<LoaderData>();
  console.log(content);
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
          <MarkdownCustom>{content}</MarkdownCustom>
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
