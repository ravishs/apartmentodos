export const metadata = {
    title: "Emergency Contacts | Mahaveer Sitara Owner's Welfare Association",
}

import DashboardLayout from '@/components/Dashboard/DashboardLayout'
import EmergencyContactsForm from '@/components/EmergencyContacts/EmergencyContactsForm'
import { createClient } from '@/utils/supabase/server'

export default async function EmergencyContactsPage() {
    const supabase = await createClient()

    // Fetch the single row of contacts
    const { data: contacts } = await supabase
        .from('emergency_contacts')
        .select('*')
        .single()

    // Fetch current user for role check
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserRole = user?.user_metadata?.role || 'resident'

    return (
        <DashboardLayout>
            <EmergencyContactsForm initialData={contacts || {}} currentUserRole={currentUserRole} />
        </DashboardLayout>
    )
}
