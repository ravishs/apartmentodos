import DashboardLayout from '@/components/Dashboard/DashboardLayout'
import WishlistTable from '@/components/Wishlist/WishlistTable'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export default async function WishlistPage() {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    // Fetch wishlist items
    const { data: items, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching wishlist items:', error)
    }

    // Enhance items with editor details (need admin client to fetch user emails by ID as these are public profiles)
    // For simplicity/security, we're fetching all users and mapping. 
    // In a large app, better to have a 'profiles' table.
    let enhancedItems = []
    if (items) {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()

        enhancedItems = items.map(item => {
            const editor = users.find(u => u.id === item.last_edited_by) || users.find(u => u.id === item.created_by)
            return {
                ...item,
                editor: editor ? { email: editor.email } : null
            }
        })
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const currentUserRole = currentUser?.user_metadata?.role || 'resident'

    return (
        <DashboardLayout>
            <WishlistTable initialItems={enhancedItems || []} currentUserId={currentUser?.id} currentUserRole={currentUserRole} />
        </DashboardLayout>
    )
}
