'use client'

import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Paper,
    Chip,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    IconButton,
    Snackbar,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material'
import { useState } from 'react'
import { addUser, updateUser, deleteUser } from '@/app/residents/actions'

export default function ResidentsTable({ initialResidents = [], currentUserRole = 'resident', currentUserId }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const [selectedUser, setSelectedUser] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    // Toast state
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

    // Add User Handlers
    const handleClickOpen = () => {
        setOpen(true)
        setError(null)
    }

    const handleClose = () => {
        setOpen(false)
        setError(null)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const result = await addUser(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleClose()
            showToast('User added successfully', 'success')
        }
    }

    // Edit User Handlers
    const handleEditClick = (user) => {
        setSelectedUser(user)
        setEditOpen(true)
        setError(null)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setSelectedUser(null)
        setError(null)
    }

    const handleUpdateSubmit = async (event) => {
        event.preventDefault()
        if (!selectedUser) return;

        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        formData.append('userId', selectedUser.id) // Append ID strictly

        const result = await updateUser(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleEditClose()
            showToast('User updated successfully', 'success')
        }
    }

    // Delete User Handlers
    const handleDeleteClick = (user) => {
        setSelectedUser(user)
        setDeleteOpen(true)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false)
        setSelectedUser(null)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;

        setLoading(true)
        const result = await deleteUser(selectedUser.id)

        if (result.error) {
            setError(result.error) // Should probably show toast or alert, but for now...
            console.error(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleDeleteClose()
            showToast('User deleted successfully', 'success')
        }
    }

    // Filter residents based on search query
    const filteredResidents = initialResidents.filter(resident => {
        const query = searchQuery.toLowerCase()
        return (
            resident.name.toLowerCase().includes(query) ||
            resident.email.toLowerCase().includes(query) ||
            resident.phone.toLowerCase().includes(query)
        )
    })

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pt: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Residents Directory
                </Typography>
            </Box>

            <TextField
                placeholder="Search by name, email, or mobile number..."
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 3 }}
            />

            <TableContainer component={Paper} elevation={2} sx={{ mt: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="residents table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell>Resident</TableCell>
                            <TableCell>Apartment Units</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredResidents.map((resident) => (
                            <TableRow
                                key={resident.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {resident.name ? resident.name.charAt(0) : 'U'}
                                        </Avatar>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {resident.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{resident.unit}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="caption">{resident.email}</Typography>
                                        <Typography variant="caption" color="text.secondary">{resident.phone}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {currentUserRole === 'admin' ? (
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={resident.role || 'resident'}
                                                disabled={resident.id === currentUserId}
                                                onChange={async (e) => {
                                                    const formData = new FormData()
                                                    formData.append('userId', resident.id)
                                                    formData.append('fullName', resident.name)
                                                    formData.append('email', resident.email)
                                                    formData.append('mobile', resident.phone)
                                                    formData.append('role', e.target.value)
                                                    formData.append('apartmentNumber', resident.unit)
                                                    const result = await updateUser(formData)
                                                    if (result.error) {
                                                        showToast(result.error, 'error')
                                                    } else {
                                                        showToast('Role updated successfully', 'success')
                                                    }
                                                }}
                                            >
                                                <MenuItem value="resident">Resident</MenuItem>
                                                <MenuItem value="admin">Admin</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <Chip
                                            label={resident.role || 'resident'}
                                            color={resident.role === 'admin' ? 'primary' : 'default'}
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={resident.status}
                                        color={resident.status === 'Active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {currentUserRole === 'admin' && (
                                        <>
                                            <IconButton onClick={() => handleEditClick(resident)} color="primary" size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(resident)} color="error" size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredResidents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        {searchQuery ? 'No residents match your search.' : 'No residents found.'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add User Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Resident</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="fullName"
                            name="fullName"
                            label="Full Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="mobile"
                            name="mobile"
                            label="Mobile Number"
                            type="tel"
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                label="Role"
                                defaultValue="resident"
                                disabled={currentUserRole !== 'admin'}
                            >
                                <MenuItem value="resident">Resident</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            id="apartmentNumber"
                            name="apartmentNumber"
                            label="Apartment Number"
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Re-enter Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            required
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Adding...' : 'Add User'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Resident</DialogTitle>
                <form onSubmit={handleUpdateSubmit}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="fullName"
                            name="fullName"
                            label="Full Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                            defaultValue={selectedUser?.name}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            required
                            defaultValue={selectedUser?.email}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="mobile"
                            name="mobile"
                            label="Mobile Number"
                            type="tel"
                            fullWidth
                            variant="outlined"
                            required
                            defaultValue={selectedUser?.phone}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                            <InputLabel id="edit-role-label">Role</InputLabel>
                            <Select
                                labelId="edit-role-label"
                                id="role"
                                name="role"
                                label="Role"
                                defaultValue={selectedUser?.role || 'resident'}
                                disabled={currentUserRole !== 'admin'}
                            >
                                <MenuItem value="resident">Resident</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                            <InputLabel id="edit-status-label">Status</InputLabel>
                            <Select
                                labelId="edit-status-label"
                                id="status"
                                name="status"
                                label="Status"
                                defaultValue={selectedUser?.status || 'Active'}
                                disabled={currentUserRole !== 'admin'}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Approved">Approved</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            id="apartmentNumber"
                            name="apartmentNumber"
                            label="Apartment Number"
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                            defaultValue={selectedUser?.unit}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, mt: 2 }}>
                            Leave password blank to keep current password
                        </Typography>
                        <TextField
                            margin="dense"
                            id="password"
                            name="password"
                            label="New Password (Optional)"
                            type="password"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Re-enter New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleEditClose} variant="outlined" color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Details'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleDeleteClose} variant="outlined" color="inherit">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete User'}
                    </Button>
                </DialogActions>
            </Dialog>

            {currentUserRole === 'admin' && (
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleClickOpen}
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                    }}
                >
                    <AddIcon />
                </Fab>
            )}

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

