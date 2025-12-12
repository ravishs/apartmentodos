'use client'

import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Divider,
    ListItemIcon,
    Drawer,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import {
    Dashboard as DashboardIcon,
    Construction as ConstructionIcon,
    Favorite as FavoriteIcon,
    People as PeopleIcon,
    Phone as PhoneIcon,
    Menu as MenuIcon,
    Campaign as CampaignIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardLayoutContent({ children, user, signout }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const router = useRouter()
    const pathname = usePathname()

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleUpdateInfo = () => {
        handleClose()
        router.push('/profile')
    }

    const handleSignout = async () => {
        handleClose()
        await signout()
    }

    // Calculate initials
    const [initials, setInitials] = useState('U')

    // Responsive Drawer State
    const [mobileOpen, setMobileOpen] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md')) // 'md' is typically 900px

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    // Effect to close drawer when route changes on mobile (optional but good UX)
    // useEffect(() => {
    //    if(isMobile) setMobileOpen(false)
    // }, [pathname]) // need to import usePathname if we want this

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            const fullName = user.user_metadata.full_name;
            const names = fullName.split(' ');
            const calculatedInitials = names.length > 0
                ? (names[0][0] + (names.length > 1 ? names[names.length - 1][0] : '')).toUpperCase()
                : 'U';
            setInitials(calculatedInitials)
        }
    }, [user])

    const selectedStyle = {
        '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
                backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
            },
        },
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} suppressHydrationWarning>
            {/* Top Nav */}
            <AppBar position="sticky" color="default" elevation={1} sx={{ top: 0, zIndex: 1100 }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Box
                            component="img"
                            src="/logo.png"
                            alt="Logo"
                            sx={{ height: 50, width: 'auto', mr: 2 }}
                        />
                        <Typography variant="h6" component="div" fontWeight="bold">
                            SITARA
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={handleMenu}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                            {initials}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleUpdateInfo}>
                            Update Info
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleSignout} sx={{ color: 'error.main' }}>
                            Sign Out
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Main Content Area */}
            <Box sx={{ display: 'flex', flex: 1 }}>
                {/* Left Nav (Drawer or Permanent) */}
                <Box
                    component="nav"
                    sx={{ width: { md: '280px' }, flexShrink: { md: 0 } }}
                >
                    {/* Mobile Drawer */}
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                        }}
                    >
                        <List disablePadding onClick={() => isMobile && setMobileOpen(false)}> {/* Close on click */}
                            <ListItem disablePadding>
                                <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 34, mr: 0.5 }}>
                                            <DashboardIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Dashboard" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/pending-builder" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/pending-builder'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 34, mr: 0.5 }}>
                                            <ConstructionIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Pending from Builder" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/wishlist" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/wishlist'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 34, mr: 0.5 }}>
                                            <FavoriteIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Wishlist" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/residents" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/residents'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 34, mr: 0.5 }}>
                                            <PeopleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Residents" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/emergency-contacts" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/emergency-contacts'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 34, mr: 0.5 }}>
                                            <PhoneIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Emergency contacts" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/announcements" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/announcements'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 34, mr: 0.5 }}>
                                            <CampaignIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Announcements" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        </List>
                    </Drawer>

                    {/* Desktop Permanent Drawer */}
                    <Paper
                        elevation={0}
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            height: '100%',
                            bgcolor: 'grey.50',
                            borderRight: 1,
                            borderColor: 'divider',
                            borderRadius: 0,
                            width: '280px'
                        }}
                    >
                        <List disablePadding>
                            <ListItem disablePadding sx={{ pt: 2, pb:1}}>
                                <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 40, mr: 0 }}>
                                            <DashboardIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Dashboard" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding sx={{ pb:1}}>
                                <Link href="/pending-builder" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/pending-builder'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 40, mr: 0 }}>
                                            <ConstructionIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Pending from Builder" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding sx={{ pb:1}}>
                                <Link href="/wishlist" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/wishlist'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 40, mr: 0 }}>
                                            <FavoriteIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Wishlist" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding sx={{ pb:1}}>
                                <Link href="/residents" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/residents'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 40, mr: 0 }}>
                                            <PeopleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Residents" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding sx={{ pb:1}}>
                                <Link href="/emergency-contacts" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/emergency-contacts'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 40, mr: 0 }}>
                                            <PhoneIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Emergency contacts" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link href="/announcements" passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                    <ListItemButton selected={pathname === '/announcements'} sx={selectedStyle}>
                                        <ListItemIcon sx={{ minWidth: 40, mr: 0 }}>
                                            <CampaignIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Announcements" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        </List>
                    </Paper>
                </Box>

                {/* Right Content */}
                <Box component="main" sx={{ flex: 1, p: 3, pt: 1, bgcolor: 'background.paper' }}>
                    {children}
                </Box>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ p: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                    &copy; {new Date().getFullYear()} Mahaveer Sitara Owner's Welfare Association. All rights reserved.
                </Typography>
            </Box>
        </Box>
    )
}
