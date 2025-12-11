
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/Dashboard/DashboardLayout'
import DashboardHome from '@/components/Dashboard/DashboardHome'

export default async function Home() {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch statistics
  let totalUsers = 0
  let pendingBuilderCount = 0
  let pendingWishlistCount = 0
  let urgentBuilderCount = 0
  let urgentWishlistCount = 0
  let emergencyContacts = null

  try {
    // Get total users count
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    totalUsers = users?.length || 0

    // Get pending builder tasks count
    const { count: builderCount } = await supabase
      .from('pending_builder_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    pendingBuilderCount = builderCount || 0

    // Get urgent builder tasks count
    const { count: urgentBuilderTasksCount } = await supabase
      .from('pending_builder_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('is_urgent', true)
      .eq('status', 'pending')

    urgentBuilderCount = urgentBuilderTasksCount || 0

    // Get pending wishlist items count
    const { count: wishlistCount } = await supabase
      .from('wishlist_items')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    pendingWishlistCount = wishlistCount || 0

    // Get urgent wishlist items count
    const { count: urgentWishlistItemsCount } = await supabase
      .from('wishlist_items')
      .select('*', { count: 'exact', head: true })
      .eq('is_urgent', true)
      .eq('status', 'pending')

    urgentWishlistCount = urgentWishlistItemsCount || 0

    // Get emergency contacts
    const { data: contacts } = await supabase
      .from('emergency_contacts')
      .select('*')
      .single()

    emergencyContacts = contacts
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  }

  const dashboardData = {
    totalUsers,
    pendingBuilderCount,
    pendingWishlistCount,
    urgentBuilderCount,
    urgentWishlistCount,
    emergencyContacts
  }

  return (
    <DashboardLayout>
      <DashboardHome data={dashboardData} />
    </DashboardLayout>
  )
}
