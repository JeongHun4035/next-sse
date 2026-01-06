'use client'

import { ReactNode } from 'react'

type HeaderProps = {
  leftSlot?: ReactNode
  centerSlot?: ReactNode
  rightSlot?: ReactNode
}

export default function Header({
  leftSlot,
  centerSlot,
  rightSlot,
}: HeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-50 h-14 w-full
        border-b border-black/5
        bg-gradient-to-b from-white/90 to-white/70
        backdrop-blur
        shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_6px_12px_-6px_rgba(0,0,0,0.08)]
      "
    >
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {leftSlot}
        </div>

        {/* CENTER */}
        <div className="flex flex-1 items-center justify-center">
          {centerSlot}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {rightSlot}
        </div>
      </div>
    </header>
  )
}
