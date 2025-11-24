import { useQuery } from '@tanstack/react-query';
import {
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Box,
    Button,
    Divider,
    Stack,
    CircularProgress,
    Paper,
    IconButton,
} from '@mui/material';
import {
    Medication,
    LocalPharmacy,
    Download,
    History,
    EventRepeat,
    Warning,
    CheckCircle,
    AccessTime,
} from '@mui/icons-material';
import apiClient from '../api/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function PrescriptionsPage() {
    const { data: prescriptions, isLoading } = useQuery({
        queryKey: ['prescriptions'],
        queryFn: async () => {
            const res = await apiClient.get('/prescriptions');
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Meine Rezepte
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Übersicht Ihrer Medikamente und Verordnungen
                </Typography>
            </Box>

            {prescriptions && prescriptions.length > 0 ? (
                <Grid container spacing={3}>
                    {prescriptions.map((prescription: any, index: number) => (
                        <Grid item xs={12} key={prescription.id}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                    },
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                    '@keyframes fadeInUp': {
                                        from: { opacity: 0, transform: 'translateY(20px)' },
                                        to: { opacity: 1, transform: 'translateY(0)' },
                                    },
                                    overflow: 'visible',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Grid container spacing={3}>
                                        {/* Left Side: Info */}
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        borderRadius: '16px',
                                                        background: 'linear-gradient(135deg, #43e97b20 0%, #38f9d720 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2,
                                                    }}
                                                >
                                                    <LocalPharmacy sx={{ color: '#38f9d7', fontSize: 32 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Ausgestellt von
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {prescription.doctor_name}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Stack spacing={1} sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <History sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {format(new Date(prescription.created_at), 'dd. MMMM yyyy', { locale: de })}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CheckCircle sx={{ fontSize: 20, color: '#10b981', mr: 1 }} />
                                                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 500 }}>
                                                        Aktiv
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Button
                                                variant="outlined"
                                                startIcon={<Download />}
                                                sx={{ mt: 3, borderRadius: 2 }}
                                                fullWidth
                                            >
                                                PDF herunterladen
                                            </Button>
                                        </Grid>

                                        {/* Right Side: Medications */}
                                        <Grid item xs={12} md={8}>
                                            <Box sx={{
                                                bgcolor: 'grey.50',
                                                p: 3,
                                                borderRadius: 3,
                                                height: '100%'
                                            }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                                                    <Medication sx={{ mr: 1, color: 'primary.main' }} />
                                                    Verordnete Medikamente
                                                </Typography>

                                                <Stack spacing={2}>
                                                    {prescription.medications?.map((med: any) => (
                                                        <Paper
                                                            key={med.id}
                                                            elevation={0}
                                                            sx={{
                                                                p: 2,
                                                                bgcolor: 'white',
                                                                borderRadius: 2,
                                                                border: '1px solid',
                                                                borderColor: 'grey.200',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                                                    {med.name}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {med.dosage}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ textAlign: 'right' }}>
                                                                <Chip
                                                                    icon={<AccessTime sx={{ fontSize: '16px !important' }} />}
                                                                    label="Täglich"
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                    sx={{ borderRadius: 1.5 }}
                                                                />
                                                            </Box>
                                                        </Paper>
                                                    ))}
                                                </Stack>

                                                {prescription.description && (
                                                    <Box sx={{ mt: 3 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                            HINWEISE
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {prescription.description}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                                    <Button
                                                        startIcon={<EventRepeat />}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Rezept erneuern
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.05) 0%, rgba(56, 249, 215, 0.05) 100%)',
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #43e97b20 0%, #38f9d720 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 3,
                        }}
                    >
                        <LocalPharmacy sx={{ fontSize: 40, color: '#38f9d7' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Keine Rezepte vorhanden
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ihre verschriebenen Medikamente werden hier angezeigt
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
