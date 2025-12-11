
import { AppBar, Toolbar, Typography, Box } from '@mui/material'

export default function AuthHeader() {
    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ top: 0, zIndex: 1100 }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Box
                        component="img"
                        src="/logo.png"
                        alt="SITARA Logo"
                        sx={{
                            height: 50,
                            mr: 2
                        }}
                    />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        SITARA
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
