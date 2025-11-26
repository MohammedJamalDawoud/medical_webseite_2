import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
    Typography,
    Grid,
    TextField,
    Chip,
    Stack,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    CalendarMonth,
    AccessTime,
    VideoCall,
    Phone,
    Chat,
    CheckCircle,
    EventAvailable,
} from '@mui/icons-material';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import apiClient from '../api/client';

interface BookingDialogProps {
    open: boolean;
    onClose: () => void;
    doctor: any;
    onSuccess: () => void;
    appointmentId?: number; // Optional for rescheduling
}

const steps = ['Datum & Zeit', 'Konsultationsart', 'Bestätigung'];

export default function BookingDialog({ open, onClose, doctor, onSuccess, appointmentId }: BookingDialogProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [consultationType, setConsultationType] = useState<string>('VIDEO');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Generate next 7 days
    const availableDates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i + 1));

    // Mock time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            await handleSubmit();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime || !doctor) return;

        setLoading(true);
        setError('');

        try {
            const payload = {
                doctor_id: doctor.id,
                doctor_name: doctor.name,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedTime,
                type: consultationType,
                notes: notes,
                status: 'CONFIRMED'
            };

            if (appointmentId) {
                // Reschedule existing appointment
                await apiClient.put(`/appointments/${appointmentId}`, payload);
            } else {
                // Create new appointment
                await apiClient.post('/appointments', payload);
            }

            onSuccess();
            handleClose();
        } catch (err) {
            setError('Fehler bei der Buchung. Bitte versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setActiveStep(0);
        setSelectedDate(null);
        setSelectedTime(null);
        setConsultationType('VIDEO');
        setNotes('');
        setError('');
        onClose();
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <VideoCall />;
            case 'PHONE': return <Phone />;
            case 'CHAT': return <Chat />;
            default: return <VideoCall />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'VIDEO': return 'Video-Sprechstunde';
            case 'PHONE': return 'Telefonat';
            case 'CHAT': return 'Chat-Konsultation';
            default: return type;
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
                {appointmentId ? 'Termin verschieben' : 'Termin buchen'}
                {doctor && (
                    <Typography variant="subtitle2" color="text.secondary">
                        bei {doctor.name} ({doctor.specialization})
                    </Typography>
                )}
            </DialogTitle>

            <DialogContent dividers>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {activeStep === 0 && (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                            <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
                            Datum wählen
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2, mb: 3 }}>
                            {availableDates.map((date) => (
                                <Box
                                    key={date.toISOString()}
                                    onClick={() => setSelectedDate(date)}
                                    sx={{
                                        minWidth: 80,
                                        p: 1.5,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: selectedDate && isSameDay(selectedDate, date) ? 'primary.main' : 'divider',
                                        bgcolor: selectedDate && isSameDay(selectedDate, date) ? 'primary.50' : 'background.paper',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            bgcolor: 'primary.50',
                                        },
                                    }}
                                >
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        {format(date, 'EEE', { locale: de })}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {format(date, 'dd')}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                            <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                            Uhrzeit wählen
                        </Typography>
                        <Grid container spacing={1}>
                            {timeSlots.map((time) => (
                                <Grid item xs={3} key={time}>
                                    <Chip
                                        label={time}
                                        onClick={() => setSelectedTime(time)}
                                        variant={selectedTime === time ? 'filled' : 'outlined'}
                                        color={selectedTime === time ? 'primary' : 'default'}
                                        sx={{ width: '100%', cursor: 'pointer' }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                            Wie möchten Sie den Arzt sprechen?
                        </Typography>
                        <Stack spacing={2} sx={{ mb: 4 }}>
                            {['VIDEO', 'PHONE', 'CHAT'].map((type) => (
                                <Box
                                    key={type}
                                    onClick={() => setConsultationType(type)}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: consultationType === type ? 'primary.main' : 'divider',
                                        bgcolor: consultationType === type ? 'primary.50' : 'background.paper',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <Box sx={{
                                        mr: 2,
                                        color: consultationType === type ? 'primary.main' : 'text.secondary',
                                        display: 'flex'
                                    }}>
                                        {getTypeIcon(type)}
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {getTypeLabel(type)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {type === 'VIDEO' ? 'Per Videoanruf über den Browser' :
                                                type === 'PHONE' ? 'Der Arzt ruft Sie an' :
                                                    'Schriftlicher Austausch im Chat'}
                                        </Typography>
                                    </Box>
                                    {consultationType === type && <CheckCircle color="primary" fontSize="small" />}
                                </Box>
                            ))}
                        </Stack>

                        <TextField
                            fullWidth
                            label="Notizen für den Arzt (optional)"
                            multiline
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Beschreiben Sie kurz Ihre Beschwerden..."
                        />
                    </Box>
                )}

                {activeStep === 2 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <EventAvailable sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Zusammenfassung
                        </Typography>

                        <Box sx={{
                            bgcolor: 'grey.50',
                            p: 3,
                            borderRadius: 2,
                            textAlign: 'left',
                            maxWidth: 400,
                            mx: 'auto',
                            mb: 2
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">Arzt:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2" fontWeight={600}>{doctor?.name}</Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">Datum:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {selectedDate && format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">Zeit:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2" fontWeight={600}>{selectedTime} Uhr</Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">Art:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2" fontWeight={600}>{getTypeLabel(consultationType)}</Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                            Mit Klick auf "Termin verbindlich buchen" stimmen Sie unseren AGB zu.
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={activeStep === 0 ? handleClose : handleBack} disabled={loading}>
                    {activeStep === 0 ? 'Abbrechen' : 'Zurück'}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                        (activeStep === 0 && (!selectedDate || !selectedTime)) ||
                        loading
                    }
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {activeStep === steps.length - 1 ? 'Termin verbindlich buchen' : 'Weiter'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
