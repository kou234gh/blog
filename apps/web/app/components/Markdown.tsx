import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MarkdownCustom = (props: { children: string }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
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
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
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
        li: ({ children }) => <li className="mb-2 [&>p]:inline">{children}</li>,
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
      {props.children}
    </Markdown>
  );
};
