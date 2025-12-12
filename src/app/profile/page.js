export const metadata = {
    title: "Profile | Mahaveer Sitara Owner's Welfare Association",
}

import DashboardLayout from '@/components/Dashboard/DashboardLayout'
import ProfileForm from '@/components/Profile/ProfileForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const userData = {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || '',
        mobile: user.user_metadata?.mobile || '',
        apartmentNumber: user.user_metadata?.apartment_number || '',
        role: user.user_metadata?.role || 'resident'
    }

    return (
        <DashboardLayout>
            <ProfileForm userData={userData} />
        </DashboardLayout>
    )
}
