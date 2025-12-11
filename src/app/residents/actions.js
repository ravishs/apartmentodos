'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function addUser(formData) {
    const supabase = createAdminClient()

    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    const fullName = formData.get('fullName')
    const mobile = formData.get('mobile')
    const apartmentNumber = formData.get('apartmentNumber')
    const role = formData.get('role') || 'resident'

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" }
    }

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm since admin is creating it
        user_metadata: {
            full_name: fullName,
            mobile: mobile,
            apartment_number: apartmentNumber,
            role: role,
            status: 'Active', // Default to Active when admin creates
        }
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/residents')
    return { success: true }
}

export async function updateUser(formData) {
    const supabase = createAdminClient()

    const userId = formData.get('userId')
    const email = formData.get('email')
    const fullName = formData.get('fullName')
    const mobile = formData.get('mobile')
    const apartmentNumber = formData.get('apartmentNumber')
    const role = formData.get('role')

    // Optional password update
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password && password !== confirmPassword) {
        return { error: "Passwords do not match" }
    }

    const updates = {
        email,
        user_metadata: {
            full_name: fullName,
            mobile: mobile,
            apartment_number: apartmentNumber,
            role: role,
        }
    }

    if (password) {
        updates.password = password
    }

    const { error } = await supabase.auth.admin.updateUserById(userId, updates)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/residents')
    return { success: true }
}

export async function deleteUser(userId) {
    const supabase = createAdminClient()

    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/residents')
    return { success: true }
}
