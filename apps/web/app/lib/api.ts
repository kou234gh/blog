const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Payload CMS APIのレスポンス型定義
 */
export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

/**
 * ブログ記事の型定義
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: any; // Lexical RichText content
  excerpt?: string;
  publishedAt?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

/**
 * ブログ記事一覧を取得
 *
 * @param options - 検索条件やページネーション設定
 * @returns ブログ記事一覧
 */
export async function fetchBlogPosts(options?: {
  limit?: number;
  page?: number;
  status?: "draft" | "published";
}): Promise<PayloadResponse<BlogPost>> {
  const params = new URLSearchParams();

  if (options?.limit) {
    params.append("limit", options.limit.toString());
  }

  if (options?.page) {
    params.append("page", options.page.toString());
  }

  if (options?.status) {
    params.append("where[status][equals]", options.status);
  }

  const url = `${API_URL}/api/posts?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`記事の取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 特定のスラッグのブログ記事を取得
 *
 * @param slug - 記事のスラッグ
 * @returns ブログ記事
 */
export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const url = `${API_URL}/api/posts?where[slug][equals]=${slug}&limit=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`記事の取得に失敗しました: ${response.statusText}`);
  }

  const data: PayloadResponse<BlogPost> = await response.json();

  return data.docs[0] || null;
}

/**
 * ブログ記事をIDで取得
 *
 * @param id - 記事のID
 * @returns ブログ記事
 */
export async function fetchBlogPostById(id: string): Promise<BlogPost> {
  const url = `${API_URL}/api/posts/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`記事の取得に失敗しました: ${response.statusText}`);
  }

  return response.json();
}
