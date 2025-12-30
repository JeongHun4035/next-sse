import Link from 'next/link'

import Header from '@/app/components/layout/Header'

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const guideMenu = [
    { name: 'Multi Modal', path: '/sse-guide/multi-modal' },
    { name: 'Markdown-it', path: '/sse-guide/markdown-it' },
    { name: 'SSE-Hook', path: '/sse-guide/sse-hook' },
  ]

  return (
    <>
      <Header
        leftSlot={
          <nav className="flex items-center gap-6">
            {guideMenu.map(menu => (
              <Link
                key={menu.path}
                href={menu.path}
                className="
                  text-sm font-medium text-neutral-600
                  transition-colors
                  hover:text-neutral-900
                "
              >
                {menu.name}
              </Link>
            ))}
          </nav>
        }
      />

      <main>{children}</main>
    </>
  )
}
