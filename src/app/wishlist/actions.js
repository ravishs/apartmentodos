'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addWishlistItem(formData) {
    const supabase = await createClient()

    const title = formData.get('title')
    const description = formData.get('description') || ''
    const area = formData.get('area')
    const isUrgent = formData.get('isUrgent') === 'on' ? true : false

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to add an item' }
    }

    const { error } = await supabase
        .from('wishlist_items')
        .insert({
            title,
            description,
            area,
            is_urgent: isUrgent,
            user_id: user.id,
            created_by: user.id,
            last_edited_by: user.id
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/wishlist')
    return { success: true }
}

export async function updateWishlistItem(formData) {
    const supabase = await createClient()

    const id = formData.get('id')
    const title = formData.get('title')
    const description = formData.get('description')
    const area = formData.get('area')
    const isUrgent = formData.get('isUrgent') === 'on' ? true : false

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to update an item' }
    }

    const { error } = await supabase
        .from('wishlist_items')
        .update({
            title,
            description,
            area,
            is_urgent: isUrgent,
            updated_at: new Date().toISOString(),
            last_edited_by: user.id
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/wishlist')
    return { success: true }
}

export async function deleteWishlistItem(id) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/wishlist')
    return { success: true }
}
