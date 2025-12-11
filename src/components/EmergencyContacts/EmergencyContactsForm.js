'use client'

import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert
} from '@mui/material'
import { Save as SaveIcon } from '@mui/icons-material'
import { useState } from 'react'
import { saveEmergencyContacts } from '@/app/emergency-contacts/actions'

export default function EmergencyContactsForm({ initialData, currentUserRole = 'resident' }) {
    const isAdmin = currentUserRole === 'admin'
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setToast({ ...toast, open: false })
    }

    const showToast = (message, severity = 'success') => {
        setToast({ open: true, message, severity })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        if (initialData?.id) {
            formData.append('id', initialData.id)
        }

        const result = await saveEmergencyContacts(formData)

        if (result.error) {
            showToast(result.error, 'error')
        } else {
            showToast('Emergency contacts saved successfully', 'success')
        }
        setLoading(false)
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ pt: 2 }}>
                Emergency Contacts
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Electrician */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Electrician</Typography>
                        <TextField
                            fullWidth
                            hiddenLabel
                            name="electrician"
                            defaultValue={initialData?.electrician}
                            variant="outlined"
                            placeholder={isAdmin ? "Name - Phone Number" : ""}
                            disabled={!isAdmin}
                            InputProps={{
                                readOnly: !isAdmin,
                                sx: !isAdmin ? { bgcolor: 'grey.50' } : {}
                            }}
                        />
                    </Box>

                    {/* Plumber */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Plumber</Typography>
                        <TextField
                            fullWidth
                            hiddenLabel
                            name="plumber"
                            defaultValue={initialData?.plumber}
                            variant="outlined"
                            placeholder={isAdmin ? "Name - Phone Number" : ""}
                            disabled={!isAdmin}
                            InputProps={{
                                readOnly: !isAdmin,
                                sx: !isAdmin ? { bgcolor: 'grey.50' } : {}
                            }}
                        />
                    </Box>

                    {/* Security */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Main Gate Security</Typography>
                        <TextField
                            fullWidth
                            hiddenLabel
                            name="security"
                            defaultValue={initialData?.security}
                            variant="outlined"
                            placeholder={isAdmin ? "Name - Phone Number" : ""}
                            disabled={!isAdmin}
                            InputProps={{
                                readOnly: !isAdmin,
                                sx: !isAdmin ? { bgcolor: 'grey.50' } : {}
                            }}
                        />
                    </Box>

                    {/* Project Manager */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Project Manager</Typography>
                        <TextField
                            fullWidth
                            hiddenLabel
                            name="project_manager"
                            defaultValue={initialData?.project_manager}
                            variant="outlined"
                            placeholder={isAdmin ? "Name - Phone Number" : ""}
                            disabled={!isAdmin}
                            InputProps={{
                                readOnly: !isAdmin,
                                sx: !isAdmin ? { bgcolor: 'grey.50' } : {}
                            }}
                        />
                    </Box>

                    {/* Association */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Association Contact</Typography>
                        <TextField
                            fullWidth
                            hiddenLabel
                            name="association_contact"
                            defaultValue={initialData?.association_contact}
                            variant="outlined"
                            placeholder={isAdmin ? "Name - Phone Number" : ""}
                            disabled={!isAdmin}
                            InputProps={{
                                readOnly: !isAdmin,
                                sx: !isAdmin ? { bgcolor: 'grey.50' } : {}
                            }}
                        />
                    </Box>

                    {isAdmin && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<SaveIcon />}
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? 'Saving...' : 'Save Contacts'}
                            </Button>
                        </Box>
                    )}
                </Box>

            </Box>

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
        </Box >
    )
}
