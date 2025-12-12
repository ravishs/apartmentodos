'use server'


import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'

async function getSupabaseServer() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Handle errors in server actions
                    }
                },
            },
        }
    )
}

export async function getAnnouncements() {
    try {
        const supabase = await getSupabaseServer()
        const { data, error } = await supabase
            .from('announcements')
            .select(`
                id,
                title,
                content,
                start_date,
                end_date,
                created_at,
                created_by,
                updated_at,
                last_edited_by
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching announcements:', error)
            return { data: [], error: error.message }
        }

        // Get unique user IDs to fetch their metadata
        const userIds = [...new Set(data.map(a => a.created_by))]
        if (userIds.length === 0) {
            return {
                data: data.map(announcement => ({
                    id: announcement.id,
                    title: announcement.title,
                    content: announcement.content,
                    startDate: announcement.start_date,
                    endDate: announcement.end_date,
                    author: 'Admin',
                    createdAt: new Date(announcement.created_at).toLocaleDateString(),
                    userId: announcement.created_by,
                    updatedAt: announcement.updated_at,
                    updatedBy: announcement.last_edited_by,
                })),
                error: null,
            }
        }



        // Fetch user metadata for author names using admin client
        const adminSupabase = createAdminClient()
        const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers()
        
        const userMap = new Map()
        if (users?.users && !usersError) {
            users.users.forEach(user => {
                userMap.set(user.id, user.user_metadata?.full_name || user.email || 'Admin')
            })
        }







        // Transform the data to match component expectations
        return {
            data: data.map(announcement => ({
                id: announcement.id,
                title: announcement.title,
                content: announcement.content,
                startDate: announcement.start_date,
                endDate: announcement.end_date,
                author: userMap.get(announcement.created_by) || 'Admin',
                createdAt: new Date(announcement.created_at).toLocaleDateString(),
                userId: announcement.created_by,
                updatedAt: announcement.updated_at,
                updatedBy: announcement.last_edited_by,
            })),
            error: null,
        }
    } catch (err) {
        console.error('Error in getAnnouncements:', err)
        return { data: [], error: err.message }
    }
}

export async function createAnnouncement(formData) {
    try {
        const supabase = await getSupabaseServer()

        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Not authenticated' }
        }

        // Check if user is admin
        const userRole = user.user_metadata?.role
        if (userRole !== 'admin') {
            return { success: false, error: 'Only admins can create announcements' }
        }

        const title = formData.get('title')
        const content = formData.get('content')
        const startDate = formData.get('startDate')
        const endDate = formData.get('endDate')

        if (!title || !content || !startDate || !endDate) {
            return { success: false, error: 'Missing required fields' }
        }


        const { error } = await supabase.from('announcements').insert({
            title,
            content,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            user_id: user.id,
            created_by: user.id,
        })

        if (error) {
            console.error('Error creating announcement:', error)
            return { success: false, error: error.message }
        }

        return { success: true, error: null }
    } catch (err) {
        console.error('Error in createAnnouncement:', err)
        return { success: false, error: err.message }
    }
}

export async function updateAnnouncement(id, formData) {
    try {
        const supabase = await getSupabaseServer()

        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Not authenticated' }
        }

        const title = formData.get('title')
        const content = formData.get('content')
        const startDate = formData.get('startDate')
        const endDate = formData.get('endDate')

        if (!title || !content || !startDate || !endDate) {
            return { success: false, error: 'Missing required fields' }
        }

        // Get the announcement to check permissions
        const { data: announcement, error: fetchError } = await supabase
            .from('announcements')
            .select('created_by')
            .eq('id', id)
            .single()

        if (fetchError || !announcement) {
            return { success: false, error: 'Announcement not found' }
        }

        // Check permissions: must be admin or creator
        const userRole = user.user_metadata?.role
        const isAdmin = userRole === 'admin'
        const isCreator = announcement.created_by === user.id

        if (!isAdmin && !isCreator) {
            return { success: false, error: 'You do not have permission to update this announcement' }
        }


        const { error: updateError } = await supabase
            .from('announcements')
            .update({
                title,
                content,
                start_date: new Date(startDate).toISOString(),
                end_date: new Date(endDate).toISOString(),
                updated_at: new Date().toISOString(),
                last_edited_by: user.id,
            })
            .eq('id', id)

        if (updateError) {
            console.error('Error updating announcement:', updateError)
            return { success: false, error: updateError.message }
        }

        return { success: true, error: null }
    } catch (err) {
        console.error('Error in updateAnnouncement:', err)
        return { success: false, error: err.message }
    }
}

export async function deleteAnnouncement(id) {
    try {
        const supabase = await getSupabaseServer()

        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Not authenticated' }
        }

        // Get the announcement to check permissions
        const { data: announcement, error: fetchError } = await supabase
            .from('announcements')
            .select('created_by')
            .eq('id', id)
            .single()

        if (fetchError || !announcement) {
            return { success: false, error: 'Announcement not found' }
        }

        // Check permissions: must be admin or creator
        const userRole = user.user_metadata?.role
        const isAdmin = userRole === 'admin'
        const isCreator = announcement.created_by === user.id

        if (!isAdmin && !isCreator) {
            return { success: false, error: 'You do not have permission to delete this announcement' }
        }

        const { error: deleteError } = await supabase
            .from('announcements')
            .delete()
            .eq('id', id)

        if (deleteError) {
            console.error('Error deleting announcement:', deleteError)
            return { success: false, error: deleteError.message }
        }

        return { success: true, error: null }
    } catch (err) {
        console.error('Error in deleteAnnouncement:', err)
        return { success: false, error: err.message }
    }
}
