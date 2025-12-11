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
    FormControl,
    FormControlLabel,
    Switch,
    Tooltip,
    Avatar,
    Tabs,
    Tab
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material'
import { useState } from 'react'
import { addWishlistItem, updateWishlistItem, deleteWishlistItem } from '@/app/wishlist/actions'

export default function WishlistTable({ initialItems = [], currentUserId, currentUserRole = 'resident' }) {
    const isAdmin = currentUserRole === 'admin'
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [selectedItem, setSelectedItem] = useState(null)
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

    // Add Item Handlers
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
        const result = await addWishlistItem(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleClose()
            showToast('Wishlist item added successfully', 'success')
        }
    }

    // Edit Item Handlers
    const handleEditClick = (item) => {
        setSelectedItem(item)
        setEditOpen(true)
        setError(null)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setSelectedItem(null)
        setError(null)
    }

    const handleUpdateSubmit = async (event) => {
        event.preventDefault()
        if (!selectedItem) return;

        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        formData.append('id', selectedItem.id)

        const result = await updateWishlistItem(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleEditClose()
            showToast('Wishlist item updated successfully', 'success')
        }
    }

    // Delete Item Handlers
    const handleDeleteClick = (item) => {
        setSelectedItem(item)
        setDeleteOpen(true)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false)
        setSelectedItem(null)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedItem) return;

        setLoading(true)
        const result = await deleteWishlistItem(selectedItem.id)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleDeleteClose()
            showToast('Wishlist item deleted successfully', 'success')
        }
    }

    // Tab State
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const filteredItems = tabValue === 0
        ? initialItems
        : initialItems.filter(item => item.user_id === currentUserId || item.created_by === currentUserId)

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pt: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Wishlist
                </Typography>
            </Box>

            <Paper square sx={{ width: '100%', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="wishlist filters">
                    <Tab label="All Items" />
                    <Tab label="Reported by me" />
                </Tabs>
            </Paper>

            <TableContainer component={Paper} elevation={2}>
                <Table sx={{ minWidth: 650 }} aria-label="wishlist table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell>Sl No.</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Area</TableCell>
                            <TableCell>Urgent</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Comments</TableCell>
                            <TableCell>Updated By</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItems.map((item, index) => (
                            <TableRow
                                key={item.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" scope="row" fontWeight="bold">
                                    {item.title}
                                </TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.area}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.is_urgent ? 'Yes' : 'No'}
                                        color={item.is_urgent ? 'error' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {isAdmin ? (
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={item.status || 'pending'}
                                                onChange={async (e) => {
                                                    const formData = new FormData()
                                                    formData.append('id', item.id)
                                                    formData.append('status', e.target.value)
                                                    formData.append('title', item.title)
                                                    formData.append('description', item.description || '')
                                                    formData.append('area', item.area || '')
                                                    formData.append('isUrgent', item.is_urgent ? 'on' : '')
                                                    formData.append('comments', item.comments || '')
                                                    const result = await updateWishlistItem(formData)
                                                    if (result.error) {
                                                        showToast(result.error, 'error')
                                                    } else {
                                                        showToast('Status updated successfully', 'success')
                                                    }
                                                }}
                                            >
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="done">Done</MenuItem>
                                                <MenuItem value="invalid">Invalid</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <Chip
                                            label={item.status || 'pending'}
                                            color={
                                                item.status === 'done' ? 'success' :
                                                    item.status === 'invalid' ? 'error' :
                                                        'warning'
                                            }
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{item.comments}</TableCell>
                                <TableCell>
                                    {item.editor ? (
                                        <Tooltip title={`Last edited by: ${item.editor.email}`}>
                                            <Chip
                                                avatar={<Avatar>{item.editor.email[0].toUpperCase()}</Avatar>}
                                                label={item.editor.email.split('@')[0]}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">Unknown</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEditClick(item)} color="primary" size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(item)} color="error" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No wishlist items found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Item Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Item</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            name="title"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                            <InputLabel id="area-label">Area</InputLabel>
                            <Select
                                labelId="area-label"
                                id="area"
                                name="area"
                                label="Area"
                                defaultValue="House Specific"
                            >
                                <MenuItem value="Block">Block</MenuItem>
                                <MenuItem value="Community">Community</MenuItem>
                                <MenuItem value="House Specific">House Specific</MenuItem>
                                <MenuItem value="Security">Security</MenuItem>
                                <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={<Switch name="isUrgent" color="error" />}
                            label="Urgent (Yes/No)"
                            sx={{ mb: 2, display: 'block' }}
                        />
                        <TextField
                            margin="dense"
                            id="comments"
                            name="comments"
                            label="Comments"
                            type="text"
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Item'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Edit Item Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Item</DialogTitle>
                <form onSubmit={handleUpdateSubmit}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            name="title"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                            defaultValue={selectedItem?.title}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            defaultValue={selectedItem?.description}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                            <InputLabel id="edit-area-label">Area</InputLabel>
                            <Select
                                labelId="edit-area-label"
                                id="area"
                                name="area"
                                label="Area"
                                defaultValue={selectedItem?.area || 'House Specific'}
                            >
                                <MenuItem value="Block">Block</MenuItem>
                                <MenuItem value="Community">Community</MenuItem>
                                <MenuItem value="House Specific">House Specific</MenuItem>
                                <MenuItem value="Security">Security</MenuItem>
                                <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={<Switch name="isUrgent" defaultChecked={selectedItem?.is_urgent} color="error" />}
                            label="Urgent (Yes/No)"
                            sx={{ mb: 2, display: 'block' }}
                        />
                        <TextField
                            margin="dense"
                            id="comments"
                            name="comments"
                            label="Comments"
                            type="text"
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                            defaultValue={selectedItem?.comments}
                            sx={{ mb: 2 }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleEditClose} variant="outlined" color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Item'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleDeleteClose} variant="outlined" color="inherit">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete Item'}
                    </Button>
                </DialogActions>
            </Dialog>

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
