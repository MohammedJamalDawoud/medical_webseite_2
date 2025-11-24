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
    Grid,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Lock,
    Visibility,
    VisibilityOff,
    LocalHospital,
    CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
    });
    const [showPassword, setShowPassword] = useState(false);
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
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
                display: 'flex',
                alignItems: 'center',
                py: 4,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                },
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    {/* Left side - Benefits */}
                    <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Box sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <LocalHospital sx={{ fontSize: 60, mr: 2 }} />
                                <Typography variant="h2" sx={{ fontWeight: 800 }}>
                                    Jetzt starten
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, fontWeight: 300 }}>
                                Begleiten Sie Tausende zufriedener Patienten
                            </Typography>

                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                {[
                                    'Online-Termine in Minuten buchen',
                                    'Zugriff auf Ihre medizinischen Unterlagen',
                                    'Digitale Rezepte und Erinnerungen',
                                    'Kostenlos und sicher',
                                ].map((benefit, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CheckCircle sx={{ fontSize: 32, mr: 2, opacity: 0.9 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 400 }}>
                                                {benefit}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Right side - Registration Form */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={24}
                            sx={{
                                p: 5,
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                position: 'relative',
                                zIndex: 1,
                                animation: 'fadeInUp 0.6s ease-out',
                                '@keyframes fadeInUp': {
                                    from: {
                                        opacity: 0,
                                        transform: 'translateY(30px)',
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                    },
                                },
                            }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                    <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                        Telemedizin
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    Account erstellen
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Kostenlose Registrierung - In wenigen Schritten
                                </Typography>
                            </Box>

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        animation: 'shake 0.5s',
                                        '@keyframes shake': {
                                            '0%, 100%': { transform: 'translateX(0)' },
                                            '25%': { transform: 'translateX(-10px)' },
                                            '75%': { transform: 'translateX(10px)' },
                                        },
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Vollständiger Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    margin="normal"
                                    required
                                    autoFocus
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="E-Mail Adresse"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    margin="normal"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Telefonnummer"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    margin="normal"
                                    placeholder="+49 XXX XXXXXXX"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Passwort"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    margin="normal"
                                    required
                                    helperText="Mindestens 6 Zeichen"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        mt: 4,
                                        mb: 2,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        boxShadow: '0 8px 16px rgba(240, 147, 251, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                                            boxShadow: '0 12px 24px rgba(240, 147, 251, 0.5)',
                                        },
                                    }}
                                >
                                    {loading ? 'Wird erstellt...' : 'Jetzt registrieren'}
                                </Button>

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Bereits registriert?{' '}
                                        <Box
                                            component={RouterLink}
                                            to="/login"
                                            sx={{
                                                color: 'primary.main',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Jetzt anmelden
                                        </Box>
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
