// src/components/DocBlocks.tsx
// Shared building blocks for every docs page. Fonts come from global.css only.
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
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
import { DocsFeedback } from './FeedBack'
import { TableOfContents, type TocItem } from './TableOfContents'

/* ------------------------------------------------------------------ */
/* Syntax highlighting                                                 */
/* ------------------------------------------------------------------ */

const TOKEN_CLASSES = {
  keyword: 'text-[#0000FF] dark:text-[#569CD6]',
  controlKeyword: 'text-[#AF00DB] dark:text-[#C586C0]',
  string: 'text-[#A31515] dark:text-[#CE9178]',
  number: 'text-[#098658] dark:text-[#B5CEA8]',
  comment: 'text-[#008000] dark:text-[#6A9955]',
  function: 'text-[#795E26] dark:text-[#DCDCAA]',
  type: 'text-[#267F99] dark:text-[#4EC9B0]',
  variable: 'text-[#001080] dark:text-[#9CDCFE]',
  constant: 'text-[#0000FF] dark:text-[#4FC1FF]',
  plain: 'text-black dark:text-[#D4D4D4]',
  builtin: 'text-[#267F99] dark:text-[#4EC9B0]',
  prompt: 'text-[#098658] dark:text-[#89D185]',
}
type TokenKind = keyof typeof TOKEN_CLASSES

type Token = { text: string; color: TokenKind }
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
type Push = (text: string, color: TokenKind) => void

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

const WORD_KIND = new Map<string, TokenKind>()
const addWords = (kind: TokenKind, words: string) =>
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

function highlightJs(code: string): Token[] {
  const { out, push } = collector()
  let pos = 0
  for (const match of code.matchAll(JS_TOKEN)) {
    const [text, comment, str, num, word] = match
    const start = match.index!
    push(code.slice(pos, start), 'plain')
    pos = start + text.length
    if (comment) push(text, 'comment')
    else if (str) push(text, 'string')
    else if (num) push(text, 'number')
    else if (word) {
      const kind = WORD_KIND.get(word)
      CALL.lastIndex = pos
      if (kind) push(word, kind)
      else if (/^[A-Z]/.test(word)) push(word, 'type')
      else if (CALL.test(code)) push(word, 'function')
      else push(word, 'variable')
    }
  }
  push(code.slice(pos), 'plain')
  return out
}

/* ---- CSS / SCSS ---- */

const CSS_SEL =
  /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[\w-]+)|([.#][\w-]+|::?[\w-]+)|(-?\d*?\.?\d+[a-zA-Z%]*)|(-?[A-Za-z_][\w-]*)|([\s\S])/g
const CSS_VAL =
  /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#[0-9a-fA-F]{3,8}\b)|(-?\d*\.?\d+[a-zA-Z%]*)|(--[\w-]+)|(-?[A-Za-z_][\w-]*)(\()?|(!important)|([\s\S])/g

function cssPrelude(seg: string, atRule: boolean, push: Push) {
  let depth = 0
  for (const m of seg.matchAll(CSS_SEL)) {
    const [text, comment, str, at, sel, num, word] = m
    if (comment) push(text, 'comment')
    else if (str) push(text, 'string')
    else if (at) push(text, 'controlKeyword')
    else if (sel) push(text, 'function')
    else if (num) push(text, 'number')
    else if (word) push(text, depth > 0 ? 'variable' : atRule ? 'function' : 'keyword')
    else {
      if (text === '(') depth++
      else if (text === ')') depth = Math.max(0, depth - 1)
      push(text, 'plain')
    }
  }
}

function cssDeclaration(seg: string, push: Push) {
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
    push(seg, 'plain')
    return
  }
  push(seg.slice(0, colon), 'variable')
  push(':', 'plain')
  for (const m of seg.slice(colon + 1).matchAll(CSS_VAL)) {
    const [text, comment, str, hex, num, cssVar, word, paren, important] = m
    if (comment) push(text, 'comment')
    else if (str) push(text, 'string')
    else if (hex || num) push(text, 'number')
    else if (cssVar) push(text, 'variable')
    else if (word) {
      if (paren) {
        push(word, 'function')
        push('(', 'plain')
      } else push(word, 'string')
    } else if (important) push(text, 'keyword')
    else push(text, 'plain')
  }
}

function highlightCss(code: string): Token[] {
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
      push(ch, 'plain')
      i++
      continue
    }
    if (ch === '/' && code[i + 1] === '*') {
      const e = code.indexOf('*/', i + 2)
      const end = e < 0 ? n : e + 2
      push(code.slice(i, end), 'comment')
      i = end
      continue
    }
    if (ch === '/' && code[i + 1] === '/') {
      let end = code.indexOf('\n', i)
      if (end < 0) end = n
      push(code.slice(i, end), 'comment')
      i = end
      continue
    }
    if (ch === '{' || ch === '}' || ch === ';') {
      push(ch, 'plain')
      i++
      continue
    }
    const end = scan(i)
    const seg = code.slice(i, end)
    const atRule = ch === '@'
    if (atRule || code[end] === '{') cssPrelude(seg, atRule, push)
    else cssDeclaration(seg, push)
    i = end
  }
  return out
}

