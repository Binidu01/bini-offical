export type SearchSuggestion = {
  label: string
  path?: string
  href?: string
  type: string
  keywords?: string[]
}

export const searchSuggestions: SearchSuggestion[] = [
  // ─── Docs · Getting Started ─────────────────────────────────────────
  { label: 'Introduction', path: '/docs', type: 'docs', keywords: ['start', 'begin', 'intro', 'guide', 'overview'] },
  { label: 'Installation', path: '/docs/installation', type: 'docs', keywords: ['install', 'setup', 'npm', 'create-bini-app'] },
  { label: 'Project Structure', path: '/docs/project-structure', type: 'docs', keywords: ['structure', 'folders', 'files', 'organization'] },
  { label: 'Layouts and Pages', path: '/docs/layouts-and-pages', type: 'docs', keywords: ['layout', 'pages', 'nested', 'structure'] },
  { label: 'Linking and Navigating', path: '/docs/linking-and-navigating', type: 'docs', keywords: ['link', 'navigation', 'router', 'navigate'] },

  // ─── Docs · Defining Routes ─────────────────────────────────────────
  { label: 'Folder-Based Routing', path: '/docs/folder-based-routing', type: 'docs', keywords: ['folder', 'directory', 'structure', 'routing'] },
  { label: 'File-Based Routing', path: '/docs/file-based-routing', type: 'docs', keywords: ['file', 'pages', 'routes', 'flat'] },
  { label: 'Dynamic Routes', path: '/docs/dynamic-routes', type: 'docs', keywords: ['dynamic', 'params', 'slug', 'id'] },
  { label: 'Parallel Routes', path: '/docs/parallel-routes', type: 'docs', keywords: ['parallel', 'slot', 'named', 'routes'] },
  { label: 'Catch-All Routes', path: '/docs/catch-all-routes', type: 'docs', keywords: ['catch-all', 'wildcard', 'slug', 'rest'] },
  { label: 'MDX & Markdown Pages', path: '/docs/mdx-markdown', type: 'docs', keywords: ['mdx', 'markdown', 'content', 'md'] },

  // ─── Docs · Special Files ───────────────────────────────────────────
  { label: 'Loading UI', path: '/docs/load', type: 'docs', keywords: ['loading', 'suspense', 'fallback', 'ui'] },
  { label: 'Error Boundaries', path: '/docs/error-boundaries', type: 'docs', keywords: ['error', 'boundary', 'crash', 'reset'] },
  { label: 'Template', path: '/docs/templates', type: 'docs', keywords: ['template', 'transition', 'wrapper'] },
  { label: 'Default', path: '/docs/defaults', type: 'docs', keywords: ['default', 'fallback', 'slot', 'parallel'] },
  { label: 'Not Found', path: '/docs/notfound', type: 'docs', keywords: ['404', 'not found', 'error page'] },

  // ─── Docs · Metadata ────────────────────────────────────────────────
  { label: 'Metadata & SEO', path: '/docs/metadata', type: 'docs', keywords: ['metadata', 'seo', 'title', 'description'] },
  { label: 'Open Graph & Twitter', path: '/docs/og-twitter', type: 'docs', keywords: ['og', 'open graph', 'twitter', 'social', 'card'] },
  { label: 'Icons & Favicons', path: '/docs/icons', type: 'docs', keywords: ['icons', 'favicon', 'apple touch', 'manifest'] },

  // ─── Docs · API Routes ──────────────────────────────────────────────
  { label: 'API Routes Overview', path: '/docs/api-routes', type: 'docs', keywords: ['api', 'routes', 'endpoints', 'overview'] },
  { label: 'Plain Function Handlers', path: '/docs/api-plain', type: 'docs', keywords: ['handlers', 'functions', 'plain', 'request'] },
  { label: 'Hono Integration', path: '/docs/api-hono', type: 'docs', keywords: ['hono', 'integration', 'middleware', 'framework'] },
  { label: 'Dynamic API Routes', path: '/docs/api-dynamic', type: 'docs', keywords: ['dynamic', 'api', 'params', 'rest'] },
  { label: 'CORS', path: '/docs/api-cors', type: 'docs', keywords: ['cors', 'cross-origin', 'preflight', 'headers'] },

  // ─── Docs · Environment Variables ───────────────────────────────────
  { label: 'Environment Variables', path: '/docs/environment-variables', type: 'docs', keywords: ['.env', 'environment', 'variables', 'secrets'] },
  { label: 'Prefixes & Client Exposure', path: '/docs/env-prefixes', type: 'docs', keywords: ['bini_', 'vite_', 'prefix', 'client'] },
  { label: 'Using in API Routes', path: '/docs/env-api', type: 'docs', keywords: ['getenv', 'requireenv', 'hono context'] },

  // ─── Docs · Styling ─────────────────────────────────────────────────
  { label: 'CSS Overview', path: '/docs/css', type: 'docs', keywords: ['css', 'styling', 'overview', 'styles'] },
  { label: 'Tailwind CSS', path: '/docs/tailwind', type: 'docs', keywords: ['tailwind', 'css', 'utility', 'classes'] },
  { label: 'CSS Modules', path: '/docs/css-modules', type: 'docs', keywords: ['modules', 'css', 'scoped', 'styles'] },

  // ─── Docs · Platforms ───────────────────────────────────────────────
  { label: 'Web Platform', path: '/docs/platform-web', type: 'docs', keywords: ['web', 'platform', 'spa', 'browser'] },
  { label: 'Windows Platform', path: '/docs/platform-windows', type: 'docs', keywords: ['windows', 'desktop', 'tauri', 'webview2'] },
  { label: 'macOS Platform', path: '/docs/platform-macos', type: 'docs', keywords: ['macos', 'mac', 'desktop', 'tauri', 'wkwebview'] },
  { label: 'Linux Platform', path: '/docs/platform-linux', type: 'docs', keywords: ['linux', 'desktop', 'tauri', 'appimage', 'webkitgtk'] },
  { label: 'Android Platform', path: '/docs/platform-android', type: 'docs', keywords: ['android', 'mobile', 'apk', 'tauri'] },
  { label: 'iOS Platform', path: '/docs/platform-ios', type: 'docs', keywords: ['ios', 'mobile', 'xcode', 'tauri', 'wkwebview'] },

  // ─── Docs · Deployment ──────────────────────────────────────────────
  { label: 'Deployment Overview', path: '/docs/deploying', type: 'docs', keywords: ['deploy', 'deployment', 'production', 'hosting'] },
  { label: 'Production Server', path: '/docs/production-server', type: 'docs', keywords: ['bini-server', 'production', 'node', 'etag'] },
  { label: 'Static Export', path: '/docs/static-export', type: 'docs', keywords: ['static', 'export', 'spa', 'build', 'bini-ssg'] },
  { label: 'Hosting Providers', path: '/docs/hosting', type: 'docs', keywords: ['bini-deploy', 'netlify', 'vercel', 'cloudflare', 'deno'] },

  // ─── Plugins ────────────────────────────────────────────────────────
  { label: 'Plugins Overview', path: '/plugins', type: 'plugin', keywords: ['plugins', 'ecosystem', 'packages'] },
  { label: 'create-bini-app', path: '/plugins/create-bini-app', type: 'plugin', keywords: ['create', 'bini', 'app', 'scaffold', 'cli'] },
  { label: 'bini-deploy', path: '/plugins/bini-deploy', type: 'plugin', keywords: ['deploy', 'hosting', 'cli', 'github'] },
  { label: 'bini-router', path: '/plugins/bini-router', type: 'plugin', keywords: ['router', 'routing', 'file-based', 'api', 'hono', 'vite', 'mdx'] },
  { label: 'bini-env', path: '/plugins/bini-env', type: 'plugin', keywords: ['env', 'environment', 'variables', 'secrets', 'getenv', 'requireenv', 'hono'] },
  { label: 'bini-native', path: '/plugins/bini-native', type: 'plugin', keywords: ['native', 'tauri', 'plugin', 'wiring', 'rust', 'cargo', 'android', 'ios', 'desktop', 'mobile'] },
  { label: 'bini-server', path: '/plugins/bini-server', type: 'plugin', keywords: ['server', 'production', 'static', 'etag', 'spa'] },
  { label: 'bini-overlay', path: '/plugins/bini-overlay', type: 'plugin', keywords: ['overlay', 'error', 'loading', 'development', 'badge'] },
  { label: 'bini-ssg', path: '/plugins/bini-ssg', type: 'plugin', keywords: ['ssg', 'static', 'pre-render', 'build', 'shell pages', 'hydration'] },

  // ─── Vite / Hono ecosystem ──────────────────────────────────────────
  { label: '@vitejs/plugin-react', path: '/plugins', type: 'plugin', keywords: ['react', 'fast refresh', 'vite'] },
  { label: '@tailwindcss/vite', path: '/plugins', type: 'plugin', keywords: ['tailwind', 'css', 'vite', 'styling'] },
  { label: 'vite-plugin-pwa', path: '/plugins', type: 'plugin', keywords: ['pwa', 'service worker', 'offline', 'manifest'] },
  { label: 'vite-plugin-svgr', path: '/plugins', type: 'plugin', keywords: ['svg', 'react components', 'transform', 'import'] },
  { label: 'vite-plugin-compression', path: '/plugins', type: 'plugin', keywords: ['compression', 'gzip', 'brotli', 'bundle'] },
  { label: 'rollup-plugin-visualizer', path: '/plugins', type: 'plugin', keywords: ['visualizer', 'bundle', 'analysis', 'size'] },
  { label: 'hono/cors', path: '/plugins', type: 'plugin', keywords: ['cors', 'cross-origin', 'middleware', 'hono'] },
  { label: 'hono/jwt', path: '/plugins', type: 'plugin', keywords: ['jwt', 'authentication', 'token', 'auth', 'hono'] },
  { label: 'hono/logger', path: '/plugins', type: 'plugin', keywords: ['logger', 'logging', 'requests', 'hono'] },
  { label: '@hono/zod-validator', path: '/plugins', type: 'plugin', keywords: ['zod', 'validation', 'validator', 'schema', 'hono'] },

  // ─── Top-level pages ────────────────────────────────────────────────
  { label: 'Showcase', path: '/showcase', type: 'page', keywords: ['showcase', 'sites', 'apps', 'built with', 'examples', 'projects'] },
  { label: 'Home', path: '/', type: 'page', keywords: ['home', 'landing'] },

  // ─── External ───────────────────────────────────────────────────────
  { label: 'GitHub Repository', href: 'https://github.com/Binidu01/bini-cli', type: 'github', keywords: ['repo', 'source', 'code'] },
  { label: 'Issues', href: 'https://github.com/Binidu01/bini-cli/issues', type: 'github', keywords: ['bugs', 'problems', 'report'] },
  { label: 'Discussions', href: 'https://github.com/Binidu01/bini-cli/discussions', type: 'github', keywords: ['community', 'forum', 'questions'] },
  { label: 'Contributing', href: 'https://github.com/Binidu01/bini-cli/blob/main/CONTRIBUTING.md', type: 'github', keywords: ['contribute', 'development', 'guidelines'] },
  { label: 'Releases', href: 'https://github.com/Binidu01/bini-cli/releases', type: 'github', keywords: ['releases', 'changelog', 'versions'] },
  { label: 'npm Package', href: 'https://www.npmjs.com/package/create-bini-app', type: 'package', keywords: ['npm', 'package', 'install'] },
]
