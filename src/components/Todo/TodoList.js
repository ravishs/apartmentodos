'use client'

import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Fab
} from '@mui/material'
import {
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as UncheckedIcon,
    Add as AddIcon
} from '@mui/icons-material'
import { useState } from 'react'

export default function TodoList({ title, initialItems = [] }) {
    const [items, setItems] = useState(initialItems)

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ))
    }

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', mt: { xs: 2, sm: 4 }, p: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    {title}
                </Typography>
            </Box>

            <Card elevation={2}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {items.map((item, index) => (
                        <div key={item.id}>
                            <ListItem
                                secondaryAction={
                                    <Chip
                                        label={item.completed ? "Completed" : "Pending"}
                                        color={item.completed ? "success" : "warning"}
                                        size="small"
                                        variant="outlined"
                                    />
                                }
                                disablePadding
                                sx={{ p: 2, bgcolor: item.completed ? 'action.hover' : 'inherit' }}
                            >
                                <ListItemIcon onClick={() => toggleItem(item.id)} sx={{ cursor: 'pointer' }}>
                                    {item.completed ?
                                        <CheckCircleIcon color="success" /> :
                                        <UncheckedIcon color="action" />
                                    }
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                textDecoration: item.completed ? 'line-through' : 'none',
                                                color: item.completed ? 'text.secondary' : 'text.primary'
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                    }
                                    secondary={item.description}
                                />
                            </ListItem>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No items found.</Typography>
                        </Box>
                    )}
                </List>
            </Card>

            <Fab
                color="primary"
                aria-label="add"
                size="large"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    )
}
