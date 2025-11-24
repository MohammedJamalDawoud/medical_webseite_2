import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarToday, LocalHospital, Description, Science, FitnessCenter, Help } from '@mui/icons-material';

export default function DashboardPage() {
    const navigate = useNavigate();

    const cards = [
        { title: 'Termine & Ärzte', icon: <CalendarToday fontSize="large" />, path: '/doctors', description: 'Arzt finden und Termin buchen' },
        { title: 'Rezepte & Medikamente', icon: <LocalHospital fontSize="large" />, path: '/prescriptions', description: 'Ihre Rezepte und Medikamente verwalten' },
        { title: 'Arztberichte', icon: <Description fontSize="large" />, path: '/reports', description: 'Ihre medizinischen Berichte einsehen' },
        { title: 'Laborergebnisse', icon: <Science fontSize="large" />, path: '/lab-results', description: 'Ihre Laborwerte einsehen' },
        { title: 'Gesundheitstipps', icon: <FitnessCenter fontSize="large" />, path: '/health-tips', description: 'Tipps für ein gesundes Leben' },
        { title: 'Symptom-Checker', icon: <Help fontSize="large" />, path: '/symptom-checker', description: 'Erste Einschätzung Ihrer Symptome' },
    ];

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Willkommen im Telemedizin Portal
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Ihr digitaler Gesundheitshelfer für Termine, Rezepte und mehr.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.title}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    {card.icon}
                                    <Typography variant="h6" sx={{ ml: 1 }}>
                                        {card.title}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => navigate(card.path)}>
                                    Öffnen
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
