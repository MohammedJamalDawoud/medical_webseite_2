import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Menu,
    MenuItem,
    Container,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    CalendarToday,
    LocalHospital,
    Description,
    Science,
    FitnessCenter,
    Help,
    Person,
    Dashboard,
    Search,
    Brightness4,
    Brightness7,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import NotificationsMenu from '../components/NotificationsMenu';
import GlobalSearch from '../components/GlobalSearch';
import { useThemeMode } from '../context/ThemeContext';

const drawerWidth = 240;

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useThemeMode();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Termine & Ärzte', icon: <CalendarToday />, path: '/doctors' },
        { text: 'Rezepte & Medikamente', icon: <LocalHospital />, path: '/prescriptions' },
        { text: 'Berichte', icon: <Description />, path: '/reports' },
        { text: 'Laborergebnisse', icon: <Science />, path: '/lab-results' },
        { text: 'Gesundheitstipps', icon: <FitnessCenter />, path: '/health-tips' },
        { text: 'FAQ', icon: <Help />, path: '/faq' },
        { text: 'Symptom-Checker', icon: <Help />, path: '/symptom-checker' },
        { text: 'Benutzerkonto', icon: <Person />, path: '/account' },
    ];

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Telemedizin
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => { navigate(item.path); setMobileOpen(false); }}>
                            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Telemedizin Portal
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" onClick={() => setSearchOpen(true)} sx={{ mr: 1 }}>
                            <Search />
                        </IconButton>

                        <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>

                        <Typography variant="body1" sx={{ mr: 2, fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                            {user?.name}
                        </Typography>

                        <NotificationsMenu />

                        <IconButton color="inherit" onClick={handleMenu}>
                            <AccountCircle />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={() => { navigate('/account'); handleClose(); }}>Profil</MenuItem>
                            <MenuItem onClick={handleLogout}>Abmelden</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.02)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: 'background.default' }}>
                <Toolbar />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
