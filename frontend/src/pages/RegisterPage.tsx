import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Paper, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { useAuth } from '../auth/AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registrierung fehlgeschlagen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Registrierung
                    </Typography>
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="E-Mail"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Telefon"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Passwort"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            margin="normal"
                            required
                            helperText="Mindestens 6 Zeichen"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                            {loading ? 'Registrieren...' : 'Registrieren'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Bereits registriert? Jetzt anmelden
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
