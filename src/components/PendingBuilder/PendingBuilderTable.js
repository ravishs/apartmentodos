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
import { addPendingTask, updatePendingTask, deletePendingTask } from '@/app/pending-builder/actions'

export default function PendingBuilderTable({ initialTasks = [], currentUserId, currentUserRole = 'resident' }) {
    const isAdmin = currentUserRole === 'admin'
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [selectedTask, setSelectedTask] = useState(null)
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

    // Add Task Handlers
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
        const result = await addPendingTask(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleClose()
            showToast('Task added successfully', 'success')
        }
    }

    // Edit Task Handlers
    const handleEditClick = (task) => {
        setSelectedTask(task)
        setEditOpen(true)
        setError(null)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setSelectedTask(null)
        setError(null)
    }

    const handleUpdateSubmit = async (event) => {
        event.preventDefault()
        if (!selectedTask) return;

        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        formData.append('id', selectedTask.id)

        const result = await updatePendingTask(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleEditClose()
            showToast('Task updated successfully', 'success')
        }
    }

    // Delete Task Handlers
    const handleDeleteClick = (task) => {
        setSelectedTask(task)
        setDeleteOpen(true)
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false)
        setSelectedTask(null)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedTask) return;

        setLoading(true)
        const result = await deletePendingTask(selectedTask.id)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            showToast(result.error, 'error')
        } else {
            setLoading(false)
            handleDeleteClose()
            showToast('Task deleted successfully', 'success')
        }
    }

    // Tab State
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const filteredTasks = tabValue === 0
        ? initialTasks
        : initialTasks.filter(task => task.user_id === currentUserId || task.created_by === currentUserId)

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pt: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Pending from Builder
                </Typography>
            </Box>

            <Paper square sx={{ width: '100%', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="task filters">
                    <Tab label="All Tasks" />
                    <Tab label="Reported by me" />
                </Tabs>
            </Paper>

            <TableContainer component={Paper} elevation={2}>
                <Table sx={{ minWidth: 650 }} aria-label="pending builder tasks table">
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
                        {filteredTasks.map((task, index) => (
                            <TableRow
                                key={task.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" scope="row" fontWeight="bold">
                                    {task.title}
                                </TableCell>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{task.area}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={task.is_urgent ? 'Yes' : 'No'}
                                        color={task.is_urgent ? 'error' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {isAdmin ? (
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={task.status || 'pending'}
                                                onChange={async (e) => {
                                                    const formData = new FormData()
                                                    formData.append('id', task.id)
                                                    formData.append('status', e.target.value)
                                                    formData.append('title', task.title)
                                                    formData.append('description', task.description || '')
                                                    formData.append('area', task.area || '')
                                                    formData.append('isUrgent', task.is_urgent ? 'on' : '')
                                                    formData.append('comments', task.comments || '')
                                                    const result = await updatePendingTask(formData)
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
                                            label={task.status || 'pending'}
                                            color={
                                                task.status === 'done' ? 'success' :
                                                    task.status === 'invalid' ? 'error' :
                                                        'warning'
                                            }
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{task.comments}</TableCell>
                                <TableCell>
                                    {task.editor ? (
                                        <Tooltip title={`Last edited by: ${task.editor.email}`}>
                                            <Chip
                                                avatar={<Avatar>{task.editor.email[0].toUpperCase()}</Avatar>}
                                                label={task.editor.email.split('@')[0]}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">Unknown</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEditClick(task)} color="primary" size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(task)} color="error" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTasks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No pending tasks found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Task Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Task</DialogTitle>
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
                            {loading ? 'Adding...' : 'Add Task'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Edit Task Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Task</DialogTitle>
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
                            defaultValue={selectedTask?.title}
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
                            defaultValue={selectedTask?.description}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                            <InputLabel id="edit-area-label">Area</InputLabel>
                            <Select
                                labelId="edit-area-label"
                                id="area"
                                name="area"
                                label="Area"
                                defaultValue={selectedTask?.area || 'House Specific'}
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
                            control={<Switch name="isUrgent" defaultChecked={selectedTask?.is_urgent} color="error" />}
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
                            defaultValue={selectedTask?.comments}
                            sx={{ mb: 2 }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleEditClose} variant="outlined" color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Task'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleDeleteClose} variant="outlined" color="inherit">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete Task'}
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
