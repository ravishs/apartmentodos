'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData) {
    const supabase = await createClient()

    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    const fullName = formData.get('fullName')
    const mobile = formData.get('mobile')
    const apartmentNumber = formData.get('apartmentNumber')

    if (password !== confirmPassword) {
        redirect('/signup?error=' + encodeURIComponent("Passwords do not match"))
    }

    const data = {
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                mobile: mobile,
                apartment_number: apartmentNumber,
                role: 'resident', // Default role for self-signup
                status: 'pending', // User is pending approval
            },
        },
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/signup?error=' + encodeURIComponent(error.message))
    }

    // Redirect to a success page or back to login with a message
    redirect('/signup?success=true')
}
