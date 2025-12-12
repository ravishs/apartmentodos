"use client"

import { login } from './actions'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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

export default function LoginClient() {
  useEffect(() => {
    document.title = "Login | Mahaveer Sitara Owner's Welfare Association"
  }, [])

  const [loading, setLoading] = useState(false)

  // Prefer a descriptive error if provided in the URL (error_description or message).
  const searchParams = useSearchParams()

  const initialError = (() => {
    const normalize = (v) => (v == null ? null : String(v))

    const errDesc = normalize(searchParams.get('error_description')) || normalize(searchParams.get('error_description_text'))
    const msg = normalize(searchParams.get('message'))
    const err = normalize(searchParams.get('error'))

    if (errDesc) return errDesc
    if (msg) return msg

    // Some redirects may set error=NEXT_REDIRECT; prefer any descriptive field instead
    if (err === 'NEXT_REDIRECT') {
      return errDesc || msg || 'You were redirected. Please sign in to continue.'
    }

    // If error contains a human message, return it (e.g. ?error=Invalid%20login%20credentials)
    return err || null
  })()

  const [error, setError] = useState(initialError)

  // Keep error state in sync if search params change (client navigation)
  useEffect(() => {
    const normalize = (v) => (v == null ? null : String(v))
    const errDesc = normalize(searchParams.get('error_description')) || normalize(searchParams.get('error_description_text'))
    const msg = normalize(searchParams.get('message'))
    const err = normalize(searchParams.get('error'))

    let newErr = null
    if (errDesc) newErr = errDesc
    else if (msg) newErr = msg
    else if (err === 'NEXT_REDIRECT') newErr = errDesc || msg || 'You were redirected. Please sign in to continue.'
    else newErr = err || null

    setError(newErr)
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      await login(formData)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
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
              Welcome
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', height: 48 }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <Typography component="span" color="primary" variant="body2">
                    Sign up
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
