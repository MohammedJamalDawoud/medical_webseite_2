import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    Tabs,
    Tab,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Snackbar,
    Alert,
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
    Edit,
    AccessTime,
    Event,
} from '@mui/icons-material';
import apiClient from '../api/client';
import { format, isPast, isFuture, differenceInHours, differenceInMinutes } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import BookingDialog from '../components/BookingDialog';

export default function AppointmentsPage() {
    const [tabValue, setTabValue] = useState(0);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
    const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState<any>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['appointments'],
        queryFn: async () => {
            const res = await apiClient.get('/appointments');
            return res.data;
        },
    });

    const cancelMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.patch(`/appointments/${id}`, { status: 'CANCELLED' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            setSnackbar({ open: true, message: 'Termin erfolgreich abgesagt', severity: 'success' });
            setCancelDialogOpen(false);
        },
        onError: () => {
            setSnackbar({ open: true, message: 'Fehler beim Absagen des Termins', severity: 'error' });
        },
    });

    const handleCancelClick = (id: number) => {
        setSelectedAppointmentId(id);
        setCancelDialogOpen(true);
    };

    const handleConfirmCancel = () => {
        if (selectedAppointmentId) {
            cancelMutation.mutate(selectedAppointmentId);
        }
    };

    const handleRescheduleClick = (appointment: any) => {
        setSelectedAppointmentForReschedule(appointment);
        setRescheduleDialogOpen(true);
    };

    const handleRescheduleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        setSnackbar({ open: true, message: 'Termin erfolgreich verschoben', severity: 'success' });
        setRescheduleDialogOpen(false);
    };

    const handleJoinCall = (url: string) => {
        window.open(url || 'https://meet.google.com/new', '_blank');
    };

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

    const getCountdown = (date: string, time: string) => {
        const appointmentDate = new Date(`${date}T${time}`);
        const now = new Date();

        if (isPast(appointmentDate)) return null;

        const hours = differenceInHours(appointmentDate, now);
        const minutes = differenceInMinutes(appointmentDate, now) % 60;

        if (hours < 24) {
            return `In ${hours}h ${minutes}m`;
        } else {
            const days = Math.floor(hours / 24);
            return `In ${days} Tag${days > 1 ? 'en' : ''}`;
        }
    };

    const isUpcoming = (date: string, time: string) => {
        return isFuture(new Date(`${date}T${time}`));
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    const upcomingAppointments = appointments?.filter((apt: any) =>
        isUpcoming(apt.date, apt.time) && apt.status !== 'CANCELLED'
    ) || [];

    const pastAppointments = appointments?.filter((apt: any) =>
        !isUpcoming(apt.date, apt.time) || apt.status === 'CANCELLED'
    ) || [];

    const displayedAppointments = tabValue === 0 ? upcomingAppointments : pastAppointments;

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

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                        },
                    }}
                >
                    <Tab
                        label={`Bevorstehend (${upcomingAppointments.length})`}
                        icon={<Event />}
                        iconPosition="start"
                    />
                    <Tab
                        label={`Vergangen (${pastAppointments.length})`}
                        icon={<CheckCircle />}
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {displayedAppointments.length > 0 ? (
                <Grid container spacing={3}>
                    {displayedAppointments.map((apt: any, index: number) => {
                        const countdown = getCountdown(apt.date, apt.time);
                        return (
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
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
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
                                                    {countdown && (
                                                        <Chip
                                                            icon={<AccessTime sx={{ fontSize: 16 }} />}
                                                            label={countdown}
                                                            size="small"
                                                            sx={{
                                                                background: '#10b98120',
                                                                color: '#10b981',
                                                                fontWeight: 600,
                                                                fontSize: '0.75rem',
                                                            }}
                                                        />
                                                    )}
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
                                        {apt.status === 'CONFIRMED' && tabValue === 0 && (
                                            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                                {apt.type === 'VIDEO' && (
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        startIcon={<VideoCall />}
                                                        onClick={() => handleJoinCall(apt.video_url)}
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
                                                <Tooltip title="Termin verschieben">
                                                    <IconButton
                                                        onClick={() => handleRescheduleClick(apt)}
                                                        sx={{
                                                            border: '2px solid',
                                                            borderColor: 'primary.main',
                                                            color: 'primary.main',
                                                            '&:hover': {
                                                                bgcolor: 'primary.50',
                                                            },
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={<Cancel />}
                                                    color="error"
                                                    onClick={() => handleCancelClick(apt.id)}
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
                        );
                    })}
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
                        {tabValue === 0 ? 'Keine bevorstehenden Termine' : 'Keine vergangenen Termine'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {tabValue === 0
                            ? 'Buchen Sie Ihren ersten Termin mit einem unserer Ärzte'
                            : 'Ihre abgeschlossenen Termine werden hier angezeigt'
                        }
                    </Typography>
                    {tabValue === 0 && (
                        <Button
                            variant="contained"
                            onClick={() => navigate('/doctors')}
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
                    )}
                </Paper>
            )}

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
            >
                <DialogTitle>Termin absagen?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Möchten Sie diesen Termin wirklich absagen? Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Abbrechen</Button>
                    <Button onClick={handleConfirmCancel} color="error" autoFocus>
                        Termin absagen
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reschedule Dialog */}
            {selectedAppointmentForReschedule && (
                <BookingDialog
                    open={rescheduleDialogOpen}
                    onClose={() => setRescheduleDialogOpen(false)}
                    doctor={{
                        id: selectedAppointmentForReschedule.doctor_id,
                        name: selectedAppointmentForReschedule.doctor_name,
                        specialization: 'Spezialist' // Fallback as we might not have it in appointment object
                    }}
                    onSuccess={handleRescheduleSuccess}
                    appointmentId={selectedAppointmentForReschedule.id}
                />
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