/* ---- JSON ---- */

const JSON_TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([\s\S])/g

function highlightJson(code: string): Token[] {
  const { out, push } = collector()
  for (const m of code.matchAll(JSON_TOKEN)) {
    const [text, str, colon, num, word] = m
    if (str) {
      push(str, colon ? 'variable' : 'string')
      if (colon) push(colon, 'plain')
    } else if (num) push(text, 'number')
    else if (word) push(text, 'constant')
    else push(text, 'plain')
  }
  return out
}

/* ---- YAML ---- */

const YAML_VALUE = /(\$\{\{[^}]*\}\})|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|([^"'$]+|\$)/g
const YAML_KEY = /^(\s*)((?:-\s+)*)([\w.\/-]+|"[^"]*"|'[^']*')(\s*:)(\s+|$)([\s\S]*)$/

function yamlValue(v: string, push: Push) {
  const trimmed = v.trim()
  if (/^(true|false|null|~)$/i.test(trimmed)) return push(v, 'constant')
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return push(v, 'number')
  for (const m of v.matchAll(YAML_VALUE)) {
    const [text, expr] = m
    push(text, expr ? 'controlKeyword' : 'string')
  }
}

function highlightYaml(code: string): Token[] {
  const { out, push } = collector()
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    const c = /(^|\s)#/.exec(line)
    const ci = c ? c.index + c[1].length : -1
    const body = ci >= 0 ? line.slice(0, ci) : line
    const km = body.match(YAML_KEY)
    if (km) {
      push(km[1] + km[2], 'plain')
      push(km[3], 'variable')
      push(km[4], 'plain')
      push(km[5], 'plain')
      yamlValue(km[6], push)
    } else {
      const lm = body.match(/^(\s*-\s+)([\s\S]*)$/)
      if (lm) {
        push(lm[1], 'plain')
        yamlValue(lm[2], push)
      } else if (body.trim() === '') push(body, 'plain')
      else yamlValue(body, push)
    }
    if (ci >= 0) push(line.slice(ci), 'comment')
    if (idx < lines.length - 1) push('\n', 'plain')
  })
  return out
}

/* ---- TOML ---- */

const TOML_VALUE = /("(?:\\.|[^"\\])*"|'[^']*')|(-?\d+(?:\.\d+)?)|\b(true|false)\b|([\s\S])/g

function highlightToml(code: string): Token[] {
  const { out, push } = collector()
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    const c = /(^|\s)#/.exec(line)
    const ci = c ? c.index + c[1].length : -1
    const body = ci >= 0 ? line.slice(0, ci) : line
    const section = body.match(/^(\s*)(\[\[?[^\]]+\]\]?)(\s*)$/)
    const kv = body.match(/^(\s*)([\w."'-]+)(\s*=\s*)([\s\S]*)$/)
    if (section) {
      push(section[1], 'plain')
      push(section[2], 'type')
      push(section[3], 'plain')
    } else if (kv) {
      push(kv[1], 'plain')
      push(kv[2], 'variable')
      push(kv[3], 'plain')
      for (const m of kv[4].matchAll(TOML_VALUE)) {
        const [text, str, num, bool] = m
        if (str) push(text, 'string')
        else if (num) push(text, 'number')
        else if (bool) push(text, 'constant')
        else push(text, 'plain')
      }
    } else push(body, 'plain')
    if (ci >= 0) push(line.slice(ci), 'comment')
    if (idx < lines.length - 1) push('\n', 'plain')
  })
  return out
}

