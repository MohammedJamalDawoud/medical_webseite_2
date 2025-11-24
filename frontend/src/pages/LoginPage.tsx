import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login fehlgeschlagen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Telemedizin Portal
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
                        Anmelden
                    </Typography>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            label="E-Mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            autoFocus
                        />
                        <TextField
                            fullWidth
                            label="Passwort"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Anmelden...' : 'Anmelden'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/register" variant="body2">
                                Noch kein Konto? Jetzt registrieren
                            </Link>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            <strong>Demo-Zugangsdaten:</strong><br />
                            Patient: demo.patient@example.com / password123<br />
                            Arzt: demo.doctor@example.com / password123
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
