import DashboardLayoutClientWrapper from './DashboardLayoutClientWrapper'
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/login/actions'

export default async function DashboardLayout({ children }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return <DashboardLayoutClientWrapper user={user} signout={signout}>{children}</DashboardLayoutClientWrapper>
}
