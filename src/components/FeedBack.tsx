'use client'

import { Frown, Meh, Smile, Laugh } from 'lucide-react'
import { useState } from 'react'

const reactions = [
  {
    value: 1,
    label: 'Not helpful at all',
    icon: Frown,
    color: 'text-red-400',
    hoverColor: 'group-hover:text-red-400',
  },
  {
    value: 2,
    label: 'Not helpful',
    icon: Frown,
    color: 'text-orange-400',
    hoverColor: 'group-hover:text-orange-400',
  },
  {
    value: 3,
    label: 'Neutral',
    icon: Meh,
    color: 'text-yellow-400',
    hoverColor: 'group-hover:text-yellow-400',
  },
  {
    value: 4,
    label: 'Helpful',
    icon: Smile,
    color: 'text-green-400',
    hoverColor: 'group-hover:text-green-400',
  },
  {
    value: 5,
    label: 'Very helpful',
    icon: Laugh,
    color: 'text-blue-400',
    hoverColor: 'group-hover:text-blue-400',
  },
]

export function DocsFeedback() {
  const [selected, setSelected] = useState<number | null>(null)
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const handleSelect = (value: number) => {
    setSelected(value)

    setTimeout(() => {
      setVisible(false)
    }, 450)
  }

  return (
    <div
      className={`flex items-center gap-5 rounded-full border px-4 py-2.5 text-sm transition-all duration-500
        border-neutral-200 bg-white text-neutral-700
        dark:border-white/10 dark:bg-black dark:text-neutral-300
        ${selected !== null ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
    >
      <span className="whitespace-nowrap">Was this helpful?</span>

      <div className="flex items-center gap-1.5">
        {reactions.map((reaction) => {
          const Icon = reaction.icon
          const isSelected = selected === reaction.value

          return (
            <button
              key={reaction.value}
              type="button"
              aria-label={reaction.label}
              title={reaction.label}
              onClick={() => handleSelect(reaction.value)}
              className={`group flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200
                ${
                  isSelected
                    ? 'scale-110 bg-neutral-100 dark:bg-white/10'
                    : 'hover:scale-110 hover:bg-neutral-100 dark:hover:bg-white/5'
                }`}
            >
              <Icon
                strokeWidth={1.8}
                className={`h-[21px] w-[21px] transition-all duration-200 ${
                  isSelected
                    ? `${reaction.color} opacity-100`
                    : `text-neutral-400 dark:text-white/50 ${reaction.hoverColor} group-hover:opacity-100`
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