/* ---- HTML ---- */

const HTML_TAG = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g
const HTML_ATTR = /(\s+)|("[^"]*"|'[^']*')|(=)|([^\s="'=]+)/g

function htmlTag(tag: string, push: Push) {
  const m = tag.match(/^(<\/?)([A-Za-z][^\s\/>]*)([\s\S]*?)(\/?>)$/)
  if (!m) return push(tag, 'plain')
  push(m[1], 'plain')
  push(m[2], 'keyword')
  let afterEq = false
  for (const a of m[3].matchAll(HTML_ATTR)) {
    const [text, ws, str, eq] = a
    if (ws) push(text, 'plain')
    else if (str) {
      push(text, 'string')
      afterEq = false
    } else if (eq) {
      push(text, 'plain')
      afterEq = true
    } else {
      push(text, afterEq ? 'string' : 'variable')
      afterEq = false
    }
  }
  push(m[4], 'plain')
}

function highlightHtml(code: string): Token[] {
  const { out, push } = collector()
  const tagRe = new RegExp(HTML_TAG.source, 'g')
  let pos = 0
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(code))) {
    push(code.slice(pos, m.index), 'plain')
    const s = m[0]
    pos = m.index + s.length
    if (s.startsWith('<!--')) push(s, 'comment')
    else htmlTag(s, push)
    if (/^<script\b/i.test(s) && !s.endsWith('/>')) {
      const end = code.indexOf('</script', pos)
      if (end >= 0) {
        for (const tok of highlightJs(code.slice(pos, end))) push(tok.text, tok.color)
        pos = end
        tagRe.lastIndex = end
      }
    }
  }
  push(code.slice(pos), 'plain')
  return out
}

/* ---- Dockerfile ---- */

const DOCKER_INSTRUCTION =
  /^(\s*)(FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b([\s\S]*)$/i
const DOCKER_REST = /("(?:\\.|[^"\\])*"|'[^']*')|(\bAS\b)|([\s\S])/gi

function highlightDockerfile(code: string): Token[] {
  const { out, push } = collector()
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('#')) push(line, 'comment')
    else {
      const m = line.match(DOCKER_INSTRUCTION)
      if (!m) push(line, 'plain')
      else {
        push(m[1], 'plain')
        push(m[2], 'keyword')
        for (const r of m[3].matchAll(DOCKER_REST)) {
          const [text, str, as] = r
          push(text, str ? 'string' : as ? 'keyword' : 'plain')
        }
      }
    }
    if (idx < lines.length - 1) push('\n', 'plain')
  })
  return out
}

/* ---- shell ---- */

function highlightShell(code: string): Token[] {
  return code.split('\n').flatMap((line, i, all) => {
    const toks: Token[] = []
    if (!line.startsWith('$ ')) {
      toks.push({ text: line, color: 'plain' })
    } else {
      toks.push({ text: '$ ', color: 'prompt' })
      const rest = line.slice(2)
      const cmd = rest.match(/^([a-zA-Z0-9_@./-]+)(.*)$/)
      if (!cmd) {
        toks.push({ text: rest, color: 'plain' })
      } else {
        toks.push({ text: cmd[1], color: 'function' })
        const parts = cmd[2].split(/(\s+--?[a-zA-Z0-9-]+|\s+[A-Za-z0-9_./@-]+|"[^"]*")/g)
        for (const p of parts) {
          if (!p) continue
          const color: TokenKind = /^\s+--?/.test(p) ? 'variable' : p.startsWith('"') ? 'string' : 'plain'
          toks.push({ text: p, color })
        }
      }
    }
    if (i < all.length - 1) toks.push({ text: '\n', color: 'plain' })
    return toks
  })
}

/* ---- .env / dotenv ---- */

function highlightEnv(code: string): Token[] {
  const { out, push } = collector()
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    const trimmed = line.trimStart()
    if (trimmed.startsWith('#') || trimmed === '') {
      push(line, trimmed.startsWith('#') ? 'comment' : 'plain')
    } else {
      const eq = line.indexOf('=')
      if (eq >= 0) {
        push(line.slice(0, eq), 'variable')
        push('=', 'plain')
        push(line.slice(eq + 1), 'string')
      } else {
        push(line, 'plain')
      }
    }
    if (idx < lines.length - 1) push('\n', 'plain')
  })
  return out
}

