import { useQuery } from '@tanstack/react-query';
import {
    Typography,
    Card,
    CardContent,
    Chip,
    Grid,
    Box,
    Avatar,
    Divider,
    Button,
    Stack,
    CircularProgress,
    Paper,
} from '@mui/material';
import {
    CalendarMonth,
    VideoCall,
    Chat,
    Phone,
    CheckCircle,
    Schedule,
    Cancel,
    Person,
} from '@mui/icons-material';
import apiClient from '../api/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function AppointmentsPage() {
    const { data: appointments, isLoading } = useQuery({
        queryKey: ['appointments'],
        queryFn: async () => {
            const res = await apiClient.get('/appointments');
            return res.data;
        },
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'CONFIRMED': '#10b981',
            'PENDING': '#f59e0b',
            'COMPLETED': '#667eea',
            'CANCELLED': '#ef4444',
        };
        return colors[status] || '#64748b';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'CONFIRMED': 'Bestätigt',
            'PENDING': 'Ausstehend',
            'COMPLETED': 'Abgeschlossen',
            'CANCELLED': 'Abgesagt',
        };
        return labels[status] || status;
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, JSX.Element> = {
            'VIDEO': <VideoCall />,
            'CHAT': <Chat />,
            'PHONE': <Phone />,
        };
        return icons[type] || <VideoCall />;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'VIDEO': 'Video',
            'CHAT': 'Chat',
            'PHONE': 'Telefon',
        };
        return labels[type] || type;
    };

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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Meine Termine
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Verwalten Sie Ihre bevorstehenden und vergangenen Arzttermine
                </Typography>
            </Box>

            {appointments && appointments.length > 0 ? (
                <Grid container spacing={3}>
                    {appointments.map((apt: any, index: number) => (
                        <Grid item xs={12} md={6} key={apt.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 3,
                                    borderLeft: `4px solid ${getStatusColor(apt.status)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
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
                                <CardContent sx={{ p: 3 }}>
                                    {/* Header with Doctor Info */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                mr: 2,
                                                background: `linear-gradient(135deg, ${getStatusColor(apt.status)}40 0%, ${getStatusColor(apt.status)} 100%)`,
                                                color: getStatusColor(apt.status),
                                            }}
                                        >
                                            <Person />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {apt.doctor_name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Chip
                                                    label={getStatusLabel(apt.status)}
                                                    size="small"
                                                    sx={{
                                                        background: `${getStatusColor(apt.status)}20`,
                                                        color: getStatusColor(apt.status),
                                                        fontWeight: 600,
                                                        borderRadius: 1.5,
                                                    }}
                                                />
                                                <Chip
                                                    icon={getTypeIcon(apt.type)}
                                                    label={getTypeLabel(apt.type)}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        borderColor: getStatusColor(apt.status),
                                                        color: getStatusColor(apt.status),
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Date and Time */}
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarMonth sx={{ fontSize: 20, color: 'text.secondary', mr: 1.5 }} />
                                            <Typography variant="body2">
                                                <strong>Datum:</strong> {format(new Date(apt.date + 'T00:00:00'), 'EEEE, dd. MMMM yyyy', { locale: de })}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Schedule sx={{ fontSize: 20, color: 'text.secondary', mr: 1.5 }} />
                                            <Typography variant="body2">
                                                <strong>Uhrzeit:</strong> {apt.time} Uhr
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Notes if available */}
                                    {apt.notes && (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mt: 2,
                                                p: 1.5,
                                                bgcolor: 'grey.50',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary">
                                                <strong>Notizen:</strong> {apt.notes}
                                            </Typography>
                                        </Paper>
                                    )}

                                    {/* Action Buttons */}
                                    {apt.status === 'CONFIRMED' && (
                                        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                            {apt.type === 'VIDEO' && (
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<VideoCall />}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        background: `linear-gradient(135deg, ${getStatusColor(apt.status)} 0%, ${getStatusColor(apt.status)}CC 100%)`,
                                                    }}
                                                >
                                                    Beitreten
                                                </Button>
                                            )}
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<Cancel />}
                                                color="error"
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    borderWidth: 2,
                                                    '&:hover': { borderWidth: 2 },
                                                }}
                                            >
                                                Absagen
                                            </Button>
                                        </Stack>
                                    )}
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
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 3,
                        }}
                    >
                        <CalendarMonth sx={{ fontSize: 40, color: '#667eea' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Keine Termine vorhanden
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Buchen Sie Ihren ersten Termin mit einem unserer Ärzte
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            px: 4,
                            py: 1.2,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Termin buchen
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
