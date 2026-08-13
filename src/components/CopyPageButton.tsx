// src/components/CopyPageButton.tsx
import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// ────────────────────────────────────────────────────────────────────────────────
// Small inline brand marks (kept as raw SVG so we don't pull in extra deps)
// ────────────────────────────────────────────────────────────────────────────────
const ClaudeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2 13.6 8.6 20.2 6.4 15.6 11.6 22 13.2 15.2 14.8 17.4 21 12 16.8 6.6 21 8.8 14.8 2 13.2 8.4 11.6 3.8 6.4 10.4 8.6Z" />
  </svg>
)

const ChatGPTIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 10.8 0a6.05 6.05 0 0 0-5.77 4.2 5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .75 7.09 5.98 5.98 0 0 0 .52 4.91 6.05 6.05 0 0 0 6.51 2.9A6.07 6.07 0 0 0 13.2 24a6.05 6.05 0 0 0 5.77-4.2 5.98 5.98 0 0 0 4-2.9 6.05 6.05 0 0 0-.75-7.08ZM13.2 22.4a4.5 4.5 0 0 1-2.9-1.05l.14-.08 4.8-2.77a.8.8 0 0 0 .4-.69v-6.77l2.03 1.17a.07.07 0 0 1 .04.06v5.6A4.53 4.53 0 0 1 13.2 22.4ZM3.9 18.4a4.5 4.5 0 0 1-.54-3.03l.14.09 4.8 2.77a.79.79 0 0 0 .8 0l5.86-3.38v2.34a.08.08 0 0 1-.03.07l-4.85 2.8a4.53 4.53 0 0 1-6.18-1.66ZM2.63 8.1A4.5 4.5 0 0 1 5 6.11v5.7a.79.79 0 0 0 .4.68l5.85 3.38-2.03 1.17a.08.08 0 0 1-.07 0l-4.85-2.8a4.53 4.53 0 0 1-1.67-6.14Zm16.7 3.88-5.86-3.39L15.5 7.42a.08.08 0 0 1 .07 0l4.85 2.8a4.52 4.52 0 0 1-.68 8.16v-5.7a.8.8 0 0 0-.4-.69ZM21.5 9l-.14-.09-4.8-2.77a.8.8 0 0 0-.8 0L9.9 9.52V7.18a.07.07 0 0 1 .03-.07l4.85-2.79A4.53 4.53 0 0 1 21.5 9ZM8.8 12.86 6.77 11.7a.07.07 0 0 1-.04-.06v-5.6a4.53 4.53 0 0 1 7.42-3.48l-.14.08-4.8 2.77a.8.8 0 0 0-.4.69l-.01 6.76Zm1.1-2.38 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5v-3Z" />
  </svg>
)

// ────────────────────────────────────────────────────────────────────────────────
// Assistant options
// ────────────────────────────────────────────────────────────────────────────────
type AssistantId = 'chatgpt' | 'claude'

const ASSISTANTS: Record<AssistantId, { label: string; icon: React.ReactNode; base: string }> = {
  chatgpt: { label: 'ChatGPT', icon: <ChatGPTIcon />, base: 'https://chatgpt.com/?q=' },
  claude: { label: 'Claude', icon: <ClaudeIcon />, base: 'https://claude.ai/new?q=' },
}

const STORAGE_KEY = 'bini-docs-preferred-assistant'

function isAssistantId(value: string | null): value is AssistantId {
  return value === 'chatgpt' || value === 'claude'
}

function getStoredAssistant(): AssistantId {
  if (typeof window === 'undefined') return 'chatgpt'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isAssistantId(stored) ? stored : 'chatgpt'
}

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────
interface CopyPageButtonProps {
  /** Public URL of the current doc page, used to build the AI-assistant prompts */
  pageUrl?: string
  /** Title used in the prompt text sent to the assistant */
  pageTitle?: string
}

export function CopyPageButton({
  pageUrl = 'https://bini.js.org/docs',
  pageTitle = 'Bini.js Docs',
}: CopyPageButtonProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<AssistantId>(getStoredAssistant)
  const rootRef = useRef<HTMLDivElement>(null)

  const resolvedUrl =
    pageUrl ?? (typeof window !== 'undefined' ? window.location.href : 'https://bini.js.org/docs')

  // Stay in sync if the preference changes in another tab, or was updated
  // by another instance of this button on the same page (e.g. mobile + desktop copies)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && isAssistantId(e.newValue)) {
        setSelected(e.newValue)
      }
    }
    function onPreferenceChange(e: Event) {
      const id = (e as CustomEvent<AssistantId>).detail
      if (isAssistantId(id)) setSelected(id)
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('bini-assistant-change', onPreferenceChange)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('bini-assistant-change', onPreferenceChange)
    }
  }, [])

  // Close on outside click / Escape
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function openAssistant(id: AssistantId) {
    const prompt = `Read ${resolvedUrl} so I can ask questions about ${pageTitle}.`
    window.open(`${ASSISTANTS[id].base}${encodeURIComponent(prompt)}`, '_blank', 'noopener,noreferrer')
  }

  function persistSelection(id: AssistantId) {
    setSelected(id)
    try {
      window.localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // localStorage unavailable (private mode, etc.) — selection still works for this render
    }
    // Notify any other CopyPageButton instances mounted on the current page
    window.dispatchEvent(new CustomEvent('bini-assistant-change', { detail: id }))
  }

  function handleMainClick() {
    openAssistant(selected)
  }

  function handleSelect(id: AssistantId) {
    persistSelection(id)
    setOpen(false)
    openAssistant(id)
  }

  const current = ASSISTANTS[selected]

  return (
    <div ref={rootRef} className="relative inline-flex">
      <div className="flex items-stretch rounded-lg border border-white/10 bg-white/5 overflow-hidden transition-all duration-200 hover:border-white/20 hover:bg-white/10">
        <button
          type="button"
          onClick={handleMainClick}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          <span className="text-white/60">{current.icon}</span>
          <span>Ask {current.label}</span>
        </button>
        <button
          type="button"
          aria-label="Choose assistant"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center px-2 border-l border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors duration-200"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/50 py-1.5 z-50">
          {(Object.keys(ASSISTANTS) as AssistantId[]).map((id) => {
            const assistant = ASSISTANTS[id]
            const isSelected = id === selected
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors duration-150 group"
              >
                <span className="w-7 h-7 shrink-0 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white/80 group-hover:border-white/20 transition-colors duration-200">
                  {assistant.icon}
                </span>
                <span className="flex-1 text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-200">
                  Ask {assistant.label}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CopyPageButton