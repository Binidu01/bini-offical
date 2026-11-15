// src/app/docs/layout.tsx
import type { ReactNode } from 'react'

import { LangProvider } from '../../components/DocBlocks'
import { DocLayout } from '../../components/DocSidebar'
import { Header, Footer } from '../../components/Layout'

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <div className="min-h-screen bg-white font-sans antialiased dark:bg-black">
        <Header />
        <div className="pt-16 lg:pt-20">
          <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-12 xl:px-16">
            <DocLayout>{children}</DocLayout>
          </div>
        </div>
        <Footer />
      </div>
    </LangProvider>
  )
}