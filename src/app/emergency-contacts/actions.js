'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveEmergencyContacts(formData) {
    const supabase = await createClient()

    const electrician = formData.get('electrician')
    const plumber = formData.get('plumber')
    const security = formData.get('security')
    const project_manager = formData.get('project_manager')
    const association_contact = formData.get('association_contact')
    const id = formData.get('id') // If updating existing

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to save contacts' }
    }

    const dataToSave = {
        electrician,
        plumber,
        security,
        project_manager,
        association_contact,
        updated_at: new Date().toISOString(),
        updated_by: user.id
    }

    let error;

    if (id) {
        // Update existing
        const result = await supabase
            .from('emergency_contacts')
            .update(dataToSave)
            .eq('id', id)
        error = result.error
    } else {
        // Insert new (should ideally check if one exists first to enforce singleton if desired, but for now just insert)
        // Actually, let's check if any row exists to avoid duplicates if we treat it as a singleton config page
        const { data: existingRows } = await supabase.from('emergency_contacts').select('id').limit(1)

        if (existingRows && existingRows.length > 0) {
            const result = await supabase
                .from('emergency_contacts')
                .update(dataToSave)
                .eq('id', existingRows[0].id)
            error = result.error
        } else {
            const result = await supabase
                .from('emergency_contacts')
                .insert(dataToSave)
            error = result.error
        }
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/emergency-contacts')
    return { success: true }
}
