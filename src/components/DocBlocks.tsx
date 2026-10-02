// src/components/DocBlocks.tsx
// Shared building blocks for every docs page. Fonts come from global.css only.
import { AnimatePresence, m } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  siCss,
  siDotenv,
  siGithub,
  siHtml5,
  siJavascript,
  siReact,
  siSass,
  siTypescript,
  siVite,
} from 'simple-icons'

import { CopyPageButton } from './CopyPageButton'
import { DocLayout } from './DocSidebar'
import { DocsFeedback } from './FeedBack'
import { Header, Footer } from './Layout'
import { TableOfContents, type TocItem } from './TableOfContents'

/* ------------------------------------------------------------------ */
/* Syntax highlighting                                                 */
/* ------------------------------------------------------------------ */

const DARK = {
  keyword: '#569CD6',
  controlKeyword: '#C586C0',
  string: '#CE9178',
  number: '#B5CEA8',
  comment: '#6A9955',
  function: '#DCDCAA',
  type: '#4EC9B0',
  variable: '#9CDCFE',
  constant: '#4FC1FF',
  plain: '#D4D4D4',
  builtin: '#4EC9B0',
  prompt: '#89D185',
}
const LIGHT: typeof DARK = {
  keyword: '#0000FF',
  controlKeyword: '#AF00DB',
  string: '#A31515',
  number: '#098658',
  comment: '#008000',
  function: '#795E26',
  type: '#267F99',
  variable: '#001080',
  constant: '#0000FF',
  plain: '#000000',
  builtin: '#267F99',
  prompt: '#098658',
}
type Theme = typeof DARK
type Token = { text: string; color: string }
export type CodeLang =
  | 'js'
  | 'css'
  | 'json'
  | 'yaml'
  | 'toml'
  | 'html'
  | 'dockerfile'
  | 'shell'
  | 'env'
  | 'text'
type Push = (text: string, color: string) => void

function collector() {
  const out: Token[] = []
  const push: Push = (text, color) => {
    if (!text) return
    const last = out[out.length - 1]
    if (last?.color === color) last.text += text
    else out.push({ text, color })
  }
  return { out, push }
}

const WORD_KIND = new Map<string, keyof Theme>()
const addWords = (kind: keyof Theme, words: string) =>
  words.split(' ').forEach((w) => WORD_KIND.set(w, kind))
addWords(
  'keyword',
  'import export from default const let var function return class extends new this super typeof instanceof in of as is'
)
addWords(
  'controlKeyword',
  'if else for while do switch case break continue try catch finally throw async await yield'
)
addWords('constant', 'true false null undefined NaN Infinity')
addWords(
  'builtin',
  'console Math JSON Object Array String Number Boolean Promise Date RegExp Error Map Set Symbol'
)

/* ---- JS / TS / JSX ---- */

