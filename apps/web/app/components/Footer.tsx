export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className=" text-sm">
            © {new Date().getFullYear()} Engineering Portfolio. Built with React
            Router v7 & Cloudflare Workers.
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/kou234gh"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover: transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/kou234t"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover: transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
