export const metadata = {
    title: "Announcements | Mahaveer Sitara Owner's Welfare Association",
}

import DashboardLayout from '@/components/Dashboard/DashboardLayout'
import AnnouncementsBoard from '@/components/Announcements/AnnouncementsBoard'
import { createClient } from '@/utils/supabase/server'

export default async function AnnouncementsPage() {
    const supabase = await createClient()

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const currentUserRole = currentUser?.user_metadata?.role || 'resident'

    return (
        <DashboardLayout>
            <AnnouncementsBoard currentUserId={currentUser?.id} currentUserRole={currentUserRole} />
        </DashboardLayout>
    )
}
