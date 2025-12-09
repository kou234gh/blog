import { Link } from "react-router";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold  hover: transition-colors">
            Engineering Portfolio
          </Link>
          <ul className="flex gap-8">
            <li>
              <Link to="/" className=" hover: transition-colors font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className=" hover: transition-colors font-medium"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className=" hover: transition-colors font-medium"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className=" hover: transition-colors font-medium"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
