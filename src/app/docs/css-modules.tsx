// src/app/docs/css-modules.tsx
import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  MultiTerminal,
  P,
  PromptOutput,
  Section,
  useDocLang,
} from '../../components/DocBlocks'
import { Arrow, CARD, FolderVisual, GridBg } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'combining-classes', label: 'Combining Classes' },
  { id: 'using-clsx', label: 'Using clsx for Cleaner Code' },
  { id: 'global-vs-local', label: 'Global vs Local Scope' },
  { id: 'composing-classes', label: 'Composing Classes' },
  { id: 'css-variables', label: 'CSS Variables in Modules' },
  { id: 'animations', label: 'Animations' },
  { id: 'media-queries', label: 'Media Queries' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ---------- visuals ---------- */

/** Source selector on the left, the selector the browser actually receives on the right. */
function ClassMapVisual({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <GridBg>
      <div>
        <div className="mb-3 text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </div>
        {rows.map(([from, to]) => (
          <div key={from} className="mb-2 flex items-center gap-3 last:mb-0">
            <span
              className={`${CARD} flex h-8 w-44 shrink-0 items-center px-3 font-mono text-[12px] text-neutral-800 dark:text-neutral-200`}
            >
              {from}
            </span>
            <Arrow />
            <span
              className={`${CARD} flex h-8 w-56 shrink-0 items-center px-3 font-mono text-[12px] text-neutral-800 dark:text-neutral-200`}
            >
              {to}
            </span>
          </div>
        ))}
      </div>
    </GridBg>
  )
}

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          CSS Modules allow you to write component-scoped CSS without worrying about naming
          conflicts. Vite processes <C>.module.css</C> files automatically - no configuration
          needed.
        </P>
        <Callout>
          <strong>Zero Configuration:</strong> Vite handles CSS Modules natively. Any file ending
          in <C>.module.css</C> is automatically processed as a CSS Module.
        </Callout>
        <P className="mb-4">
          Create a new project with CSS Modules using the <C>--css-modules</C> flag:
        </P>
        <MultiTerminal
          tabs={[
            {
              id: 'npm',
              label: 'npm',
              command: `$ npx create-bini-app@latest my-app --css-modules`,
            },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm dlx create-bini-app@latest my-app --css-modules`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn dlx create-bini-app@latest my-app --css-modules`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bunx create-bini-app@latest my-app --css-modules`,
            },
          ]}
        />
        <P className="mb-4">
          Or use the interactive prompt and select <C>CSS Modules</C> under the styling question:
        </P>
        <PromptOutput
          lines={[
            { kind: 'question', text: 'Select a styling solution:' },
            { kind: 'option', text: 'Tailwind CSS' },
            { kind: 'option', text: 'CSS Modules', selected: true },
            { kind: 'option', text: 'None' },
            { kind: 'blank' },
            { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
          ]}
        />
        <P className="mb-4">Or combine with TypeScript:</P>
        <MultiTerminal
          tabs={[
            {
              id: 'npm',
              label: 'npm',
              command: `$ npx create-bini-app@latest my-app --css-modules --typescript`,
            },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm dlx create-bini-app@latest my-app --css-modules --typescript`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn dlx create-bini-app@latest my-app --css-modules --typescript`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bunx create-bini-app@latest my-app --css-modules --typescript`,
            },
          ]}
        />
      </div>

      <Section id="basic-usage" title="Basic Usage">
        <P className="mb-4">
          Create a <C>.module.css</C> file next to your component and import it:
        </P>
        <FolderVisual
          width={280}
          rows={[
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'components', d: 2 },
            { n: 'Button.module.css', d: 3, dot: true },
            { n: `Button.${e}`, d: 3 },
          ]}
        />
        <CodeBlock
          filename="src/app/components/Button.module.css"
          lang="text"
          code={`/* src/app/components/Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background: #06b6d4;
  color: black;
  border: none;
}

.primary:hover {
  background: #0891b2;
}`}
        />
        <CodeBlock
          filename={`src/app/components/Button.${e}`}
          tsCode={`// src/app/components/Button.tsx
import styles from './Button.module.css'

type ButtonProps = {
  variant?: 'primary'
  children: React.ReactNode
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button className={\`\${styles.button} \${styles[variant]}\`}>
      {children}
    </button>
  )
}`}
          jsCode={`// src/app/components/Button.jsx
import styles from './Button.module.css'

export function Button({ variant = 'primary', children }) {
  return (
    <button className={\`\${styles.button} \${styles[variant]}\`}>
      {children}
    </button>
  )
}`}
        />
        <P className="mt-4 mb-4">
          Vite rewrites every class name so it is unique to this file. The same <C>.button</C> in
          another module never collides:
        </P>
        <ClassMapVisual
          title="What the browser receives"
          rows={[
            ['.button', '._button_1k2x9_1'],
            ['.primary', '._primary_1k2x9_11'],
          ]}
        />
      </Section>

      <Section id="combining-classes" title="Combining Classes">
        <P className="mb-4">Combine multiple CSS Module classes using template literals:</P>
        <CodeBlock
          filename="src/app/components/Card.module.css"
          lang="text"
          code={`/* src/app/components/Card.module.css */
.card {
  background: #0a0a0a;
  border: 1px solid #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.featured {
  border-color: #06b6d4;
}

.large {
  padding: 2rem;
}`}
        />
        <CodeBlock
          filename={`src/app/components/Card.${e}`}
          tsCode={`// src/app/components/Card.tsx
import styles from './Card.module.css'

type CardProps = {
  featured?: boolean
  size?: 'normal' | 'large'
  children: React.ReactNode
}

export function Card({ featured, size = 'normal', children }: CardProps) {
  return (
    <div className={\`\${styles.card} \${featured ? styles.featured : ''} \${size === 'large' ? styles.large : ''}\`}>
      {children}
    </div>
  )
}`}
          jsCode={`// src/app/components/Card.jsx
import styles from './Card.module.css'

export function Card({ featured, size = 'normal', children }) {
  return (
    <div className={\`\${styles.card} \${featured ? styles.featured : ''} \${size === 'large' ? styles.large : ''}\`}>
      {children}
    </div>
  )
}`}
        />
        <Callout>
          Use the <C>clsx</C> or <C>classnames</C> library for cleaner conditional class
          composition.
        </Callout>
      </Section>

      <Section id="using-clsx" title="Using clsx for Cleaner Code">
        <P className="mb-4">
          Install <C>clsx</C> for cleaner conditional classes:
        </P>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install clsx` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add clsx` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add clsx` },
            { id: 'bun', label: 'bun', command: `$ bun add clsx` },
          ]}
        />
        <CodeBlock
          filename={`src/app/components/Card.${e}`}
          tsCode={`// src/app/components/Card.tsx
