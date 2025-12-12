
'use client'

import { signup } from './actions'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material'
import AuthHeader from '@/components/AuthHeader/AuthHeader'

export default function SignupPage(props) {
    useEffect(() => {
        document.title = "Signup | Mahaveer Sitara Owner's Welfare Association"
    }, [])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(props?.searchParams?.error || null)
    const [success, setSuccess] = useState(props?.searchParams?.success || false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        
        try {
            await signup(formData)
            setSuccess(true)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <Box sx={{
                backgroundImage: "url('/bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh'
            }}>
                <AuthHeader />
                <Container component="main" maxWidth="sm">
                    <Box
                        sx={{
                            marginTop: { xs: 4, sm: 8 },
                            marginBottom: { xs: 4, sm: 8 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                            <Typography variant="h5" color="primary" gutterBottom>
                                Registration Successful
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                You'll be notified when your login credentials are active.
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Link href="/login" style={{ textDecoration: 'none' }}>
                                    <Button variant="text" color="primary">
                                        Back to Login
                                    </Button>
                                </Link>
                            </Box>
                        </Paper>
                    </Box>
                </Container>
            </Box>
        )
    }

    return (
        <Box sx={{
            backgroundImage: "url('/bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh'
        }}>
            <AuthHeader />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: { xs: 4, sm: 8 },
                        marginBottom: { xs: 4, sm: 8 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.9)' }}>
                        <Typography component="h1" variant="h5" align="center" gutterBottom>
                            Sign Up
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="Full Name"
                                name="fullName"
                                autoFocus
                                disabled={loading}
                                InputProps={{
                                    suppressHydrationWarning: true
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                type="email"
                                disabled={loading}
                                InputProps={{
                                    suppressHydrationWarning: true
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="mobile"
                                label="Mobile Number"
                                name="mobile"
                                type="tel"
                                disabled={loading}
                                InputProps={{
                                    suppressHydrationWarning: true
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="apartmentNumber"
                                label="Apartment Number"
                                name="apartmentNumber"
                                disabled={loading}
                                InputProps={{
                                    suppressHydrationWarning: true
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                disabled={loading}
                                InputProps={{
                                    suppressHydrationWarning: true
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Re-enter Password"
                                type="password"
                                id="confirmPassword"
                                disabled={loading}
                                InputProps={{
                                    suppressHydrationWarning: true
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', height: 48 }}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : null}
                            >
                                {loading ? 'Signing up...' : 'Sign up'}
                            </Button>
                        </form>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link href="/login" style={{ textDecoration: 'none' }}>
                                    <Typography component="span" color="primary" variant="body2">
                                        Log in
                                    </Typography>
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}
