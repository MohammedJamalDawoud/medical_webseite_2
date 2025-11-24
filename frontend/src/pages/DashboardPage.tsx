import { Typography, Grid, Card, CardContent, CardActions, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarToday, LocalHospital, Description, Science, FitnessCenter, Help } from '@mui/icons-material';

export default function DashboardPage() {
    const navigate = useNavigate();

    const cards = [
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
                        mb: 1
                    }}
                >
                    Willkommen im Telemedizin Portal
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Ihr digitaler Gesundheitshelfer für Termine, Rezepte und mehr.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={card.title}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'visible',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: card.gradient,
                                    borderRadius: '16px 16px 0 0',
                                },
                                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                '@keyframes fadeInUp': {
                                    from: {
                                        opacity: 0,
                                        transform: 'translateY(20px)',
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                    },
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
                                        background: card.gradient,
                                        color: 'white',
                                        fontWeight: 600,
                                        px: 3,
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 8px 16px ${card.iconBg}40`,
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

