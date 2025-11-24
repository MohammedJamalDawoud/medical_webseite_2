import { useState } from 'react';
import {
    Typography,
    Card,
    CardContent,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Alert,
    Box,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Paper,
    CircularProgress,
    Slider,
    Stack,
} from '@mui/material';
import {
    Warning,
    LocalHospital,
    CheckCircle,
    ArrowForward,
    ArrowBack,
    MedicalServices,
    ReportProblem,
} from '@mui/icons-material';
import apiClient from '../api/client';

const steps = ['Symptome beschreiben', 'Details angeben', 'Analyse'];

export default function SymptomCheckerPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({ symptoms_category: '', severity: 'mild', duration: '' });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (activeStep === 1) {
            await handleSubmit();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await apiClient.post('/symptom-checker', formData);
            setResult(res.data);
            setActiveStep(2);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setFormData({ symptoms_category: '', severity: 'mild', duration: '' });
        setResult(null);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Symptom-Checker
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Erhalten Sie eine erste Einschätzung Ihrer Beschwerden durch unser KI-gestütztes Tool
                </Typography>
            </Box>

            <Alert
                severity="warning"
                icon={<Warning fontSize="inherit" />}
                sx={{
                    mb: 4,
                    borderRadius: 2,
                    maxWidth: 800,
                    mx: 'auto',
                    border: '1px solid #ff9800',
                    '& .MuiAlert-message': { width: '100%' }
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    WICHTIGER MEDIZINISCHER HINWEIS
                </Typography>
                <Typography variant="body2">
                    Dieses Tool ersetzt keinen Arztbesuch und stellt keine medizinische Diagnose.
                    Bei akuten Notfällen (z.B. Atemnot, Brustschmerzen, Bewusstlosigkeit) wählen Sie sofort den <strong>Notruf 112</strong>!
                </Typography>
            </Alert>

            <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 3, overflow: 'visible' }}>
                <CardContent sx={{ p: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {activeStep === 0 && (
                        <Box sx={{ animation: 'fadeIn 0.5s' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                Was sind Ihre Hauptbeschwerden?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Beschreiben Sie kurz, worunter Sie leiden (z.B. "Starke Kopfschmerzen", "Fieber und Husten").
                            </Typography>

                            <TextField
                                fullWidth
                                label="Symptome"
                                value={formData.symptoms_category}
                                onChange={(e) => setFormData({ ...formData, symptoms_category: e.target.value })}
                                margin="normal"
                                required
                                placeholder="z.B. Kopfschmerzen, Bauchschmerzen, Fieber"
                                InputProps={{
                                    startAdornment: <MedicalServices color="action" sx={{ mr: 1 }} />,
                                }}
                                sx={{ mb: 3 }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!formData.symptoms_category}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                        color: '#d63384', // Darker pink for text contrast
                                    }}
                                >
                                    Weiter
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <Box sx={{ animation: 'fadeIn 0.5s' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                Details zu Ihren Beschwerden
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Wie stark sind die Beschwerden?</Typography>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Schweregrad</InputLabel>
                                        <Select
                                            value={formData.severity}
                                            label="Schweregrad"
                                            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                        >
                                            <MenuItem value="mild">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CheckCircle sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                                                    Leicht (beeinträchtigt Alltag kaum)
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="moderate">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <ReportProblem sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                                                    Mittel (spürbare Beeinträchtigung)
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="severe">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Warning sx={{ color: '#f44336', mr: 1, fontSize: 20 }} />
                                                    Stark (Alltag nicht möglich)
                                                </Box>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Wie lange bestehen die Beschwerden schon?"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        margin="normal"
                                        required
                                        placeholder="z.B. seit 2 Tagen, seit heute Morgen"
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button
                                    onClick={handleBack}
                                    startIcon={<ArrowBack />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Zurück
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!formData.duration || loading}
                                    endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                                    sx={{
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                        color: '#d63384',
                                    }}
                                >
                                    {loading ? 'Analysiere...' : 'Auswerten'}
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {activeStep === 2 && result && (
                        <Box sx={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #ff9a9e20 0%, #fecfef20 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    mb: 3,
                                }}
                            >
                                <LocalHospital sx={{ fontSize: 40, color: '#ff9a9e' }} />
                            </Box>

                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                Ergebnis der Analyse
                            </Typography>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    bgcolor: 'grey.50',
                                    borderRadius: 2,
                                    mb: 3,
                                    textAlign: 'left',
                                    borderLeft: '4px solid #ff9a9e'
                                }}
                            >
                                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                    {result.result_message}
                                </Typography>
                            </Paper>

                            <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
                                {result.disclaimer}
                            </Alert>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    onClick={handleReset}
                                    sx={{
                                        px: 4,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                >
                                    Neue Prüfung
                                </Button>
                                <Button
                                    variant="outlined"
                                    href="/doctors"
                                    sx={{
                                        px: 4,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Arzt finden
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
