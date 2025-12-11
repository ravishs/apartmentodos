'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function updateProfile(formData) {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('fullName')
    const email = formData.get('email')
    const mobile = formData.get('mobile')
    const apartmentNumber = formData.get('apartmentNumber')

    try {
        // Update user metadata
        const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            {
                email: email,
                user_metadata: {
                    full_name: fullName,
                    mobile: mobile,
                    apartment_number: apartmentNumber,
                    role: user.user_metadata?.role || 'resident',
                    status: user.user_metadata?.status || 'Active'
                }
            }
        )

        if (updateError) {
            console.error('Error updating profile:', updateError)
            return { error: updateError.message }
        }

        revalidatePath('/profile')
        return { success: true }
    } catch (err) {
        console.error('Error updating profile:', err)
        return { error: 'Failed to update profile' }
    }
}

export async function updatePassword(formData) {
    const supabase = await createClient()

    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    if (newPassword !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    try {
        // Update password
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            return { error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error('Error updating password:', err)
        return { error: 'Failed to update password' }
    }
}
