import { useState, useEffect, useRef } from 'react';
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
    Snackbar,
    LinearProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    Download,
    CheckCircle,
    Shield,
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
    const [profileData, setProfileData] = useState({ name: user?.name || '', phone: '', address: '', birthdate: '' });
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
    const [notificationSettings, setNotificationSettings] = useState({
        email_appointments: true,
        email_results: true,
        email_reminders: true,
        newsletter: false,
        sms_notifications: false,
        push_notifications: true,
    });
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [twoFactorDialog, setTwoFactorDialog] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
                address: '',
                birthdate: '',
            });
        }
    }, [user]);

    // Calculate profile completion
    const calculateCompletion = () => {
        const fields = [
            profileData.name,
            user?.email,
            profileData.phone,
            profileData.address,
            profileData.birthdate,
            avatarUrl,
        ];
        const completed = fields.filter(f => f && f.length > 0).length;
        return Math.round((completed / fields.length) * 100);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setMessage(null);
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
                setMessage({ type: 'success', text: 'Avatar hochgeladen' });
                setSnackbarOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.patch('/users/me', profileData);
            setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert' });
            setSnackbarOpen(true);
        } catch (error) {
            setMessage({ type: 'error', text: 'Fehler beim Aktualisieren des Profils' });
            setSnackbarOpen(true);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.put('/users/me/password', passwordData);
            setMessage({ type: 'success', text: 'Passwort erfolgreich geändert' });
            setPasswordData({ old_password: '', new_password: '' });
            setSnackbarOpen(true);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Fehler beim Ändern des Passworts' });
            setSnackbarOpen(true);
        }
    };

    const handleNotificationUpdate = async () => {
        try {
            await apiClient.put('/users/me/settings', notificationSettings);
            setMessage({ type: 'success', text: 'Einstellungen gespeichert' });
            setSnackbarOpen(true);
        } catch (error) {
            setMessage({ type: 'error', text: 'Fehler beim Speichern der Einstellungen' });
            setSnackbarOpen(true);
        }
    };

    const handleEnableTwoFactor = () => {
        setTwoFactorDialog(true);
    };

    const confirmTwoFactor = () => {
        setTwoFactorEnabled(true);
        setTwoFactorDialog(false);
        setMessage({ type: 'success', text: 'Zwei-Faktor-Authentifizierung aktiviert' });
        setSnackbarOpen(true);
    };

    const handleExportData = () => {
        const data = {
            profile: profileData,
            email: user?.email,
            notifications: notificationSettings,
            exportDate: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `meine_daten_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setMessage({ type: 'success', text: 'Daten exportiert' });
        setSnackbarOpen(true);
    };

    const completion = calculateCompletion();

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
                                src={avatarUrl || undefined}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: '3rem',
                                    margin: '0 auto',
                                    background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.2)',
                                }}
                            >
                                {!avatarUrl && (user?.name?.charAt(0) || 'U')}
                            </Avatar>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarUpload}
                            />
                            <IconButton
                                onClick={() => fileInputRef.current?.click()}
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

                        {/* Profile Completion */}
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Profil-Vollständigkeit
                                </Typography>
                                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                                    {completion}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={completion}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    }
                                }}
                            />
                        </Box>
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
                    <Card sx={{ borderRadius: 3, minHeight: 400 }}>
                        <CardContent sx={{ p: 4 }}>
                            {/* Profile Tab */}
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
                                            <TextField
                                                fullWidth
                                                label="Adresse"
                                                value={profileData.address}
                                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                placeholder="Straße, PLZ, Stadt"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Geburtsdatum"
                                                type="date"
                                                value={profileData.birthdate}
                                                onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<Save />}
                                        sx={{ mt: 3, px: 4, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Änderungen speichern
                                    </Button>
                                </Box>
                            </TabPanel>

                            {/* Security Tab */}
                            <TabPanel value={tabValue} index={1}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Sicherheitseinstellungen
                                </Typography>

                                {/* Password Change */}
                                <Box component="form" onSubmit={handlePasswordChange} sx={{ mb: 4 }}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                        Passwort ändern
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                type={showOldPassword ? 'text' : 'password'}
                                                label="Aktuelles Passwort"
                                                value={passwordData.old_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Lock color="action" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                type={showNewPassword ? 'text' : 'password'}
                                                label="Neues Passwort"
                                                value={passwordData.new_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Lock color="action" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<Save />}
                                        disabled={!passwordData.old_password || !passwordData.new_password}
                                        sx={{ mt: 3, px: 4, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Passwort ändern
                                    </Button>
                                </Box>

                                <Divider sx={{ my: 4 }} />

                                {/* Two-Factor Authentication */}
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                        Zwei-Faktor-Authentifizierung
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Shield sx={{ mr: 2, color: twoFactorEnabled ? 'success.main' : 'text.secondary' }} />
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        Zwei-Faktor-Authentifizierung
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {twoFactorEnabled ? 'Aktiviert - Ihr Konto ist geschützt' : 'Erhöhen Sie die Sicherheit Ihres Kontos'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {twoFactorEnabled ? (
                                                <Chip icon={<CheckCircle />} label="Aktiv" color="success" />
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleEnableTwoFactor}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Aktivieren
                                                </Button>
                                            )}
                                        </Stack>
                                    </Paper>
                                </Box>

                                <Divider sx={{ my: 4 }} />

                                {/* Data Export */}
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                        Datenexport
                                    </Typography>
                                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Laden Sie alle Ihre persönlichen Daten als JSON-Datei herunter.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Download />}
                                            onClick={handleExportData}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Daten exportieren
                                        </Button>
                                    </Paper>
                                </Box>
                            </TabPanel>

                            {/* Notifications Tab */}
                            <TabPanel value={tabValue} index={2}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Benachrichtigungseinstellungen
                                </Typography>
                                <Stack spacing={2}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={notificationSettings.email_appointments}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, email_appointments: e.target.checked })}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Termin-Erinnerungen</Typography>
                                                    <Typography variant="caption" color="text.secondary">E-Mail-Benachrichtigungen für bevorstehende Termine</Typography>
                                                </Box>
                                            }
                                        />
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={notificationSettings.email_results}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, email_results: e.target.checked })}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Laborergebnisse</Typography>
                                                    <Typography variant="caption" color="text.secondary">Benachrichtigung bei neuen Laborergebnissen</Typography>
                                                </Box>
                                            }
                                        />
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={notificationSettings.email_reminders}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, email_reminders: e.target.checked })}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Medikamenten-Erinnerungen</Typography>
                                                    <Typography variant="caption" color="text.secondary">Erinnerungen für Medikamenteneinnahme</Typography>
                                                </Box>
                                            }
                                        />
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={notificationSettings.sms_notifications}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, sms_notifications: e.target.checked })}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>SMS-Benachrichtigungen</Typography>
                                                    <Typography variant="caption" color="text.secondary">Wichtige Updates per SMS erhalten</Typography>
                                                </Box>
                                            }
                                        />
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={notificationSettings.push_notifications}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, push_notifications: e.target.checked })}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Push-Benachrichtigungen</Typography>
                                                    <Typography variant="caption" color="text.secondary">Browser-Benachrichtigungen aktivieren</Typography>
                                                </Box>
                                            }
                                        />
                                    </Paper>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={notificationSettings.newsletter}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, newsletter: e.target.checked })}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Newsletter</Typography>
                                                    <Typography variant="caption" color="text.secondary">Gesundheitstipps und Neuigkeiten erhalten</Typography>
                                                </Box>
                                            }
                                        />
                                    </Paper>
                                </Stack>
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={handleNotificationUpdate}
                                    sx={{ mt: 3, px: 4, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Einstellungen speichern
                                </Button>
                            </TabPanel>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Two-Factor Dialog */}
            <Dialog open={twoFactorDialog} onClose={() => setTwoFactorDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Zwei-Faktor-Authentifizierung aktivieren</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Die Zwei-Faktor-Authentifizierung fügt eine zusätzliche Sicherheitsebene zu Ihrem Konto hinzu.
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        In einer Produktionsumgebung würden Sie hier einen QR-Code scannen und einen Bestätigungscode eingeben.
                    </Alert>
                    <Typography variant="body2">
                        Möchten Sie die Zwei-Faktor-Authentifizierung jetzt aktivieren?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTwoFactorDialog(false)}>Abbrechen</Button>
                    <Button onClick={confirmTwoFactor} variant="contained">Aktivieren</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={message?.type || 'success'} onClose={() => setSnackbarOpen(false)}>
                    {message?.text}
                </Alert>
            </Snackbar>
        </Box>
    );
}