const JS_TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:\\[\s\S]|[^"\\])*(?:"|$)|'(?:\\[\s\S]|[^'\\])*(?:'|$)|`(?:\\[\s\S]|[^`\\])*(?:`|$))|(\d[0-9._a-fA-FxX]*)|([A-Za-z_$][A-Za-z0-9_$]*)/g
const CALL = / *\(/y

function highlightJs(code: string, t: Theme): Token[] {
  const { out, push } = collector()
  let pos = 0
  for (const match of code.matchAll(JS_TOKEN)) {
    const [text, comment, str, num, word] = match
    const start = match.index!
    push(code.slice(pos, start), t.plain)
    pos = start + text.length
    if (comment) push(text, t.comment)
    else if (str) push(text, t.string)
    else if (num) push(text, t.number)
    else if (word) {
      const kind = WORD_KIND.get(word)
      CALL.lastIndex = pos
      if (kind) push(word, t[kind])
      else if (/^[A-Z]/.test(word)) push(word, t.type)
      else if (CALL.test(code)) push(word, t.function)
      else push(word, t.variable)
    }
  }
  push(code.slice(pos), t.plain)
  return out
}

/* ---- CSS / SCSS ---- */

const CSS_SEL =
  /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[\w-]+)|([.#][\w-]+|::?[\w-]+)|(-?\d*\.?\d+[a-zA-Z%]*)|(-?[A-Za-z_][\w-]*)|([\s\S])/g
const CSS_VAL =
  /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#[0-9a-fA-F]{3,8}\b)|(-?\d*\.?\d+[a-zA-Z%]*)|(--[\w-]+)|(-?[A-Za-z_][\w-]*)(\()?|(!important)|([\s\S])/g

function cssPrelude(seg: string, atRule: boolean, t: Theme, push: Push) {
  let depth = 0
  for (const m of seg.matchAll(CSS_SEL)) {
    const [text, comment, str, at, sel, num, word] = m
    if (comment) push(text, t.comment)
    else if (str) push(text, t.string)
    else if (at) push(text, t.controlKeyword)
    else if (sel) push(text, t.function)
    else if (num) push(text, t.number)
    else if (word) push(text, depth > 0 ? t.variable : atRule ? t.function : t.keyword)
    else {
      if (text === '(') depth++
      else if (text === ')') depth = Math.max(0, depth - 1)
      push(text, t.plain)
    }
  }
}

function cssDeclaration(seg: string, t: Theme, push: Push) {
  let colon = -1
  let depth = 0
  for (let j = 0; j < seg.length; j++) {
    const c = seg[j]
    if (c === '(') depth++
    else if (c === ')') depth--
    else if (c === ':' && depth === 0) {
      colon = j
      break
    }
  }
  if (colon < 0) {
    push(seg, t.plain)
    return
  }
  push(seg.slice(0, colon), t.variable)
  push(':', t.plain)
  for (const m of seg.slice(colon + 1).matchAll(CSS_VAL)) {
    const [text, comment, str, hex, num, cssVar, word, paren, important] = m
    if (comment) push(text, t.comment)
    else if (str) push(text, t.string)
    else if (hex || num) push(text, t.number)
    else if (cssVar) push(text, t.variable)
    else if (word) {
      if (paren) {
        push(word, t.function)
        push('(', t.plain)
      } else push(word, t.string)
    } else if (important) push(text, t.keyword)
    else push(text, t.plain)
  }
}

function highlightCss(code: string, t: Theme): Token[] {
  const { out, push } = collector()
  const n = code.length
  const scan = (from: number) => {
    let j = from
    while (j < n) {
      const ch = code[j]
      if (ch === '"' || ch === "'") {
        j++
        while (j < n && code[j] !== ch) {
          if (code[j] === '\\') j++
          j++
        }
        j++
        continue
      }
      if (ch === '/' && code[j + 1] === '*') {
        const e = code.indexOf('*/', j + 2)
        j = e < 0 ? n : e + 2
        continue
      }
      if (ch === '(') {
        let d = 1
        j++
        while (j < n && d > 0) {
          if (code[j] === '(') d++
          else if (code[j] === ')') d--
          j++
        }
        continue
      }
      if (ch === '{' || ch === ';' || ch === '}') return j
      j++
    }
    return n
  }
  let i = 0
  while (i < n) {
    const ch = code[i]
    if (/\s/.test(ch)) {
      push(ch, t.plain)
      i++
      continue
    }
    if (ch === '/' && code[i + 1] === '*') {
      const e = code.indexOf('*/', i + 2)
      const end = e < 0 ? n : e + 2
      push(code.slice(i, end), t.comment)
      i = end
      continue
    }
    if (ch === '/' && code[i + 1] === '/') {
      let end = code.indexOf('\n', i)
      if (end < 0) end = n
      push(code.slice(i, end), t.comment)
      i = end
      continue
    }
    if (ch === '{' || ch === '}' || ch === ';') {
      push(ch, t.plain)
      i++
      continue
    }
    const end = scan(i)
    const seg = code.slice(i, end)
    const atRule = ch === '@'
    if (atRule || code[end] === '{') cssPrelude(seg, atRule, t, push)
    else cssDeclaration(seg, t, push)
    i = end
  }
  return out
}

/* ---- JSON ---- */

const JSON_TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([\s\S])/g

function highlightJson(code: string, t: Theme): Token[] {
  const { out, push } = collector()
  for (const m of code.matchAll(JSON_TOKEN)) {
    const [text, str, colon, num, word] = m
    if (str) {
      push(str, colon ? t.variable : t.string)
      if (colon) push(colon, t.plain)
    } else if (num) push(text, t.number)
    else if (word) push(text, t.constant)
    else push(text, t.plain)
  }
  return out
}

/* ---- YAML ---- */

const YAML_VALUE = /(\$\{\{[^}]*\}\})|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|([^"'$]+|\$)/g
const YAML_KEY = /^(\s*)((?:-\s+)*)([\w.\/-]+|"[^"]*"|'[^']*')(\s*:)(\s+|$)([\s\S]*)$/

function yamlValue(v: string, t: Theme, push: Push) {
  const trimmed = v.trim()
  if (/^(true|false|null|~)$/i.test(trimmed)) return push(v, t.constant)
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return push(v, t.number)
  for (const m of v.matchAll(YAML_VALUE)) {
    const [text, expr] = m
    push(text, expr ? t.controlKeyword : t.string)
  }
}

function highlightYaml(code: string, t: Theme): Token[] {
  const { out, push } = collector()
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    const c = /(^|\s)#/.exec(line)
    const ci = c ? c.index + c[1].length : -1
    const body = ci >= 0 ? line.slice(0, ci) : line
    const km = body.match(YAML_KEY)
    if (km) {
      push(km[1] + km[2], t.plain)
      push(km[3], t.variable)
      push(km[4], t.plain)
      push(km[5], t.plain)
      yamlValue(km[6], t, push)
    } else {
      const lm = body.match(/^(\s*-\s+)([\s\S]*)$/)
      if (lm) {
        push(lm[1], t.plain)
        yamlValue(lm[2], t, push)
      } else if (body.trim() === '') push(body, t.plain)
      else yamlValue(body, t, push)
    }
    if (ci >= 0) push(line.slice(ci), t.comment)
    if (idx < lines.length - 1) push('\n', t.plain)
  })
  return out
}

/* ---- TOML ---- */

const TOML_VALUE = /("(?:\\.|[^"\\])*"|'[^']*')|(-?\d+(?:\.\d+)?)|\b(true|false)\b|([\s\S])/g

function highlightToml(code: string, t: Theme): Token[] {
  const { out, push } = collector()
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    const c = /(^|\s)#/.exec(line)
    const ci = c ? c.index + c[1].length : -1
    const body = ci >= 0 ? line.slice(0, ci) : line
    const section = body.match(/^(\s*)(\[\[?[^\]]+\]\]?)(\s*)$/)
    const kv = body.match(/^(\s*)([\w."'-]+)(\s*=\s*)([\s\S]*)$/)
    if (section) {
      push(section[1], t.plain)
      push(section[2], t.type)
      push(section[3], t.plain)
    } else if (kv) {
      push(kv[1], t.plain)
      push(kv[2], t.variable)
      push(kv[3], t.plain)
      for (const m of kv[4].matchAll(TOML_VALUE)) {
        const [text, str, num, bool] = m
        if (str) push(text, t.string)
        else if (num) push(text, t.number)
        else if (bool) push(text, t.constant)
        else push(text, t.plain)
      }
    } else push(body, t.plain)
    if (ci >= 0) push(line.slice(ci), t.comment)
    if (idx < lines.length - 1) push('\n', t.plain)
  })
  return out
}

/* ---- HTML ---- */

const HTML_TAG = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g
const HTML_ATTR = /(\s+)|("[^"]*"|'[^']*')|(=)|([^\s="'=]+)/g

function htmlTag(tag: string, t: Theme, push: Push) {
  const m = tag.match(/^(<\/?)([A-Za-z][^\s\/>]*)([\s\S]*?)(\/?>)$/)
  if (!m) return push(tag, t.plain)
  push(m[1], t.plain)
  push(m[2], t.keyword)
  let afterEq = false
  for (const a of m[3].matchAll(HTML_ATTR)) {
    const [text, ws, str, eq] = a
    if (ws) push(text, t.plain)
    else if (str) {
      push(text, t.string)
      afterEq = false
    } else if (eq) {
      push(text, t.plain)
      afterEq = true
    } else {
      push(text, afterEq ? t.string : t.variable)
      afterEq = false
    }
  }
  push(m[4], t.plain)
}

function highlightHtml(code: string, t: Theme): Token[] {
  const { out, push } = collector()
  const tagRe = new RegExp(HTML_TAG.source, 'g')
  let pos = 0
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(code))) {
    push(code.slice(pos, m.index), t.plain)
    const s = m[0]
    pos = m.index + s.length
    if (s.startsWith('<!--')) push(s, t.comment)
    else htmlTag(s, t, push)
    if (/^<script\b/i.test(s) && !s.endsWith('/>')) {
      const end = code.indexOf('</script', pos)
      if (end >= 0) {
        for (const tok of highlightJs(code.slice(pos, end), t)) push(tok.text, tok.color)
        pos = end
        tagRe.lastIndex = end
      }
    }
  }
  push(code.slice(pos), t.plain)
  return out
}

