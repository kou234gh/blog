import matter from "gray-matter";
import { Octokit } from "octokit";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { MarkdownCustom } from "~/components/Markdown";

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

    const matterRes = matter(response.data as unknown as string);
    return { content: matterRes.content, error: null, filename };
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
  const { content, error } = useLoaderData<LoaderData>();
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
      <div className="mb-8">
        <a
          href="/personal"
          className="inline-flex items-center text-blue-600 hover:underline mb-4"
        >
          ← 記事一覧に戻る
        </a>
      </div>
      <article className="max-w-4xl mx-auto prose prose-lg prose-slate">
        <MarkdownCustom>{content}</MarkdownCustom>
      </article>
    </div>
  );
}
