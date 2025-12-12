'use client'

import {
    Box,
    Typography,
    Paper,
    Button,
    Card,
    CardContent,
    CardActions,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Snackbar,
    IconButton,
    Divider,
    Tooltip,
} from '@mui/material'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    FormatBold as FormatBoldIcon,
    FormatItalic as FormatItalicIcon,
    FormatUnderlined as FormatUnderlinedIcon,
    FormatListBulleted as FormatListBulletedIcon,
    FormatListNumbered as FormatListNumberedIcon,
    Link as LinkIcon,
} from '@mui/icons-material'


import { useState, useRef, useEffect } from 'react'
import { createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncements } from '@/app/announcements/actions'

export default function AnnouncementsBoard({ currentUserId, currentUserRole = 'resident' }) {
    const isAdmin = currentUserRole === 'admin'
    const editorRef = useRef(null)
    
    const [announcements, setAnnouncements] = useState([])
    const [loadingInitial, setLoadingInitial] = useState(true)

    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

    // Fetch announcements on mount
    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoadingInitial(true)
            const { data, error: fetchError } = await getAnnouncements()
            if (fetchError) {
                setError(fetchError)
                showToast(fetchError, 'error')
            } else {
                setAnnouncements(data)
            }
            setLoadingInitial(false)
        }
        fetchAnnouncements()
    }, [])



    const showToast = (message, severity = 'success') => {
        setToast({ open: true, message, severity })
    }

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
    }



    const insertLink = () => {
        const url = prompt('Enter URL:')
        if (url) {
            formatText('createLink', url)
        }
    }


    const handleClickOpen = () => {
        setOpen(true)
        setEditingId(null)
        setTitle('')
        setContent('')
        setStartDate(new Date().toISOString().slice(0, 16))
        setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16))
        setError(null)
        
        // Clear the editor content
        if (editorRef.current) {
            editorRef.current.innerHTML = ''
        }
    }

    const handleClose = () => {
        setOpen(false)
        setEditingId(null)
        setTitle('')
        setContent('')
        setStartDate('')
        setEndDate('')
        setError(null)
    }




    const handleEditClick = (announcement) => {
        setEditingId(announcement.id)
        setTitle(announcement.title)
        setContent(announcement.content)
        setStartDate(announcement.startDate)
        setEndDate(announcement.endDate)
        setOpen(true)
        setError(null)
        
        // Populate the editor with existing content after dialog opens
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.innerHTML = announcement.content
            }
        }, 100)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required')
            setLoading(false)
            return
        }

        if (!startDate || !endDate) {
            setError('Start date and end date are required')
            setLoading(false)
            return
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setError('End date must be after start date')
            setLoading(false)
            return
        }

        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('content', content)
            formData.append('startDate', startDate)
            formData.append('endDate', endDate)

            let result
            if (editingId) {
                result = await updateAnnouncement(editingId, formData)
            } else {
                result = await createAnnouncement(formData)
            }

            if (!result.success) {
                setError(result.error || 'An error occurred')
                showToast(result.error || 'An error occurred', 'error')
                setLoading(false)
                return
            }

            // Refresh announcements from database
            const { data } = await getAnnouncements()
            setAnnouncements(data)
            
            showToast(
                editingId ? 'Announcement updated successfully' : 'Announcement posted successfully',
                'success'
            )
            handleClose()
        } catch (err) {
            const errorMsg = err.message || 'An error occurred'
            setError(errorMsg)
            showToast(errorMsg, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            const result = await deleteAnnouncement(id)
            if (!result.success) {
                showToast(result.error || 'Failed to delete announcement', 'error')
                return
            }
            
            // Refresh announcements from database
            const { data } = await getAnnouncements()
            setAnnouncements(data)
            showToast('Announcement deleted successfully', 'success')
        } catch (err) {
            showToast(err.message || 'An error occurred', 'error')
        }
    }

    const handleToastClose = (event, reason) => {
        if (reason === 'clickaway') return
        setToast({ ...toast, open: false })
    }

    const isAnnouncementActive = (startDate, endDate) => {
        const now = new Date()
        const start = new Date(startDate)
        const end = new Date(endDate)
        return now >= start && now <= end
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pt: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Announcements
                </Typography>
            </Box>

            {loadingInitial ? (
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography color="text.secondary" variant="body1">
                        Loading announcements...
                    </Typography>
                </Paper>
            ) : announcements.length === 0 ? (
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography color="text.secondary" variant="body1">
                        No announcements yet. {isAdmin && 'Click the + button to post one.'}
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {announcements.map((announcement) => {
                        const active = isAnnouncementActive(announcement.startDate, announcement.endDate)
                        return (
                            <Card 
                                key={announcement.id} 
                                elevation={1} 
                                sx={{ 
                                    '&:hover': { elevation: 2 },
                                    opacity: active ? 1 : 0.6,
                                    borderLeft: active ? '4px solid' : 'none',
                                    borderLeftColor: active ? 'success.main' : 'transparent',
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="h6" component="h2" fontWeight="bold">
                                            {announcement.title}
                                        </Typography>
                                        {!active && (
                                            <Typography variant="caption" sx={{ bgcolor: 'warning.light', px: 1, py: 0.5, borderRadius: 1 }}>
                                                Inactive
                                            </Typography>
                                        )}
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Posted by {announcement.author} on {announcement.createdAt}
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                        Active from {new Date(announcement.startDate).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })} to {new Date(announcement.endDate).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </Typography>
                                    <Box
                                        dangerouslySetInnerHTML={{ __html: announcement.content }}
                                        sx={{
                                            '& p': { m: 0, mb: 1 },
                                            '& ul, & ol': { pl: 2, mb: 1 },
                                            '& li': { mb: 0.5 },
                                            '& strong': { fontWeight: 'bold' },
                                            '& em': { fontStyle: 'italic' },
                                            '& u': { textDecoration: 'underline' },
                                            '& a': { color: 'primary.main', textDecoration: 'underline' },
                                        }}
                                    />
                                </CardContent>
                                {isAdmin && (
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditClick(announcement)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(announcement.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </CardActions>
                                )}
                            </Card>
                        )
                    })}
                </Box>
            )}

            {isAdmin && (
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

            {/* Add/Edit Announcement Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingId ? 'Edit Announcement' : 'Post New Announcement'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Content
                        </Typography>
                        
                        {/* Toolbar */}
                        <Paper elevation={0} sx={{ p: 1, mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap', border: '1px solid', borderColor: 'divider' }}>
                            <Tooltip title="Bold">
                                <IconButton size="small" onClick={() => formatText('bold')}>
                                    <FormatBoldIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Italic">
                                <IconButton size="small" onClick={() => formatText('italic')}>
                                    <FormatItalicIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Underline">
                                <IconButton size="small" onClick={() => formatText('underline')}>
                                    <FormatUnderlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Divider orientation="vertical" sx={{ mx: 0.5 }} />
                            <Tooltip title="Bullet List">
                                <IconButton size="small" onClick={() => formatText('insertUnorderedList')}>
                                    <FormatListBulletedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Numbered List">
                                <IconButton size="small" onClick={() => formatText('insertOrderedList')}>
                                    <FormatListNumberedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Divider orientation="vertical" sx={{ mx: 0.5 }} />
                            <Tooltip title="Insert Link">
                                <IconButton size="small" onClick={insertLink}>
                                    <LinkIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Paper>
                        



                        {/* Contenteditable Editor */}
                        <Box
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => setContent(e.currentTarget.innerHTML)}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                p: 2,
                                minHeight: '250px',
                                maxHeight: '400px',
                                overflow: 'auto',
                                mb: 2,
                                '&:focus': {
                                    outline: 'none',
                                    borderColor: 'primary.main',
                                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
                                },
                                '& p': { m: 0, mb: 1 },
                                '& ul, & ol': { pl: 2, mb: 1 },
                                '& li': { mb: 0.5 },
                            }}
                        />
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                            <TextField
                                margin="dense"
                                id="startDate"
                                label="Start Date & Time"
                                type="datetime-local"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="endDate"
                                label="End Date & Time"
                                type="datetime-local"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleClose} variant="outlined" color="inherit" disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Saving...' : editingId ? 'Update' : 'Post'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Toast Notification */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
