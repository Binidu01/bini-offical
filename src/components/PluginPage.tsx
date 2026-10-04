// src/components/PluginPage.tsx
import { DocPage } from './DocBlocks'
import { PluginLayout } from './PluginSidebar'
import type { TocItem } from './TableOfContents'

type PagerTarget = { to: string; title: string }

export function PluginPage({
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
  children: React.ReactNode
}) {
  return (
    <DocPage
      title={title}
      badge={badge}
      description={description}
      url={url}
      editUrl={editUrl}
      toc={toc}
      prev={prev}
      next={next}
      layout={PluginLayout}
    >
      {children}
    </DocPage>
  )
}