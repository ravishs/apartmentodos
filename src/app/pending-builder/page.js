export const metadata = {
    title: "Pending from Builder | Mahaveer Sitara Owner's Welfare Association",
}

import DashboardLayout from '@/components/Dashboard/DashboardLayout'
import PendingBuilderTable from '@/components/PendingBuilder/PendingBuilderTable'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export default async function PendingBuilderPage() {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    const { data: tasks, error } = await supabase
        .from('pending_builder_tasks')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching pending tasks:', error)
    }

    let enhancedTasks = []
    if (tasks) {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()

        enhancedTasks = tasks.map(task => {
            const editor = users.find(u => u.id === task.last_edited_by) || users.find(u => u.id === task.created_by)
            return {
                ...task,
                editor: editor ? { email: editor.email } : null
            }
        })
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const currentUserRole = currentUser?.user_metadata?.role || 'resident'

    return (
        <DashboardLayout>
            <PendingBuilderTable initialTasks={enhancedTasks || []} currentUserId={currentUser?.id} currentUserRole={currentUserRole} />
        </DashboardLayout>
    )
}