function tokenize(code: string, lang: CodeLang): Token[] {
  switch (lang) {
    case 'shell':
      return highlightShell(code)
    case 'js':
      return highlightJs(code)
    case 'css':
      return highlightCss(code)
    case 'json':
      return highlightJson(code)
    case 'yaml':
      return highlightYaml(code)
    case 'toml':
      return highlightToml(code)
    case 'html':
      return highlightHtml(code)
    case 'dockerfile':
      return highlightDockerfile(code)
    case 'env':
      return highlightEnv(code)
    default:
      return [{ text: code, color: 'plain' }]
  }
}

function Highlighted({ code, lang }: { code: string; lang: CodeLang }) {
  const tokens = useMemo(() => tokenize(code, lang), [code, lang])
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className={TOKEN_CLASSES[t.color]}>
          {t.text}
        </span>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll area                                                         */
/* ------------------------------------------------------------------ */

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
      className={`
        ${vertical ? 'overflow-y-auto' : 'overflow-y-hidden'} 
        ${horizontal ? 'overflow-x-auto' : 'overflow-x-hidden'} 
        ${scrollClassName} 
        ${className}
        
        scrollbar-gutter-stable
        scrollbar-thin
        [scrollbar-color:var(--color-neutral-300)_transparent]
        dark:[scrollbar-color:var(--color-neutral-700)_transparent]
        scheme-light dark:scheme-dark
      `}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* TS / JS + PM preference shared across all docs pages                */
/* ------------------------------------------------------------------ */

type Lang = 'ts' | 'js'
type Pm = 'npm' | 'pnpm' | 'yarn' | 'bun'

const LANG_KEY = 'bini-docs-lang'
const PM_KEY = 'bini-docs-pm'

const LANG_LABEL: Record<Lang, string> = { ts: 'TypeScript', js: 'JavaScript' }
const PM_LABEL: Record<Pm, string> = { npm: 'npm', pnpm: 'pnpm', yarn: 'yarn', bun: 'bun' }

function readLang(): Lang {
  if (typeof window === 'undefined') return 'ts'
  try {
    return window.localStorage.getItem(LANG_KEY) === 'js' ? 'js' : 'ts'
  } catch {
    return 'ts'
  }
}

function readPm(): Pm {
  if (typeof window === 'undefined') return 'npm'
  try {
    const v = window.localStorage.getItem(PM_KEY)
    return v === 'pnpm' || v === 'yarn' || v === 'bun' ? v : 'npm'
  } catch {
    return 'npm'
  }
}

const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  pm: Pm
  setPm: (p: Pm) => void
}>({
  lang: 'ts',
  setLang: () => {},
  pm: 'npm',
  setPm: () => {},
})

