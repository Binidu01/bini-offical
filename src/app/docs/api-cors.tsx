// src/app/docs/api-cors.tsx
import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  P,
  Section,
  Table,
  useDocLang,
} from '../../components/DocBlocks'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'what-is-cors', label: 'What is CORS?' },
  { id: 'default-config', label: 'Default Configuration' },
  { id: 'disabling-cors', label: 'Disabling CORS' },
  { id: 'cors-with-hono', label: 'CORS with Hono' },
  { id: 'custom-cors', label: 'Custom CORS Configuration' },
  { id: 'production-deployment', label: 'Production Deployment' },
]

function Content() {
  const lang = useDocLang()
  const s = lang === 'js' ? 'js' : 'ts'
  const cfg = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="what-is-cors" title="What is CORS?">
        <P>
          Cross-Origin Resource Sharing (CORS) is a browser security feature that restricts web
          pages from making requests to a different origin than the one that served the page. CORS
          headers let servers specify which origins may access their resources.
        </P>
        <P>
          Bini.js includes built-in CORS support for API routes, so you can expose APIs to other
          origins without extra setup.
        </P>
      </Section>

      <Section id="default-config" title="Default Configuration">
        <P>
          CORS is enabled by default for all API routes in dev and preview. The default
          configuration includes:
        </P>
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <ul className="space-y-2 text-[14px] text-neutral-600 dark:text-neutral-400">
            <li>
              <strong className="text-black dark:text-white">Access-Control-Allow-Origin:</strong>{' '}
              <C>*</C> (all origins)
            </li>
            <li>
              <strong className="text-black dark:text-white">Access-Control-Allow-Methods:</strong>{' '}
              <C>GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD</C>
            </li>
            <li>
              <strong className="text-black dark:text-white">Access-Control-Allow-Headers:</strong>{' '}
              <C>Content-Type, Authorization, X-Request-ID</C>
            </li>
            <li>
              <strong className="text-black dark:text-white">Access-Control-Max-Age:</strong>{' '}
              <C>86400</C> (24 hours for preflight requests)
            </li>
          </ul>
        </div>
        <Callout>
          This default works for most development and production scenarios. Customize it to restrict
          origins or allow specific headers when needed.
        </Callout>
      </Section>

      <Section id="disabling-cors" title="Disabling CORS">
        <P>
          Disable CORS by setting <C>cors: false</C> in your <C>biniroute()</C> configuration:
        </P>
        <CodeBlock
          filename={`vite.config.${cfg}`}
          tsCode={`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    react(),
    biniroute({
      cors: false, // Disable CORS for all API routes
    }),
  ],
})`}
          jsCode={`// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    react(),
    biniroute({
      cors: false, // Disable CORS for all API routes
    }),
  ],
})`}
        />
        <Callout>
          Disabling CORS is useful for internal APIs or when CORS is handled at the infrastructure
          level (reverse proxy or CDN).
        </Callout>
      </Section>

      <Section id="cors-with-hono" title="CORS with Hono">
        <P>
          With Hono you can configure CORS per route or globally using Hono&apos;s <C>cors</C>{' '}
          middleware:
        </P>
        <CodeBlock
          filename={`src/app/api/users.${s}`}
          tsCode={`// src/app/api/users.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Global CORS for all routes in this file
app.use(
  '*',
  cors({
    origin: 'https://myapp.com',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
)

app.get('/users', (c) => c.json({ users: [] }))
app.post('/users', async (c) => c.json({ created: await c.req.json() }, 201))

export default app`}
          jsCode={`// src/app/api/users.js
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Global CORS for all routes in this file
app.use(
  '*',
  cors({
    origin: 'https://myapp.com',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
)

app.get('/users', (c) => c.json({ users: [] }))
app.post('/users', async (c) => c.json({ created: await c.req.json() }, 201))

export default app`}
        />
        <CodeBlock
          filename={`src/app/api/public.${s}`}
          tsCode={`// src/app/api/public.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Route-specific CORS
app.use(
  '/public/*',
  cors({
    origin: '*', // Public API allows all origins
  })
)

app.get('/public/data', (c) => c.json({ data: 'Public data' }))

// Protected route with strict CORS
app.use(
  '/private/*',
  cors({
    origin: 'https://admin.myapp.com',
    allowMethods: ['GET'],
    credentials: true,
  })
)

app.get('/private/admin', (c) => c.json({ data: 'Admin only' }))

export default app`}
          jsCode={`// src/app/api/public.js
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Route-specific CORS
app.use(
  '/public/*',
  cors({
    origin: '*', // Public API allows all origins
  })
)

app.get('/public/data', (c) => c.json({ data: 'Public data' }))

// Protected route with strict CORS
app.use(
  '/private/*',
  cors({
    origin: 'https://admin.myapp.com',
    allowMethods: ['GET'],
    credentials: true,
  })
)

app.get('/private/admin', (c) => c.json({ data: 'Admin only' }))

export default app`}
        />
        <Table
          headers={['Option', 'Type', 'Description']}
          rows={[
            ['origin', 'string | string[] | "*"', 'Allowed origins (default: "*")'],
            ['allowMethods', 'string[]', 'Allowed HTTP methods'],
            ['allowHeaders', 'string[]', 'Allowed request headers'],
            ['maxAge', 'number', 'Preflight cache duration in seconds'],
            ['credentials', 'boolean', 'Allow credentials (cookies, auth)'],
            ['exposeHeaders', 'string[]', 'Headers exposed to the browser'],
          ]}
        />
      </Section>

      <Section id="custom-cors" title="Custom CORS Configuration">
        <P>
          For more control, implement custom CORS handling in your API routes:
        </P>
        <CodeBlock
          filename={`src/app/api/custom.${s}`}
          tsCode={`// src/app/api/custom.ts
import { Hono } from 'hono'

const app = new Hono()

// Custom CORS middleware
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin')
  const allowedOrigins = ['https://myapp.com', 'https://staging.myapp.com']

  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
    c.header('Access-Control-Allow-Credentials', 'true')
  }

  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.header('Access-Control-Max-Age', '86400')
    return c.text('', 204)
  }

  await next()
})

app.get('/custom/data', (c) => c.json({ data: 'Custom CORS' }))

export default app`}
          jsCode={`// src/app/api/custom.js
import { Hono } from 'hono'

const app = new Hono()

// Custom CORS middleware
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin')
  const allowedOrigins = ['https://myapp.com', 'https://staging.myapp.com']

  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
    c.header('Access-Control-Allow-Credentials', 'true')
  }

  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.header('Access-Control-Max-Age', '86400')
    return c.text('', 204)
  }

  await next()
})

app.get('/custom/data', (c) => c.json({ data: 'Custom CORS' }))

export default app`}
        />
        <Callout>
          Custom CORS handling gives full control over headers and supports advanced cases like
          dynamic origin validation.
        </Callout>
      </Section>

      <Section id="production-deployment" title="Production Deployment">
        <P>
          The same CORS configuration applies in production. Platform notes:
        </P>
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <ul className="space-y-2 text-[14px] text-neutral-600 dark:text-neutral-400">
            <li>
              <strong className="text-black dark:text-white">bini-server (Node.js):</strong> Uses
              the CORS config from your <C>vite.config</C>
            </li>
            <li>
              <strong className="text-black dark:text-white">Netlify Edge Functions:</strong> Uses
              the CORS headers set in your Hono app
            </li>
            <li>
              <strong className="text-black dark:text-white">Vercel Edge:</strong> Uses the CORS
              headers set in your Hono app
            </li>
            <li>
              <strong className="text-black dark:text-white">Cloudflare Workers:</strong> Uses the
              CORS headers set in your Hono app
            </li>
          </ul>
        </div>
        <Callout>
          In production, prefer specific origins over <C>*</C>. Never combine wildcard CORS with
          credentials.
        </Callout>
      </Section>
    </>
  )
}

export default function ApiCorsPage() {
  return (
    <DocPage
      title="CORS"
      description="Configure Cross-Origin Resource Sharing (CORS) for your API routes."
      url="https://bini.js.org/docs/api-cors"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/api-cors.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/api-dynamic', title: 'Dynamic API Routes' }}
      next={{ to: '/docs/environment-variables', title: 'Environment Variables' }}
    >
      <Content />
    </DocPage>
  )
}