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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {
    ExpandMore,
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    LocalHospital,
    Security,
    Speed,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
                    {/* Left side - Branding */}
                    <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Box sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <LocalHospital sx={{ fontSize: 60, mr: 2 }} />
                                <Typography variant="h2" sx={{ fontWeight: 800 }}>
                                    Telemedizin
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, fontWeight: 300 }}>
                                Ihre Gesundheit in den besten Händen
                            </Typography>

                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2,
                                            }}
                                        >
                                            <Security sx={{ color: 'white' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Sicher & Vertraulich
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Ende-zu-Ende verschlüsselt
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2,
                                            }}
                                        >
                                            <Speed sx={{ color: 'white' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Schnell & Einfach
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Termine in Minuten
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Right side - Login Form */}
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
                                    Willkommen zurück
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Melden Sie sich an, um fortzufahren
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
                                    label="E-Mail Adresse"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    margin="normal"
                                    required
                                    autoFocus
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
                                    label="Passwort"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    margin="normal"
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
                                        boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            boxShadow: '0 12px 24px rgba(102, 126, 234, 0.5)',
                                        },
                                    }}
                                >
                                    {loading ? 'Wird angemeldet...' : 'Anmelden'}
                                </Button>

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Noch kein Konto?
                                    </Typography>
                                    <Button
                                        component={RouterLink}
                                        to="/register"
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            mt: 1,
                                            py: 1.5,
                                            borderRadius: 2,
                                            borderWidth: 2,
                                            fontWeight: 600,
                                            '&:hover': {
                                                borderWidth: 2,
                                            },
                                        }}
                                    >
                                        Jetzt registrieren
                                    </Button>
                                </Box>

                                <Accordion
                                    sx={{
                                        mt: 3,
                                        boxShadow: 'none',
                                        '&:before': { display: 'none' },
                                        background: 'transparent',
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        sx={{
                                            bgcolor: 'grey.50',
                                            borderRadius: 2,
                                            minHeight: 48,
                                            '&:hover': { bgcolor: 'grey.100' },
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            Demo-Zugangsdaten anzeigen
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ bgcolor: 'grey.50', borderRadius: '0 0 8px 8px', pt: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            <strong>Test-Accounts (optional):</strong><br />
                                            Patient: demo.patient@example.com / password123<br />
                                            Arzt: demo.doctor@example.com / password123
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