import clsx from 'clsx'
import styles from './Card.module.css'

type CardProps = {
  featured?: boolean
  size?: 'normal' | 'large'
  children: React.ReactNode
}

export function Card({ featured, size = 'normal', children }: CardProps) {
  return (
    <div className={clsx(
      styles.card,
      featured && styles.featured,
      size === 'large' && styles.large
    )}>
      {children}
    </div>
  )
}`}
          jsCode={`// src/app/components/Card.jsx
import clsx from 'clsx'
import styles from './Card.module.css'

export function Card({ featured, size = 'normal', children }) {
  return (
    <div className={clsx(
      styles.card,
      featured && styles.featured,
      size === 'large' && styles.large
    )}>
      {children}
    </div>
  )
}`}
        />
      </Section>

      <Section id="global-vs-local" title="Global vs Local Scope">
        <P className="mb-4">
          CSS Modules are locally scoped by default. Use <C>:global</C> to target global
          selectors:
        </P>
        <ClassMapVisual
          title="Local vs :global"
          rows={[
            ['.container', '._container_8f3ab_1'],
            [':global(.heading)', '.heading'],
            [':global(.dark)', '.dark'],
          ]}
        />
        <CodeBlock
          filename="src/app/components/Container.module.css"
          lang="text"
          code={`/* src/app/components/Container.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.container :global(.heading) {
  margin-bottom: 1rem;
}

:global(.dark) .container {
  background: #000;
}`}
        />
        <CodeBlock
          filename={`src/app/components/Container.${e}`}
          tsCode={`// src/app/components/Container.tsx
import styles from './Container.module.css'

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <h2 className="heading">Global class, styled from the module</h2>
      {children}
    </div>
  )
}`}
          jsCode={`// src/app/components/Container.jsx
import styles from './Container.module.css'

export function Container({ children }) {
  return (
    <div className={styles.container}>
      <h2 className="heading">Global class, styled from the module</h2>
      {children}
    </div>
  )
}`}
        />
      </Section>

      <Section id="composing-classes" title="Composing Classes">
        <P className="mb-4">
          Use <C>composes</C> to reuse styles from other classes:
        </P>
        <CodeBlock
          filename="src/app/components/Form.module.css"
          lang="text"
          code={`/* src/app/components/Form.module.css */
