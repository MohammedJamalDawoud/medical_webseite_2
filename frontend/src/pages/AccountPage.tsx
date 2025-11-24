import { useState } from 'react';
import { Typography, Card, CardContent, TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import apiClient from '../api/client';

export default function AccountPage() {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState({ name: user?.name || '', phone: '' });
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
    const [message, setMessage] = useState('');

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.patch('/auth/me', profileData);
            setMessage('Profil erfolgreich aktualisiert');
        } catch (error) {
            setMessage('Fehler beim Aktualisieren');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/auth/change-password', passwordData);
            setMessage('Passwort erfolgreich geändert');
            setPasswordData({ old_password: '', new_password: '' });
        } catch (error: any) {
            setMessage(error.response?.data?.detail || 'Fehler beim Ändern des Passworts');
        }
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>Benutzerkonto</Typography>

            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Profil bearbeiten</Typography>
                    <Box component="form" onSubmit={handleProfileUpdate}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Telefon"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            margin="normal"
                        />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Speichern</Button>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Passwort ändern</Typography>
                    <Box component="form" onSubmit={handlePasswordChange}>
                        <TextField
                            fullWidth
                            type="password"
                            label="Altes Passwort"
                            value={passwordData.old_password}
                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Neues Passwort"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            margin="normal"
                            required
                        />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Passwort ändern</Button>
                    </Box>
                </CardContent>
            </Card>

            <Button variant="outlined" color="error" onClick={logout}>
                Abmelden
            </Button>
        </>
    );
}
