'use client'

import dynamic from 'next/dynamic'

const DashboardLayoutContent = dynamic(() => import('./DashboardLayoutContent'), { ssr: false })

export default function DashboardLayoutClientWrapper(props) {
    return <DashboardLayoutContent {...props} />
}
