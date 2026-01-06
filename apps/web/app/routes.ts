import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { redirect } from "react-router";

export default [
  index("routes/home.tsx"),
  route("personal", "routes/personal/index.tsx"),
  route("personal/:slug", "routes/personal/$slug.tsx"),
  route("tech", "routes/tech/index.tsx"),
  route("tech/:slug", "routes/tech/$slug.tsx"),
  // route("products", "routes/products.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
