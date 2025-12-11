'use client'

import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActionArea
} from '@mui/material'
import {
    People as PeopleIcon,
    Construction as ConstructionIcon,
    Favorite as FavoriteIcon,
    Phone as PhoneIcon
} from '@mui/icons-material'
import Link from 'next/link'

export default function DashboardHome({ data = {} }) {
    const {
        totalUsers = 0,
        pendingBuilderCount = 0,
        pendingWishlistCount = 0,
        urgentBuilderCount = 0,
        urgentWishlistCount = 0,
        emergencyContacts = null
    } = data

    const statCards = [
        {
            title: 'Total Residents',
            value: totalUsers,
            icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
            link: '/residents',
            color: '#1976d2'
        },
        {
            title: 'Pending from Builder',
            value: pendingBuilderCount,
            icon: <ConstructionIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
            link: '/pending-builder',
            color: '#ed6c02'
        },
        {
            title: 'Pending Wishlist Items',
            value: pendingWishlistCount,
            icon: <FavoriteIcon sx={{ fontSize: 48, color: 'error.main' }} />,
            link: '/wishlist',
            color: '#d32f2f'
        },
        {
            title: 'Urgent Builder Tasks',
            value: urgentBuilderCount,
            icon: <ConstructionIcon sx={{ fontSize: 48, color: 'error.main' }} />,
            link: '/pending-builder',
            color: '#d32f2f',
            urgent: true
        },
        {
            title: 'Urgent Wishlist Items',
            value: urgentWishlistCount,
            icon: <FavoriteIcon sx={{ fontSize: 48, color: 'error.main' }} />,
            link: '/wishlist',
            color: '#d32f2f',
            urgent: true
        }
    ]

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', pt: 2 }}>
                Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Overview of your community management
            </Typography>

            {/* Statistics Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                {statCards.map((card, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' }
                        }}
                    >
                        <Link href={card.link} passHref style={{ textDecoration: 'none' }}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    minHeight: 180,
                                    transition: 'all 0.3s ease',
                                    border: card.urgent ? '2px solid #d32f2f' : 'none',
                                    bgcolor: card.urgent ? 'error.lighter' : 'background.paper',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            {card.icon}
                                            <Typography
                                                variant="h3"
                                                component="div"
                                                fontWeight="bold"
                                                sx={{ color: card.color }}
                                            >
                                                {card.value}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" color="text.secondary" fontWeight="medium">
                                            {card.title}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Box>
                ))}
            </Box>

            {/* Emergency Contacts - Individual Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {emergencyContacts?.electrician && (
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
                        <Link href="/emergency-contacts" passHref style={{ textDecoration: 'none' }}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    minHeight: 180,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <PhoneIcon sx={{ fontSize: 48, color: 'success.main' }} />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                            Electrician
                                        </Typography>
                                        <Typography variant="h6" fontWeight="medium">
                                            {emergencyContacts.electrician}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Box>
                )}

                {emergencyContacts?.plumber && (
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
                        <Link href="/emergency-contacts" passHref style={{ textDecoration: 'none' }}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    minHeight: 180,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <PhoneIcon sx={{ fontSize: 48, color: 'success.main' }} />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                            Plumber
                                        </Typography>
                                        <Typography variant="h6" fontWeight="medium">
                                            {emergencyContacts.plumber}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Box>
                )}

                {emergencyContacts?.security && (
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
                        <Link href="/emergency-contacts" passHref style={{ textDecoration: 'none' }}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    minHeight: 180,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <PhoneIcon sx={{ fontSize: 48, color: 'success.main' }} />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                            Security
                                        </Typography>
                                        <Typography variant="h6" fontWeight="medium">
                                            {emergencyContacts.security}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Box>
                )}

                {emergencyContacts?.project_manager && (
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
                        <Link href="/emergency-contacts" passHref style={{ textDecoration: 'none' }}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    minHeight: 180,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <PhoneIcon sx={{ fontSize: 48, color: 'success.main' }} />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                            Project Manager
                                        </Typography>
                                        <Typography variant="h6" fontWeight="medium">
                                            {emergencyContacts.project_manager}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Box>
                )}

                {emergencyContacts?.association_contact && (
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
                        <Link href="/emergency-contacts" passHref style={{ textDecoration: 'none' }}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    minHeight: 180,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <PhoneIcon sx={{ fontSize: 48, color: 'success.main' }} />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                                            Association Contact
                                        </Typography>
                                        <Typography variant="h6" fontWeight="medium">
                                            {emergencyContacts.association_contact}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
