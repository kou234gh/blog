import { Link } from "react-router";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold  hover: transition-colors">
            kou234ポートフォリオ
          </Link>
          <ul className="flex gap-8">
            <li>
              <Link to="/" className=" hover: transition-colors font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/tech"
                className=" hover: transition-colors font-medium"
              >
                Tech
              </Link>
            </li>
            <li>
              <Link
                to="/personal"
                className=" hover: transition-colors font-medium"
              >
                Personal
              </Link>
            </li>
            {/* <li>
              <Link
                to="/products"
                className=" hover: transition-colors font-medium"
              >
                Products
              </Link>
            </li> */}
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
