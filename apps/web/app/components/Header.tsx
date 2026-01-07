import { useState } from "react";
import { Link } from "react-router";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { to: "/", label: "Home" },
    { to: "/tech", label: "Tech" },
    { to: "/personal", label: "Personal" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold hover:text-gray-600 transition-colors"
          >
            kou234ポートフォリオ
          </Link>

          {/* デスクトップナビゲーション */}
          <ul className="hidden md:flex gap-8">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="hover:text-gray-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ハンバーガーメニューボタン (モバイル) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="メニューを開く"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-gray-900 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-gray-900 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-gray-900 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* モバイルメニュー */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-4 pb-4">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-4 hover:bg-gray-100 rounded-md transition-colors font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