.baseInput {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0a0a0a;
  color: white;
}

.textInput {
  composes: baseInput;
}

.errorInput {
  composes: baseInput;
  border-color: #ef4444;
}`}
        />
        <CodeBlock
          filename={`src/app/components/Form.${e}`}
          code={`import styles from './Form.module.css'

export function Form() {
  return (
    <form>
      <input className={styles.textInput} placeholder="Name" />
      <input className={styles.errorInput} placeholder="Email (invalid)" />
    </form>
  )
}`}
        />
      </Section>

      <Section id="css-variables" title="CSS Variables in Modules">
        <P className="mb-4">Use CSS variables for dynamic styling within modules:</P>
        <CodeBlock
          filename="src/app/components/Progress.module.css"
          lang="text"
          code={`/* src/app/components/Progress.module.css */
.progress {
  height: 0.5rem;
  overflow: hidden;
  border-radius: 9999px;
  background: #1e293b;
}

.bar {
  height: 100%;
  width: var(--progress);
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  transition: width 0.3s ease;
}`}
        />
        <CodeBlock
          filename={`src/app/components/Progress.${e}`}
          tsCode={`// src/app/components/Progress.tsx
import styles from './Progress.module.css'

type ProgressProps = {
  value: number
  max?: number
}

export function Progress({ value, max = 100 }: ProgressProps) {
  const percentage = (value / max) * 100

  return (
    <div className={styles.progress}>
      <div
        className={styles.bar}
        style={{ '--progress': \`\${percentage}%\` } as React.CSSProperties}
      />
    </div>
  )
}`}
          jsCode={`// src/app/components/Progress.jsx
import styles from './Progress.module.css'

export function Progress({ value, max = 100 }) {
  const percentage = (value / max) * 100

  return (
    <div className={styles.progress}>
      <div
        className={styles.bar}
        style={{ '--progress': \`\${percentage}%\` }}
      />
    </div>
  )
}`}
        />
      </Section>

      <Section id="animations" title="Animations">
        <P className="mb-4">
          Define animations in CSS Modules. <C>@keyframes</C> names are scoped to the module too:
        </P>
        <CodeBlock
          filename="src/app/components/Spinner.module.css"
          lang="text"
          code={`/* src/app/components/Spinner.module.css */
.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #1e293b;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`}
        />
        <CodeBlock
          filename={`src/app/components/Spinner.${e}`}
          code={`import styles from './Spinner.module.css'

export function Spinner() {
  return <div className={styles.spinner} />
}`}
        />
      </Section>

      <Section id="media-queries" title="Media Queries">
        <P className="mb-4">Write responsive styles with media queries:</P>
        <CodeBlock
          filename="src/app/components/Grid.module.css"
          lang="text"
          code={`/* src/app/components/Grid.module.css */
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}`}
        />
        <CodeBlock
          filename={`src/app/components/Grid.${e}`}
          tsCode={`// src/app/components/Grid.tsx
import styles from './Grid.module.css'

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>
}`}
          jsCode={`// src/app/components/Grid.jsx
import styles from './Grid.module.css'

export function Grid({ children }) {
  return <div className={styles.grid}>{children}</div>
}`}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P className="mb-4">A full-featured modal component using CSS Modules:</P>
        <FolderVisual
          width={280}
          rows={[
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'components', d: 2 },
            { n: 'Modal.module.css', d: 3, dot: true },
            { n: `Modal.${e}`, d: 3 },
          ]}
        />
        <CodeBlock
          filename="src/app/components/Modal.module.css"
          lang="text"
          code={`/* src/app/components/Modal.module.css */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #0a0a0a;
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.close {
  background: transparent;
  color: #94a3b8;
  border: none;
  cursor: pointer;
}

.close:hover {
  color: white;
}

.body {
  color: #94a3b8;
}`}
        />
        <CodeBlock
          filename={`src/app/components/Modal.${e}`}
          tsCode={`// src/app/components/Modal.tsx
import styles from './Modal.module.css'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}`}
          jsCode={`// src/app/components/Modal.jsx
import styles from './Modal.module.css'

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}`}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function CSSModulesPage() {
  return (
    <DocPage
      title="CSS Modules"
      description="Learn how to use CSS Modules in Bini.js for component-scoped styling."
      url="https://bini.js.org/docs/css-modules"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/css-modules.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/tailwind', title: 'Tailwind CSS' }}
      next={{ to: '/docs/platform-web', title: 'Web' }}
    >
      <Content />
    </DocPage>
  )
}