/* ---- Dockerfile ---- */

const DOCKER_INSTRUCTION =
  /^(\s*)(FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b([\s\S]*)$/i
const DOCKER_REST = /("(?:\\.|[^"\\])*"|'[^']*')|(\bAS\b)|([\s\S])/gi

function highlightDockerfile(code: string, t: Theme): Token[] {
  const { out, push } = collector()
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('#')) push(line, t.comment)
    else {
      const m = line.match(DOCKER_INSTRUCTION)
      if (!m) push(line, t.plain)
      else {
        push(m[1], t.plain)
        push(m[2], t.keyword)
        for (const r of m[3].matchAll(DOCKER_REST)) {
          const [text, str, as] = r
          push(text, str ? t.string : as ? t.keyword : t.plain)
        }
      }
    }
    if (idx < lines.length - 1) push('\n', t.plain)
  })
  return out
}

/* ---- shell ---- */

function highlightShell(code: string, t: Theme): Token[] {
  return code.split('\n').flatMap((line, i, all) => {
    const toks: Token[] = []
    if (!line.startsWith('$ ')) {
      toks.push({ text: line, color: t.plain })
    } else {
      toks.push({ text: '$ ', color: t.prompt })
      const rest = line.slice(2)
      const cmd = rest.match(/^([a-zA-Z0-9_@./-]+)(.*)$/)
      if (!cmd) {
        toks.push({ text: rest, color: t.plain })
      } else {
        toks.push({ text: cmd[1], color: t.function })
        const parts = cmd[2].split(/(\s+--?[a-zA-Z0-9-]+|\s+[A-Za-z0-9_./@-]+|"[^"]*")/g)
        for (const p of parts) {
          if (!p) continue
          const color = /^\s+--?/.test(p) ? t.variable : p.startsWith('"') ? t.string : t.plain
          toks.push({ text: p, color })
        }
      }
    }
    if (i < all.length - 1) toks.push({ text: '\n', color: t.plain })
    return toks
  })
}

/* ---- .env / dotenv ---- */

function highlightEnv(code: string, t: Theme): Token[] {
  const { out, push } = collector()
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    const trimmed = line.trimStart()
    if (trimmed.startsWith('#') || trimmed === '') {
      push(line, trimmed.startsWith('#') ? t.comment : t.plain)
    } else {
      const eq = line.indexOf('=')
      if (eq >= 0) {
        push(line.slice(0, eq), t.variable)
        push('=', t.plain)
        push(line.slice(eq + 1), t.string)
      } else {
        push(line, t.plain)
      }
    }
    if (idx < lines.length - 1) push('\n', t.plain)
  })
  return out
}

