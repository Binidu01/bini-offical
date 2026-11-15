import React from 'react'
import './globals.css'

const SITE_URL = 'https://bini.js.org/'
const TITLE = 'React for Cross-Platform'
const DESCRIPTION =
  'One codebase. Six platforms, Write React, ship everywhere.'
const KEYWORDS = [
  'Bini.js',
  'Bini',
  'bini',
  'bini.js',
  'Bini framework',
  'bini framework',
  'Bini.js framework',
  'bini.js framework',
  'React framework',
  'cross-platform React',
  'cross-platform framework',
  'React SPA framework',
  'zero-config React',
  'full-stack React',
  'meta-framework',
  'modern web framework',
  'file-based routing',
  'Hono API',
  'API routes',
  'SPA',
  'single page application',
  'cross-platform',
  'native apps',
  'native desktop',
  'native mobile',
  'Windows app',
  'macOS app',
  'Linux app',
  'Android app',
  'iOS app',
  'Tauri',
  'desktop application',
  'mobile application',
  'native binary',
  'single codebase',
  'write once run anywhere',
  'Vite',
  'React',
  'TypeScript',
  'JavaScript',
  'Rust',
  'Tailwind CSS',
  'CSS Modules',
  'Oxlint',
  'Oxfmt',
  'Rolldown',
  'deployment',
  'edge functions',
  'Cloudflare Workers',
  'Vercel',
  'Netlify',
  'Deno',
  'Bun',
  'Node.js',
  'static export',
  'SPA deployment',
  'bini-router',
  'bini-env',
  'bini-native',
  'bini-server',
  'bini-overlay',
  'bini-export',
  'create-bini-app',
  'developer experience',
  'DX',
  'zero config',
  'fast development',
  'HMR',
  'hot module replacement',
  'build tool',
  'frontend framework',
  'full-stack framework',
  'open source framework',
  'MIT licensed',
  'Binidu Ranasinghe',
]
const OG_IMAGE = `${SITE_URL}og-image.png`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      name: 'Bini.js',
      alternateName: 'Bini',
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}#software`,
      name: 'Bini.js',
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web, Windows, macOS, Linux, Android, iOS',
      license: 'https://opensource.org/licenses/MIT',
      codeRepository: 'https://github.com/Binidu01/bini-cli',
      author: {
        '@type': 'Organization',
        name: 'Bini-Cooperations',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Bini-Cooperations',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ],
}

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('bini-theme');
      var isDark = false;
      
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        // Default to system
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
        document.documentElement.style.backgroundColor = '#000000';
        if (document.body) {
          document.body.style.backgroundColor = '#000000';
        }
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        document.documentElement.style.backgroundColor = '#ffffff';
        if (document.body) {
          document.body.style.backgroundColor = '#ffffff';
        }
      }
    } catch (e) {}
  })();
`

export const document = {
  head: (
    <>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta name="keywords" content={KEYWORDS.join(', ')} />
      <meta name="author" content="Bini-Cooperations" />
      <meta name="theme-color" content="#00CFFF" />
      <link rel="canonical" href={SITE_URL} />

      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Bini.js" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Bini.js by Bini-Cooperations" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:creator" content="@binidu01" />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content="Bini.js by Bini-Cooperations" />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Theme Initialization Script */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </>
  ),
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal?: React.ReactNode
}) {
  return (
    <React.Fragment>
      {children}
      {modal}
    </React.Fragment>
  )
}