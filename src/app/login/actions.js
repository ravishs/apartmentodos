'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function login(formData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const { data: { user }, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/?error=' + encodeURIComponent(error.message))
    }

    // Check if user is approved
    if (user?.user_metadata?.status === 'pending') {
        await supabase.auth.signOut()
        redirect('/?error=' + encodeURIComponent('Your account is pending approval by an administrator.'))
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