function tokenize(code: string, theme: Theme, lang: CodeLang): Token[] {
  switch (lang) {
    case 'shell':
      return highlightShell(code, theme)
    case 'js':
      return highlightJs(code, theme)
    case 'css':
      return highlightCss(code, theme)
    case 'json':
      return highlightJson(code, theme)
    case 'yaml':
      return highlightYaml(code, theme)
    case 'toml':
      return highlightToml(code, theme)
    case 'html':
      return highlightHtml(code, theme)
    case 'dockerfile':
      return highlightDockerfile(code, theme)
    case 'env':
      return highlightEnv(code, theme)
    default:
      return [{ text: code, color: theme.plain }]
  }
}

/** Follow the site theme by watching the `dark` class on <html>. */
function useIsDark() {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  )
  useEffect(() => {
    const update = () => setDark(document.documentElement.classList.contains('dark'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => obs.disconnect()
  }, [])
  return dark
}

function Highlighted({ code, lang }: { code: string; lang: CodeLang }) {
  const dark = useIsDark()
  const tokens = useMemo(
    () => tokenize(code, dark ? DARK : LIGHT, lang),
    [code, lang, dark]
  )
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} style={{ color: t.color }}>
          {t.text}
        </span>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll area — now relies on the global thin native scrollbar        */
/* ------------------------------------------------------------------ */

/**
 * Scroll container. Uses the global thin native scrollbar (see
 * `ScrollbarStyles`), but keeps the non-vertical wheel forwarding so
 * code blocks / terminals still let the page scroll when the cursor is
 * over them.
 */
export function FakeScrollArea({
  children,
  className = '',
  scrollClassName = '',
  vertical = true,
  horizontal = true,
}: {
  children: ReactNode
  className?: string
  scrollClassName?: string
  vertical?: boolean
  horizontal?: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const horizontalIntent =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) || (e.shiftKey && e.deltaY !== 0)

      if (horizontal && horizontalIntent) {
        if (e.shiftKey && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
          el.scrollLeft += e.deltaY
          e.preventDefault()
        }
        return
      }

      if (!vertical) {
        window.scrollBy({ top: e.deltaY, behavior: 'auto' })
        e.preventDefault()
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [vertical, horizontal])

  return (
    <div
      ref={scrollRef}
      className={`${
        vertical ? 'overflow-y-auto' : 'overflow-y-hidden'
      } ${horizontal ? 'overflow-x-auto' : 'overflow-x-hidden'} ${scrollClassName} ${className}`}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* TS / JS preference shared across all docs pages                     */
/* ------------------------------------------------------------------ */

type Lang = 'ts' | 'js'
const LANG_KEY = 'bini-docs-lang'
const LANG_LABEL: Record<Lang, string> = { ts: 'TypeScript', js: 'JavaScript' }

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'ts',
  setLang: () => {},
})

function readLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'js' || saved === 'ts') return saved
  } catch {}
  return 'ts'
}

export const useDocLang = () => useContext(LangContext).lang

