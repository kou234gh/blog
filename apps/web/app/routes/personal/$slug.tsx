import { Octokit } from "octokit";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import Markdown from "react-markdown";

interface LoaderData {
  content: string;
  error: string | null;
  filename: string;
}

export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug;
  const filename = `${slug}.md`;

  try {
    const octokit = new Octokit({
      auth: context?.cloudflare?.env?.GITHUB_TOKEN,
      userAgent: "blog-app/v1.0.0",
    });

    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "kou234gh",
        repo: "content",
        path: `private/50_Public/${filename}`,
        mediaType: { format: "raw" },
      }
    );

    const content = response.data as unknown as string;

    return { content, error: null, filename };
  } catch (error) {
    console.error("記事の取得に失敗しました:", error);
    return {
      content: "",
      error:
        error instanceof Error ? error.message : "不明なエラーが発生しました",
      filename,
    };
  }
}

export default function PersonalArticle() {
  const { content, error, filename } = useLoaderData<LoaderData>();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              ❌ エラーが発生しました
            </h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 戻る */}
      <div className="mb-8">
        <a
          href="/personal"
          className="inline-flex items-center text-blue-600 hover:underline mb-4"
        >
          ← 記事一覧に戻る
        </a>
      </div>
      <article className="max-w-4xl mx-auto prose prose-lg prose-slate">
        <Markdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold mb-6 text-gray-900">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-900">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="text-gray-700">{children}</li>,
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">
                  {children}
                </code>
              ) : (
                <code className={className}>{children}</code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                {children}
              </blockquote>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt || ""}
                className="rounded-lg shadow-md my-6 w-full"
              />
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-gray-300">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-100">{children}</thead>
            ),
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => (
              <tr className="border-b border-gray-300">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 px-4 py-2">{children}</td>
            ),
          }}
        >
          {content}
        </Markdown>
      </article>
    </div>
  );
}
