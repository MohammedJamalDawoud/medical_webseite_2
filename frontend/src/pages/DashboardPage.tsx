import { Typography, Grid, Card, CardContent, CardActions, Button, Box, Container, Paper, Avatar, Chip, Stack, CircularProgress, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    CalendarToday,
    LocalHospital,
    Description,
    Science,
    FitnessCenter,
    Help,
    ArrowForward,
    Event,
    Medication,
    TrendingUp,
    TipsAndUpdates
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { format, isFuture, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import apiClient from '../api/client';
import { useAuth } from '../auth/AuthContext';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch Appointments
    const { data: appointments, isLoading: loadingAppointments } = useQuery({
        queryKey: ['appointments'],
        queryFn: async () => {
            const res = await apiClient.get('/appointments');
            return res.data;
        },
    });

    // Fetch Prescriptions
    const { data: prescriptions, isLoading: loadingPrescriptions } = useQuery({
        queryKey: ['prescriptions'],
        queryFn: async () => {
            const res = await apiClient.get('/prescriptions');
            return res.data;
        },
    });

    // Fetch Lab Results
    const { data: labResults, isLoading: loadingLabResults } = useQuery({
        queryKey: ['lab-results'],
        queryFn: async () => {
            const res = await apiClient.get('/lab-results');
            return res.data;
        },
    });

    // Fetch Health Tips
    const { data: healthTips, isLoading: loadingTips } = useQuery({
        queryKey: ['health-tips'],
        queryFn: async () => {
            const res = await apiClient.get('/content/health-tips');
            return res.data;
        },
    });

    // Process Data
    const nextAppointment = appointments
        ?.filter((apt: any) => isFuture(parseISO(`${apt.date}T${apt.time}`)))
        .sort((a: any, b: any) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];

    const recentPrescription = prescriptions?.[0];
    const recentLabResult = labResults?.[0];
    const dailyTip = healthTips?.[Math.floor(Math.random() * (healthTips?.length || 1))];

    const quickActions = [
        {
            title: 'Termine & Ärzte',
            icon: <CalendarToday fontSize="large" />,
            path: '/doctors',
            description: 'Arzt finden und Termin buchen',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            iconBg: '#667eea'
        },
        {
            title: 'Rezepte & Medikamente',
            icon: <LocalHospital fontSize="large" />,
            path: '/prescriptions',
            description: 'Ihre Rezepte und Medikamente verwalten',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            iconBg: '#f093fb'
        },
        {
            title: 'Arztberichte',
            icon: <Description fontSize="large" />,
            path: '/reports',
            description: 'Ihre medizinischen Berichte einsehen',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            iconBg: '#4facfe'
        },
        {
            title: 'Laborergebnisse',
            icon: <Science fontSize="large" />,
            path: '/lab-results',
            description: 'Ihre Laborwerte einsehen',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            iconBg: '#43e97b'
        },
        {
            title: 'Gesundheitstipps',
            icon: <FitnessCenter fontSize="large" />,
            path: '/health-tips',
            description: 'Tipps für ein gesundes Leben',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            iconBg: '#fa709a'
        },
        {
            title: 'Symptom-Checker',
            icon: <Help fontSize="large" />,
            path: '/symptom-checker',
            description: 'Erste Einschätzung Ihrer Symptome',
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            iconBg: '#30cfd0'
        },
    ];

    return (
        <Container maxWidth="lg">
            {/* Welcome Section */}
            <Box sx={{ mb: 5 }}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                    }}
                >
                    Willkommen zurück, {user?.name?.split(' ')[0] || 'Patient'}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Hier ist Ihre Gesundheitsübersicht für heute.
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
                {/* Next Appointment Card - Prominent */}
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{
                            height: '100%',
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 12px 24px rgba(118, 75, 162, 0.3)',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                            }}
                        />
                        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                            <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1, fontWeight: 600 }}>
                                NÄCHSTER TERMIN
                            </Typography>

                            {loadingAppointments ? (
                                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress color="inherit" />
                                </Box>
                            ) : nextAppointment ? (
                                <Box sx={{ mt: 2 }}>
                                    <Grid container alignItems="center" spacing={3}>
                                        <Grid item>
                                            <Paper
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 3,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    backdropFilter: 'blur(10px)',
                                                    color: 'white',
                                                }}
                                            >
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                    {format(parseISO(nextAppointment.date), 'dd')}
                                                </Typography>
                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                                    {format(parseISO(nextAppointment.date), 'MMM', { locale: de })}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {nextAppointment.doctor_name}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                                                {nextAppointment.type === 'VIDEO' ? 'Video-Sprechstunde' : 'Praxisbesuch'} • {nextAppointment.time} Uhr
                                            </Typography>
                                            <Chip
                                                label="Bestätigt"
                                                size="small"
                                                sx={{
                                                    bgcolor: '#43e97b',
                                                    color: '#000',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate('/appointments')}
                                                sx={{
                                                    bgcolor: 'white',
                                                    color: '#764ba2',
                                                    fontWeight: 600,
                                                    textTransform: 'none',
                                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ) : (
                                <Box sx={{ mt: 2, textAlign: 'center', py: 2 }}>
                                    <Event sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                                    <Typography variant="h6">Keine anstehenden Termine</Typography>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={() => navigate('/doctors')}
                                        sx={{ mt: 2, textTransform: 'none' }}
                                    >
                                        Jetzt Termin buchen
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Daily Tip Card */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 12px 24px rgba(250, 112, 154, 0.3)',
                        }}
                    >
                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TipsAndUpdates sx={{ mr: 1 }} />
                                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                                    TIPP DES TAGES
                                </Typography>
                            </Box>

                            {loadingTips ? (
                                <CircularProgress color="inherit" size={30} />
                            ) : dailyTip ? (
                                <>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                                        {dailyTip.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2, flexGrow: 1 }}>
                                        {dailyTip.content.substring(0, 100)}...
                                    </Typography>
                                    <Button
                                        endIcon={<ArrowForward />}
                                        onClick={() => navigate('/health-tips')}
                                        sx={{
                                            color: 'white',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            alignSelf: 'flex-start',
                                            p: 0,
                                            '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
                                        }}
                                    >
                                        Mehr lesen
                                    </Button>
                                </>
                            ) : (
                                <Typography>Keine Tipps verfügbar</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Activity Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                <Medication sx={{ mr: 1, color: '#f093fb' }} />
                                Aktuelle Rezepte
                            </Typography>
                            <Button size="small" onClick={() => navigate('/prescriptions')}>Alle ansehen</Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {loadingPrescriptions ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress size={30} />
                            </Box>
                        ) : recentPrescription ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: '#f093fb', mr: 2 }}>
                                    <LocalHospital />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {recentPrescription.medications[0]?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Dr. {recentPrescription.doctor_name} • {format(parseISO(recentPrescription.created_at), 'dd.MM.yyyy')}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Typography color="text.secondary" variant="body2">Keine aktuellen Rezepte</Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                <Science sx={{ mr: 1, color: '#43e97b' }} />
                                Laborergebnisse
                            </Typography>
                            <Button size="small" onClick={() => navigate('/lab-results')}>Alle ansehen</Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {loadingLabResults ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress size={30} />
                            </Box>
                        ) : recentLabResult ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: '#43e97b', mr: 2 }}>
                                    <TrendingUp />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {recentLabResult.test_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {format(parseISO(recentLabResult.date), 'dd.MM.yyyy')} • {recentLabResult.status === 'COMPLETED' ? 'Abgeschlossen' : 'In Bearbeitung'}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Typography color="text.secondary" variant="body2">Keine neuen Ergebnisse</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Quick Actions Title */}
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Schnellzugriff
            </Typography>

            {/* Existing Quick Actions Grid */}
            <Grid container spacing={3}>
                {quickActions.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={card.title}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'visible',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: card.gradient,
                                    borderRadius: '12px 12px 0 0',
                                },
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 56,
                                        height: 56,
                                        borderRadius: '12px',
                                        background: `${card.iconBg}15`,
                                        color: card.iconBg,
                                        mb: 2,
                                    }}
                                >
                                    {card.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button
                                    size="medium"
                                    onClick={() => navigate(card.path)}
                                    sx={{
                                        color: card.iconBg,
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: `${card.iconBg}10`,
                                        },
                                    }}
                                >
                                    Öffnen
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
