// src/app/plugins/layout.tsx
import type { ReactNode } from 'react'

import { LangProvider } from '../../components/DocBlocks'
import { Header, Footer } from '../../components/Layout'
import { PluginLayout } from '../../components/PluginSidebar'

export default function PluginsRootLayout({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <div className="min-h-screen bg-white font-sans antialiased dark:bg-black">
        <Header />
        <div className="pt-16 lg:pt-20">
          <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-12 xl:px-16">
            <PluginLayout>{children}</PluginLayout>
          </div>
        </div>
        <Footer />
      </div>
    </LangProvider>
  )
}