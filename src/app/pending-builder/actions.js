'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addPendingTask(formData) {
    const supabase = await createClient()

    const title = formData.get('title')
    const description = formData.get('description') || ''
    const area = formData.get('area')
    const isUrgent = formData.get('isUrgent') === 'on' ? true : false

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to add a task' }
    }

    const { error } = await supabase
        .from('pending_builder_tasks')
        .insert({
            title,
            description,
            area,
            is_urgent: isUrgent,
            user_id: user.id,
            created_by: user.id, // Track creator
            last_edited_by: user.id // Track initial editor
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/pending-builder')
    return { success: true }
}

export async function updatePendingTask(formData) {
    const supabase = await createClient()

    const id = formData.get('id')
    const title = formData.get('title')
    const description = formData.get('description')
    const area = formData.get('area')
    const isUrgent = formData.get('isUrgent') === 'on' ? true : false

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to update a task' }
    }

    const { error } = await supabase
        .from('pending_builder_tasks')
        .update({
            title,
            description,
            area,
            is_urgent: isUrgent,
            updated_at: new Date().toISOString(),
            last_edited_by: user.id // Track last editor
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/pending-builder')
    return { success: true }
}

export async function deletePendingTask(id) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('pending_builder_tasks')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/pending-builder')
    return { success: true }
}