function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang)
  useEffect(() => {
    const sync = () => setLang(readLang())
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])
  const set = useCallback((l: Lang) => {
    setLang(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {}
  }, [])
  const value = useMemo(() => ({ lang, setLang: set }), [lang, set])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function CopyButton({
  text,
  title,
  className = '',
}: {
  text: string
  title?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      title={title}
      className={`inline-flex h-6 w-6 items-center justify-center rounded text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 ${className}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

const FILE_ICON = 'shrink-0 text-neutral-500 dark:text-neutral-400'

export function BrandIcon({
  icon,
  size,
  className = FILE_ICON,
}: {
  icon: { path: string }
  size: number
  className?: string
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}

function FileIcon({ filename }: { filename: string }) {
  const f = filename.toLowerCase()
  if (f.includes('vite.config')) return <BrandIcon icon={siVite} size={16} />
  if (/(^|\/)\.github\//.test(f)) return <BrandIcon icon={siGithub} size={14} />
  if (/(^|\/)\.env(\.|$)/.test(f)) return <BrandIcon icon={siDotenv} size={14} />
  if (f.includes('tsconfig')) return <BrandIcon icon={siTypescript} size={14} />
  if (f.endsWith('.css')) return <BrandIcon icon={siCss} size={14} />
  if (/\.(scss|sass)$/.test(f)) return <BrandIcon icon={siSass} size={14} />
  if (/\.(html?|xhtml)$/.test(f)) return <BrandIcon icon={siHtml5} size={14} />
  if (f.endsWith('.json')) {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-[11px] font-mono font-bold leading-none text-neutral-600 dark:text-neutral-400">
        {'{}'}
      </span>
    )
  }
  if (/\.(tsx|jsx)$/.test(f)) return <BrandIcon icon={siReact} size={14} />
  if (/\.ts$/.test(f)) return <BrandIcon icon={siTypescript} size={14} />
  if (/\.js$/.test(f)) return <BrandIcon icon={siJavascript} size={14} />
  return null
}

/* ------------------------------------------------------------------ */
/* Terminals                                                           */
/* ------------------------------------------------------------------ */

export type TerminalTab = { id: string; label: string; command: string }

function TerminalFrame({
  label,
  center,
  copy,
  children,
}: {
  label: string
  center?: ReactNode
  copy: string
  children: ReactNode
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="relative flex items-center border-b border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex shrink-0 items-center gap-2 text-xs text-neutral-400">
          <span className="font-mono text-neutral-500">&gt;_</span>
          <span>{label}</span>
        </div>
        {center}
        <CopyButton text={copy} className="ml-auto" />
      </div>
      {/* no p-4 here — padding lives on the pre inside FakeScrollArea */}
      {children}
    </div>
  )
}

export function MultiTerminal({ tabs }: { tabs: TerminalTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0].id)
  const active = tabs.find((t) => t.id === activeId)
  return (
    <TerminalFrame
      label="Terminal"
      copy={active?.command.replace(/\$ /g, '') ?? ''}
      center={
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${activeId === tab.id ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <FakeScrollArea key={activeId} vertical={false}>
          <m.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="p-4 text-left font-mono text-[13px] leading-relaxed whitespace-pre"
          >
            {active && <Highlighted code={active.command} lang="shell" />}
          </m.pre>
        </FakeScrollArea>
      </AnimatePresence>
    </TerminalFrame>
  )
}

export function OutputBlock({
  code,
  filename = 'Terminal',
  children,
}: {
  code: string
  filename?: string
  children?: ReactNode
}) {
  return (
    <TerminalFrame label={filename} copy={code}>
      <FakeScrollArea vertical={false}>
        <pre className="p-4 text-left font-mono text-[13px] leading-relaxed whitespace-pre text-neutral-700 dark:text-neutral-300">
          {children ?? code}
        </pre>
      </FakeScrollArea>
    </TerminalFrame>
  )
}

/* ------------------------------------------------------------------ */
/* Interactive prompt output (CLI wizard look)                         */
/* ------------------------------------------------------------------ */

export type PromptOption = { text: string; selected?: boolean }

export type PromptLine =
  | { kind: 'input'; label: string; value: string }
  | { kind: 'question-block'; text: string; options: PromptOption[]; hint?: string }
  | { kind: 'blank' }
  | { kind: 'text'; text: string; dim?: boolean }
  | { kind: 'question'; text: string }
  | { kind: 'option'; text: string; selected?: boolean }
  | { kind: 'hint'; text: string }

function stringifyPromptLine(line: PromptLine): string {
  switch (line.kind) {
    case 'input':
      return `? ${line.label} ${line.value}`
    case 'question-block': {
      const opts = line.options
        .map((o) => `${o.selected ? '>' : ' '} ${o.text}`)
        .join('\n')
      return `? ${line.text}\n${opts}${line.hint ? `\n\n${line.hint}` : ''}`
    }
    case 'blank':
      return ''
    case 'text':
      return line.text
    case 'question':
      return `? ${line.text}`
    case 'option':
      return `${line.selected ? '>' : ' '} ${line.text}`
    case 'hint':
      return line.text
  }
}

function PromptLineView({ line }: { line: PromptLine }) {
  switch (line.kind) {
    case 'input':
      return (
        <div>
          <span className="text-violet-500 dark:text-violet-400">?</span>{' '}
          <span className="text-black dark:text-white">{line.label}</span>{' '}
          <span className="text-neutral-400 dark:text-neutral-500">({line.value})</span>
        </div>
      )
    case 'question-block':
      return (
        <div>
          <div>
            <span className="text-violet-500 dark:text-violet-400">?</span>{' '}
            <span className="text-black dark:text-white">{line.text}</span>
          </div>
          {line.options.map((opt, i) => (
            <div key={i} className={opt.selected ? '' : 'pl-3'}>
              {opt.selected && (
                <span className="text-cyan-500 dark:text-cyan-400">{'>'} </span>
              )}
              <span
                className={
                  opt.selected
                    ? 'text-cyan-500 dark:text-cyan-400'
                    : 'text-black dark:text-white'
                }
              >
                {opt.text}
              </span>
            </div>
          ))}
          {line.hint && (
            <div className="mt-1 text-neutral-400 dark:text-neutral-600">{line.hint}</div>
          )}
        </div>
      )
    case 'blank':
      return <div>&nbsp;</div>
    case 'text':
      return (
        <div
          className={
            line.dim
              ? 'text-neutral-500 dark:text-neutral-400'
              : 'text-neutral-700 dark:text-neutral-200'
          }
        >
          {line.text}
        </div>
      )
    case 'question':
      return (
        <div>
          <span className="text-violet-500 dark:text-violet-400">?</span>{' '}
          <span className="text-black dark:text-white">{line.text}</span>
        </div>
      )
    case 'option':
      return (
        <div className={line.selected ? '' : 'pl-3'}>
          {line.selected && (
            <span className="text-cyan-500 dark:text-cyan-400">{'>'} </span>
          )}
          <span
            className={
              line.selected
                ? 'text-cyan-500 dark:text-cyan-400'
                : 'text-black dark:text-white'
            }
          >
            {line.text}
          </span>
        </div>
      )
    case 'hint':
      return (
        <div className="mt-1 text-neutral-400 dark:text-neutral-600">{line.text}</div>
      )
  }
}

export function PromptOutput({
  lines,
  filename = 'Terminal',
}: {
  lines: PromptLine[]
  filename?: string
}) {
  return (
    <TerminalFrame
      label={filename}
      copy={lines.map(stringifyPromptLine).join('\n')}
    >
      <FakeScrollArea vertical={false}>
        <pre className="p-4 text-left font-mono text-[13px] leading-relaxed whitespace-pre">
          {lines.map((line, i) => (
            <PromptLineView key={i} line={line} />
          ))}
        </pre>
      </FakeScrollArea>
    </TerminalFrame>
  )
}

/* ------------------------------------------------------------------ */
/* File tree block                                                     */
/* ------------------------------------------------------------------ */

export function FileTreeBlock({
  code,
  filename = 'Structure',
}: {
  code: string
  filename?: string
}) {
  const lines = code.split('\n')
  return (
    <TerminalFrame label={filename} copy={code}>
      <FakeScrollArea vertical={false}>
        <pre className="p-4 text-left font-mono text-[13px] leading-relaxed whitespace-pre">
          {lines.map((line, i) => {
            const m = line.match(/^(.*?)(\s(?:←|→).*)$/)
            if (!m) {
              return <div key={i}>{line || '\u00A0'}</div>
            }
            return (
              <div key={i}>
                <span className="text-neutral-700 dark:text-neutral-300">{m[1]}</span>
                <span className="text-emerald-600 dark:text-emerald-400">{m[2]}</span>
              </div>
            )
          })}
        </pre>
      </FakeScrollArea>
    </TerminalFrame>
  )
}

/* ------------------------------------------------------------------ */
/* Code block                                                          */
/* ------------------------------------------------------------------ */

const CODE_EXT = /\.(tsx|jsx|ts|js)$/i

const FILE_LANGS: [RegExp, CodeLang][] = [
  [/(^|\/)\.env(\.|$)/i, 'env'],
  [/\.(tsx|jsx|ts|js|mjs|cjs)$/i, 'js'],
  [/\.(css|scss|sass)$/i, 'css'],
  [/\.json$/i, 'json'],
  [/\.ya?ml$/i, 'yaml'],
  [/\.toml$/i, 'toml'],
  [/\.(html?|svg|xml)$/i, 'html'],
  [/(^|\/)dockerfile$/i, 'dockerfile'],
]

function langFromFilename(filename: string): CodeLang | undefined {
  return FILE_LANGS.find(([re]) => re.test(filename))?.[1]
}

function swapExt(filename: string, lang: Lang) {
  return lang === 'js'
    ? filename.replace(/\.tsx$/i, '.jsx').replace(/\.ts$/i, '.js')
    : filename.replace(/\.jsx$/i, '.tsx').replace(/\.js$/i, '.ts')
}

export function CodeBlock({
  code,
  tsCode,
  jsCode,
  filename,
  lang = 'js',
}: {
  code?: string
  tsCode?: string
  jsCode?: string
  filename?: string
  lang?: CodeLang
}) {
  const { lang: docLang, setLang } = useContext(LangContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  const hasVariants = tsCode !== undefined && jsCode !== undefined
  const displayed = hasVariants ? (docLang === 'ts' ? tsCode : jsCode) : (code ?? tsCode ?? '')

  const isVite = !!filename?.toLowerCase().includes('vite.config')
  const switchable = isVite || (!!filename && CODE_EXT.test(filename))
  const name = !filename
    ? undefined
    : isVite
      ? `vite.config.${docLang}`
      : switchable
        ? swapExt(filename, docLang)
        : filename

  const effectiveLang: CodeLang = (filename && langFromFilename(filename)) || lang

  return (
    <div className="group relative mb-6">
      {name && (
        <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-800 dark:bg-neutral-950">
          {lang === 'shell' ? (
            <span className="font-mono text-xs text-neutral-500">&gt;_</span>
          ) : (
            <FileIcon filename={name} />
          )}
          <span className="font-sans text-[13px] text-neutral-700 dark:text-neutral-300">
            {name}
          </span>
          <div className="ml-auto flex items-center gap-3">
            {switchable && (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  <span>{LANG_LABEL[docLang]}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-70">
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-7 z-20 min-w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                    {(Object.keys(LANG_LABEL) as Lang[]).map((id) => (
                      <button
                        key={id}
                        onClick={() => {
                          setLang(id)
                          setMenuOpen(false)
                        }}
                        className="flex w-full items-center px-3 py-2 text-left text-[13px] text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        {LANG_LABEL[id]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <CopyButton
              text={lang === 'shell' ? displayed.replace(/^\$ /gm, '') : displayed}
              title="Copy"
            />
          </div>
        </div>
      )}
      <div
        className={`overflow-hidden border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black ${
          name ? 'rounded-b-lg' : 'rounded-lg'
        }`}
      >
        <FakeScrollArea vertical={false}>
          <pre className="p-4 text-left">
            <code className="font-mono text-[13px] leading-relaxed whitespace-pre">
              <Highlighted code={displayed} lang={effectiveLang} />
            </code>
          </pre>
        </FakeScrollArea>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Typography + content primitives                                     */
/* ------------------------------------------------------------------ */

const BODY = 'text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

export function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string
  title: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight text-black dark:text-neutral-100">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )
}

export function H3({ children, className = 'mb-3' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`${className} text-base font-semibold text-neutral-900 dark:text-neutral-200`}>
      {children}
    </h3>
  )
}

export function P({ children, className = 'mb-5' }: { children: ReactNode; className?: string }) {
  return <p className={`${className} ${BODY}`}>{children}</p>
}

export function UL({
  children,
  className = 'mb-6 space-y-2',
}: {
  children: ReactNode
  className?: string
}) {
  return <ul className={`${className} list-disc pl-5 ${BODY}`}>{children}</ul>
}

export function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-sans text-[0.875em] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
      {children}
    </code>
  )
}

const LINK =
  'text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900 dark:text-neutral-200 dark:decoration-neutral-700 dark:hover:decoration-neutral-200'

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {children}
    </a>
  )
}

export function DocLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={LINK}>
      {children}
    </Link>
  )
}

const CALLOUT = {
  info: 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950',
  warning: 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20',
  success: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20',
}

export function Callout({
  type = 'info',
  children,
}: {
  type?: keyof typeof CALLOUT
  children: ReactNode
}) {
  return (
    <div className={`my-6 rounded-lg border p-4 ${CALLOUT[type]}`}>
      <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-sans [&_code]:text-[0.875em] [&_code]:text-neutral-700 dark:[&_code]:bg-neutral-800 dark:[&_code]:text-neutral-200 [&_strong]:font-semibold [&_strong]:text-neutral-900 dark:[&_strong]:text-neutral-100">
        {children}
      </div>
    </div>
  )
}

export function Table({
  headers,
  rows,
  top = false,
}: {
  headers: string[]
  rows: ReactNode[][]
  top?: boolean
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white dark:bg-black">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-5 py-3 text-sm ${top ? 'align-top' : ''} ${j === 0 ? `${top ? 'whitespace-nowrap ' : ''}font-sans font-medium text-neutral-900 dark:text-neutral-200` : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

/**
 * Global scrollbar styling. Applies the thin pill scrollbar to every
 * scrollable element on the site (page, code blocks, terminals, TOC,
 * tables) so everything looks consistent.
 */
function ScrollbarStyles() {
  return (
    <style>{`
      html { color-scheme: light; }
      html.dark { color-scheme: dark; }

      /* Global thin scrollbar */
      * {
        scrollbar-width: thin;
        scrollbar-color: #c4c4c4 transparent;
      }
      *::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      *::-webkit-scrollbar-track {
        background: transparent;
      }
      *::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 9999px;
      }
      *::-webkit-scrollbar-thumb:hover {
        background: #a3a3a3;
      }
      *::-webkit-scrollbar-corner {
        background: transparent;
      }

      .dark * {
        scrollbar-color: #3a3a3a transparent;
      }
      .dark *::-webkit-scrollbar-thumb {
        background: #3a3a3a;
      }
      .dark *::-webkit-scrollbar-thumb:hover {
        background: #525252;
      }

      /* Font overrides */
      span.font-mono.text-[9px],
      span.font-mono.text-[10px],
      span.font-mono.text-[12px],
      span.font-mono.text-[13px],
      td.font-mono { font-family: var(--font-sans); }
    `}</style>
  )
}

type PagerTarget = { to: string; title: string }

function PagerLink({ dir, to, title }: PagerTarget & { dir: 'prev' | 'next' }) {
  const prev = dir === 'prev'
  const Icon = prev ? ChevronLeft : ChevronRight
  const arrow = (
    <Icon
      className={`h-10 w-10 shrink-0 text-black transition-transform dark:text-white ${prev ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`}
      strokeWidth={2}
      aria-hidden="true"
    />
  )
  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 ${prev ? '' : 'text-right '}text-neutral-500 transition-colors hover:text-black dark:text-neutral-500 dark:hover:text-neutral-200`}
    >
      {prev && arrow}
      <span>
        <span className="block text-xs text-neutral-400 dark:text-neutral-400">
          {prev ? 'Previous' : 'Next'}
        </span>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{title}</span>
      </span>
      {!prev && arrow}
    </Link>
  )
}

function PageBadge({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 rounded-[5px] border-[1.5px] border-blue-500 bg-blue-500/10 px-1.5 py-px font-sans text-[10px] font-medium text-blue-700 dark:border-blue-500/80 dark:text-blue-300">
      {children}
    </span>
  )
}

export function DocPage({
  title,
  badge,
  description,
  url,
  editUrl,
  toc,
  prev,
  next,
  layout: Layout = DocLayout,
  children,
}: {
  title: string
  badge?: string
  description: string
  url: string
  editUrl: string
  toc: TocItem[]
  prev?: PagerTarget
  next?: PagerTarget
  layout?: React.ComponentType<{ children: ReactNode }>
  children: ReactNode
}) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    requestAnimationFrame(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo(0, 0)
    })
  }, [pathname, hash])

  return (
    <LangProvider>
      <div className="min-h-screen bg-white font-sans antialiased dark:bg-black">
        <ScrollbarStyles />
        <Header />
        <div className="pt-16 lg:pt-20">
          <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-12 xl:px-16">
            <Layout>
              <div className="flex gap-12 xl:gap-20">
                <div className="min-w-0 max-w-none flex-1">
                  <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-neutral-100">
                          {title}
                        </h1>
                        {badge && <PageBadge>{badge}</PageBadge>}
                      </div>
                      <p className="text-[15px] text-neutral-500 dark:text-neutral-500">
                        {description}
                      </p>
                    </div>
                    <div className="hidden shrink-0 pt-1 sm:block">
                      <CopyPageButton pageUrl={url} pageTitle={title} />
                    </div>
                  </m.div>
                  <div className="mb-10 sm:hidden">
                    <CopyPageButton pageUrl={url} pageTitle={title} />
                  </div>

                  {children}

                  <div className="mt-16 mb-12 flex justify-center">
                    <DocsFeedback />
                  </div>
                  <div className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-8 dark:border-neutral-800">
                    <div>{prev ? <PagerLink dir="prev" {...prev} /> : null}</div>
                    <div>{next ? <PagerLink dir="next" {...next} /> : null}</div>
                  </div>
                </div>
                <aside className="hidden w-64 shrink-0 xl:block">
                  <TableOfContents items={toc} editUrl={editUrl} />
                </aside>
              </div>
            </Layout>
          </div>
        </div>
        <Footer />
      </div>
    </LangProvider>
  )
}