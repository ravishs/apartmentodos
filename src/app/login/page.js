import React, { Suspense } from 'react'
import LoginClient from './LoginClient'

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '50vh' }}>Loading…</div>}>
      <LoginClient />
    </Suspense>
  )
}
