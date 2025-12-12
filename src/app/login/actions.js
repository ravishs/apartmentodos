'use server'

import { revalidatePath } from 'next/cache'
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
        // Return structured error to the client so the client can handle navigation cleanly
        return { ok: false, error: error.message }
    }

    // Check if user is approved
    if (user?.user_metadata?.status === 'pending') {
        await supabase.auth.signOut()
        return { ok: false, error: 'Your account is pending approval by an administrator.' }
    }

    // Revalidate server cache for layout and return success so client can navigate
    revalidatePath('/', 'layout')
    return { ok: true }
}