export const useDocLang = () => useContext(LangContext).lang
export const useDocPm = () => useContext(LangContext).pm

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => readLang())
  const [pm, setPmState] = useState<Pm>(() => readPm())

  useEffect(() => {
    const sync = () => {
      setLang(readLang())
      setPmState(readPm())
    }
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  const setLangFn = useCallback((l: Lang) => {
    setLang(l)
    try {
      window.localStorage.setItem(LANG_KEY, l)
    } catch {}
  }, [])

  const setPmFn = useCallback((p: Pm) => {
    setPmState(p)
    try {
      window.localStorage.setItem(PM_KEY, p)
    } catch {}
  }, [])

  const value = useMemo(
    () => ({ lang, setLang: setLangFn, pm, setPm: setPmFn }),
    [lang, setLangFn, pm, setPmFn]
  )

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
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable or permission denied: don't claim success */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={title}
      aria-label={title ?? 'Copy'}
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 ${className}`}
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
      <div className="relative flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2 sm:px-4 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex shrink-0 items-center gap-2 text-xs text-neutral-400">
          <span className="font-mono text-neutral-500">&gt;_</span>
          <span className="whitespace-nowrap">{label}</span>
        </div>
        {center}
        <CopyButton text={copy} title="Copy" className="ml-auto" />
      </div>
      {children}
    </div>
  )
}

export function MultiTerminal({ tabs }: { tabs: TerminalTab[] }) {
  const { pm, setPm } = useContext(LangContext)

  const activeId = tabs.find((t) => t.id === pm)?.id || tabs[0].id
  const active = tabs.find((t) => t.id === activeId)

  return (
    <TerminalFrame
      label="Terminal"
      copy={active?.command.replace(/\$ /g, '') ?? ''}
      center={
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto sm:absolute sm:left-1/2 sm:flex-none sm:-translate-x-1/2 sm:overflow-visible">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setPm(tab.id as Pm)}
              className={`shrink-0 whitespace-nowrap rounded px-2 py-1 text-xs font-medium transition-colors sm:px-3 ${activeId === tab.id ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <FakeScrollArea vertical={false}>
            <pre className="p-4 text-left font-mono text-[13px] leading-relaxed whitespace-pre">
              {active && <Highlighted code={active.command} lang="shell" />}
            </pre>
          </FakeScrollArea>
        </motion.div>
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
/* Clack Prompt Terminals                                              */
/* ------------------------------------------------------------------ */

export function ClackTerminal({ children, copyText }: { children: ReactNode; copyText?: string }) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2 sm:px-4 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="font-mono text-neutral-500">&gt;_</span>
          <span className="whitespace-nowrap">Terminal</span>
        </div>
        {copyText && <CopyButton text={copyText} title="Copy" />}
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-max p-4 font-mono text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
          {children}
        </div>
      </div>
    </div>
  )
}

export type ClackPromptProps = {
  type: 'input' | 'select' | 'multi'
  title: string
  answer?: string
  active?: boolean
  isLast?: boolean
  isFirst?: boolean
  children?: ReactNode
}

export function ClackPrompt({ type, title, answer, active, isLast, isFirst, children }: ClackPromptProps) {
  const isBlue = active && isLast
  const symbol = isBlue ? '◆' : '◇'
  const symbolColor = isBlue ? 'text-cyan-500 dark:text-cyan-400' : 'text-green-500 dark:text-green-400'

  const topLineHex = 'bg-neutral-400 dark:bg-neutral-600'
  const bottomLineHex = isBlue ? 'bg-cyan-500 dark:bg-cyan-400' : 'bg-neutral-400 dark:bg-neutral-600'

  return (
    <div className="grid grid-cols-[16px_1fr] gap-3">
      <div className="relative flex flex-col items-center">
        <div
          className={`w-px shrink-0 ${topLineHex}`}
          style={{
            height: isFirst ? '16px' : '12px',
            marginTop: isFirst ? '-16px' : '-12px',
          }}
        />

        <span className={`relative z-10 flex h-3 w-3 shrink-0 items-center justify-center bg-white text-[14px] dark:bg-black ${symbolColor}`}>
          {symbol}
        </span>

        {isLast ? (
          <svg
            className="-mt-[2px] w-[16px] flex-1"
            preserveAspectRatio="none"
            viewBox="0 0 16 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0 V100 H16"
              className={`stroke-current ${isBlue ? 'text-cyan-500 dark:text-cyan-400' : 'text-neutral-400 dark:text-neutral-600'}`}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div className={`-mt-[2px] w-px flex-1 ${bottomLineHex}`} />
        )}
      </div>

      <div className="pt-[2px] pb-4">
        <span className="text-neutral-900 dark:text-neutral-100">{title}</span>
        {answer && <div className="mt-1 text-neutral-500">{answer}</div>}
        {children && <div className="mt-1">{children}</div>}
      </div>
    </div>
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
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
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
                  <div className="absolute top-7 right-0 z-20 min-w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                    {(Object.keys(LANG_LABEL) as Lang[]).map((id) => (
                      <button
                        type="button"
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
      preventScrollReset
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
  children: ReactNode
}) {
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLDivElement>(null)

  // On route change, scroll the window + the main content column to the top.
  // The sidebar lives in the docs layout and stays mounted, so its scroll
  // position is preserved across navigations.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [pathname])

  // Hash links scroll after the scroll-to-top.
  useEffect(() => {
    if (typeof window === 'undefined' || !hash) return
    requestAnimationFrame(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [pathname, hash])

  return (
    <div className="flex gap-12 xl:gap-20">
      <div ref={mainRef} className="max-w-none min-w-0 flex-1">
        <motion.div
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
            <p className="text-[15px] text-neutral-500 dark:text-neutral-500">{description}</p>
          </div>
          <div className="hidden shrink-0 pt-1 sm:block">
            <CopyPageButton pageUrl={url} pageTitle={title} />
          </div>
        </motion.div>
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
  )
}