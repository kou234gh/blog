import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog/index.tsx"),
  route("blog/:slug", "routes/blog/$slug.tsx"),
  route("products", "routes/products.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
