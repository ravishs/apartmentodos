'use client'

import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Alert,
    Snackbar
} from '@mui/material'
import { Save as SaveIcon, Lock as LockIcon } from '@mui/icons-material'
import { useState } from 'react'
import { updateProfile, updatePassword } from '@/app/profile/actions'

export default function ProfileForm({ userData }) {
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

    const handleToastClose = () => {
        setToast({ ...toast, open: false })
    }

    const showToast = (message, severity = 'success') => {
        setToast({ open: true, message, severity })
    }

    const handleProfileSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await updateProfile(formData)

        if (result.error) {
            showToast(result.error, 'error')
        } else {
            showToast('Profile updated successfully', 'success')
        }
        setLoading(false)
    }

    const handlePasswordSubmit = async (event) => {
        event.preventDefault()
        setPasswordLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await updatePassword(formData)

        if (result.error) {
            showToast(result.error, 'error')
        } else {
            showToast('Password updated successfully', 'success')
            event.currentTarget.reset()
        }
        setPasswordLoading(false)
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', pt: 2 }}>
                My Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Update your personal information
            </Typography>

            {/* Profile Information */}
            <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleProfileSubmit}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        defaultValue={userData.fullName}
                        variant="outlined"
                        required
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        defaultValue={userData.email}
                        variant="outlined"
                        required
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        label="Mobile Number"
                        name="mobile"
                        type="tel"
                        defaultValue={userData.mobile}
                        variant="outlined"
                        required
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        label="Apartment Number"
                        name="apartmentNumber"
                        defaultValue={userData.apartmentNumber}
                        variant="outlined"
                        disabled
                        sx={{ mb: 3 }}
                        helperText="Contact an administrator to change your apartment number"
                    />
                    <TextField
                        fullWidth
                        label="Role"
                        value={userData.role}
                        variant="outlined"
                        disabled
                        sx={{ mb: 3 }}
                        helperText="Contact an administrator to change your role"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>

            {/* Change Password */}
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Change Password
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handlePasswordSubmit}>
                    <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        variant="outlined"
                        required
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        variant="outlined"
                        required
                        sx={{ mb: 3 }}
                        helperText="Minimum 6 characters"
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        variant="outlined"
                        required
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<LockIcon />}
                        disabled={passwordLoading}
                        fullWidth
                        color="secondary"
                    >
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleToastClose}
                    severity={toast.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
