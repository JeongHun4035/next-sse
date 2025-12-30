import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-neutral-600">페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="text-sm underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
