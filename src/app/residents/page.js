
export const metadata = {
    title: "Residents | Mahaveer Sitara Owner's Welfare Association",
}

import DashboardLayout from '@/components/Dashboard/DashboardLayout'
import ResidentsTable from '@/components/Residents/ResidentsTable'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export default async function ResidentsPage() {
    const supabaseAdmin = createAdminClient()
    const supabase = await createClient()

    // Fetch current user to determine role
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const currentUserRole = currentUser?.user_metadata?.role || 'resident' // Default to resident if missing

    // This might fail if SUPABASE_SERVICE_ROLE_KEY is not set in .env.local
    // We wrap in try-catch to provide a graceful fallback or error message
    let residents = []
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

        if (users) {
            residents = users.map(user => ({
                id: user.id,
                name: user.user_metadata?.full_name || 'N/A',
                unit: user.user_metadata?.apartment_number || 'N/A',
                email: user.email,
                phone: user.user_metadata?.mobile || 'N/A',
                role: user.user_metadata?.role || 'resident', // Get role from metadata
                status: user.user_metadata?.status || 'Active' // Default to Active if status missing, or use pending
            }))
        }
    } catch (err) {
        console.error("Failed to fetch residents:", err)
        // Fallback/Empty list will be shown
    }

    return (
        <DashboardLayout>
            <ResidentsTable initialResidents={residents} currentUserRole={currentUserRole} currentUserId={currentUser?.id} />
        </DashboardLayout>
    )
}

