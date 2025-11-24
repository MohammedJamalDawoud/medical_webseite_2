import { useState } from 'react';
import {
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Alert,
    Grid,
    Avatar,
    Tabs,
    Tab,
    InputAdornment,
    IconButton,
    Paper,
    Divider,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    Person,
    Lock,
    Email,
    Phone,
    Save,
    Logout,
    Security,
    Notifications,
    Visibility,
    VisibilityOff,
    CameraAlt,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';
import apiClient from '../api/client';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`account-tabpanel-${index}`}
            aria-labelledby={`account-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AccountPage() {
    const { user, logout } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [profileData, setProfileData] = useState({ name: user?.name || '', phone: '' });
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setMessage(null);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.patch('/auth/me', profileData);
            setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Fehler beim Aktualisieren des Profils' });
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/auth/change-password', passwordData);
            setMessage({ type: 'success', text: 'Passwort erfolgreich geändert' });
            setPasswordData({ old_password: '', new_password: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Fehler beim Ändern des Passworts' });
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Mein Konto
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Verwalten Sie Ihre persönlichen Daten und Einstellungen
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left Sidebar - Profile Summary */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            textAlign: 'center',
                            p: 3,
                            mb: 3,
                            position: 'relative',
                            overflow: 'visible',
                        }}
                    >
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: '3rem',
                                    margin: '0 auto',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.2)',
                                }}
                            >
                                {user?.name?.charAt(0) || 'U'}
                            </Avatar>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: 'white',
                                    boxShadow: 2,
                                    '&:hover': { bgcolor: 'grey.100' },
                                }}
                                size="small"
                            >
                                <CameraAlt fontSize="small" color="primary" />
                            </IconButton>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {user?.email}
                        </Typography>
                        <Typography variant="caption" sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            borderRadius: 1,
                            mt: 1,
                            fontWeight: 600
                        }}>
                            PATIENT
                        </Typography>
                    </Card>

                    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                borderRight: 1,
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    minHeight: 60,
                                    pl: 3,
                                },
                                '& .Mui-selected': {
                                    bgcolor: 'rgba(102, 126, 234, 0.08)',
                                    borderRight: '3px solid #667eea',
                                },
                            }}
                        >
                            <Tab icon={<Person sx={{ mr: 2 }} />} iconPosition="start" label="Profil bearbeiten" />
                            <Tab icon={<Security sx={{ mr: 2 }} />} iconPosition="start" label="Sicherheit" />
                            <Tab icon={<Notifications sx={{ mr: 2 }} />} iconPosition="start" label="Benachrichtigungen" />
                        </Tabs>
                    </Paper>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Logout />}
                        fullWidth
                        onClick={logout}
                        sx={{ mt: 3, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
                    >
                        Abmelden
                    </Button>
                </Grid>

                {/* Right Content Area */}
                <Grid item xs={12} md={8}>
                    {message && (
                        <Alert
                            severity={message.type}
                            sx={{ mb: 3, borderRadius: 2 }}
                            onClose={() => setMessage(null)}
                        >
                            {message.text}
                        </Alert>
                    )}

                    <Card sx={{ borderRadius: 3, minHeight: 400 }}>
                        <CardContent sx={{ p: 4 }}>
                            <TabPanel value={tabValue} index={0}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Persönliche Daten
                                </Typography>
                                <Box component="form" onSubmit={handleProfileUpdate}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Vollständiger Name"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="E-Mail-Adresse"
                                                value={user?.email}
                                                disabled
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Email color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                helperText="E-Mail-Adresse kann nicht geändert werden"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Telefonnummer"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                placeholder="+49 123 4567890"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Phone color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={<Save />}
                                                sx={{
                                                    mt: 2,
                                                    px: 4,
                                                    py: 1.2,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                }}
                                            >
                                                Änderungen speichern
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Passwort ändern
                                </Typography>
                                <Box component="form" onSubmit={handlePasswordChange}>
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            type={showOldPassword ? 'text' : 'password'}
                                            label="Aktuelles Passwort"
                                            value={passwordData.old_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                                            edge="end"
                                                        >
                                                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            type={showNewPassword ? 'text' : 'password'}
                                            label="Neues Passwort"
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            required
                                            helperText="Mindestens 8 Zeichen, Groß-/Kleinschreibung und Zahlen"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            edge="end"
                                                        >
                                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Box>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={<Save />}
                                                sx={{
                                                    mt: 2,
                                                    px: 4,
                                                    py: 1.2,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                }}
                                            >
                                                Passwort aktualisieren
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Benachrichtigungseinstellungen
                                </Typography>
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        control={<Switch defaultChecked />}
                                        label="E-Mail bei neuen Terminen"
                                    />
                                    <Divider />
                                    <FormControlLabel
                                        control={<Switch defaultChecked />}
                                        label="E-Mail bei neuen Laborergebnissen"
                                    />
                                    <Divider />
                                    <FormControlLabel
                                        control={<Switch defaultChecked />}
                                        label="Erinnerung an bevorstehende Termine (24h vorher)"
                                    />
                                    <Divider />
                                    <FormControlLabel
                                        control={<Switch />}
                                        label="Newsletter und Gesundheitstipps"
                                    />
                                </Stack>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 4,
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                >
                                    Einstellungen speichern
                                </Button>
                            </TabPanel>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
