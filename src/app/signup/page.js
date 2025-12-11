
import { signup } from './actions'
import Link from 'next/link'
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
} from '@mui/material'
import AuthHeader from '@/components/AuthHeader/AuthHeader'

export default async function SignupPage(props) {
    const searchParams = await props.searchParams
    const error = searchParams?.error
    const success = searchParams?.success

    if (success) {
        return (
            <Box>
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
                        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
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
        <Box>
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
                    <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                        <Typography component="h1" variant="h5" align="center" gutterBottom>
                            Sign Up
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form action={signup} style={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="Full Name"
                                name="fullName"
                                autoFocus
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
                                InputProps={{
                                    suppressHydrationWarning: true
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', height: 48 }}
                            >
                                Sign up
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
