
import { AppBar, Toolbar, Typography, Box } from '@mui/material'

export default function AuthHeader() {
    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ top: 0, zIndex: 1100 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    ApartmentTodos
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
