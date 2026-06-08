import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Override-able so the same code can be built at a nested path (e.g. the
// redesign preview served from /PensionBridge/redesign). Falls back to the
// production default when unset.
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? "/PensionBridge" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
};

export default nextConfig;
