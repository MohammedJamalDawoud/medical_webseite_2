import { useState, useEffect } from 'react';
import {
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Alert,
    Box,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Slider,
    Autocomplete,
    Chip,
    Stack,
} from '@mui/material';
import {
    Warning,
    ArrowForward,
    ArrowBack,
    MedicalServices,
    SentimentVeryDissatisfied,
    SentimentDissatisfied,
    SentimentNeutral,
    SentimentSatisfied,
    SentimentVerySatisfied,
    CheckCircle,
    History,
} from '@mui/icons-material';
import apiClient from '../api/client';

const steps = ['Symptome wählen', 'Körperregion & Schweregrad', 'Details', 'Analyse'];

// Common symptoms for autocomplete
const commonSymptoms = [
    'Kopfschmerzen',
    'Fieber',
    'Husten',
    'Halsschmerzen',
    'Bauchschmerzen',
    'Übelkeit',
    'Erbrechen',
    'Durchfall',
    'Müdigkeit',
    'Schwindel',
    'Atemnot',
    'Brustschmerzen',
    'Rückenschmerzen',
    'Gelenkschmerzen',
    'Hautausschlag',
];

// Severity emojis
const severityEmojis = [
    { value: 1, icon: <SentimentVerySatisfied />, label: 'Sehr leicht', color: '#4caf50' },
    { value: 2, icon: <SentimentSatisfied />, label: 'Leicht', color: '#8bc34a' },
    { value: 3, icon: <SentimentNeutral />, label: 'Mittel', color: '#ff9800' },
    { value: 4, icon: <SentimentDissatisfied />, label: 'Stark', color: '#ff5722' },
    { value: 5, icon: <SentimentVeryDissatisfied />, label: 'Sehr stark', color: '#f44336' },
];

export default function SymptomCheckerPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [bodyRegion, setBodyRegion] = useState('');
    const [severity, setSeverity] = useState(3);
    const [duration, setDuration] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('symptomCheckerHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const handleNext = async () => {
        if (activeStep === 2) {
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
            const formData = {
                symptoms_category: selectedSymptoms.join(', '),
                severity: severity === 5 ? 'severe' : severity >= 3 ? 'moderate' : 'mild',
                duration,
                body_region: bodyRegion,
                additional_info: additionalInfo,
            };

            const res = await apiClient.post('/symptom-checker', formData);
            setResult(res.data);
            setActiveStep(3);

            // Save to history
            const newEntry = {
                date: new Date().toISOString(),
                symptoms: selectedSymptoms,
                severity,
                result: res.data.result_message,
            };
            const updatedHistory = [newEntry, ...history].slice(0, 5); // Keep last 5
            setHistory(updatedHistory);
            localStorage.setItem('symptomCheckerHistory', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setSelectedSymptoms([]);
        setBodyRegion('');
        setSeverity(3);
        setDuration('');
        setAdditionalInfo('');
        setResult(null);
    };

    const currentEmoji = severityEmojis.find(e => e.value === severity) || severityEmojis[2];
    const showEmergencyBanner = severity >= 4 && selectedSymptoms.some(s =>
        s.toLowerCase().includes('atemnot') ||
        s.toLowerCase().includes('brustschmerzen') ||
        s.toLowerCase().includes('bewusstlos')
    );

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
                    Erhalten Sie eine erste Einschätzung Ihrer Beschwerden durch unser digitales Tool
                </Typography>
            </Box>

            {/* Emergency Banner */}
            {showEmergencyBanner && (
                <Alert
                    severity="error"
                    icon={<Warning fontSize="inherit" />}
                    sx={{
                        mb: 4,
                        borderRadius: 2,
                        maxWidth: 800,
                        mx: 'auto',
                        border: '2px solid #f44336',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.4)' },
                            '50%': { boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)' },
                        },
                    }}
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        ⚠️ NOTFALL - SOFORT HANDELN!
                    </Typography>
                    <Typography variant="body2">
                        Ihre Symptome könnten auf einen medizinischen Notfall hinweisen. Wählen Sie SOFORT den <strong>Notruf 112</strong>!
                    </Typography>
                </Alert>
            )}

            <Alert
                severity="warning"
                icon={<Warning fontSize="inherit" />}
                sx={{
                    mb: 4,
                    borderRadius: 2,
                    maxWidth: 800,
                    mx: 'auto',
                    border: '1px solid #ff9800',
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

            <Grid container spacing={3}>
                {/* Main Card */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 3, overflow: 'visible' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {/* Step 0: Symptom Selection */}
                            {activeStep === 0 && (
                                <Box sx={{ animation: 'fadeIn 0.5s' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Welche Symptome haben Sie?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Wählen Sie aus der Liste oder geben Sie eigene Symptome ein.
                                    </Typography>

                                    <Autocomplete
                                        multiple
                                        options={commonSymptoms}
                                        value={selectedSymptoms}
                                        onChange={(_, newValue) => setSelectedSymptoms(newValue)}
                                        freeSolo
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                    color="primary"
                                                    sx={{ borderRadius: 1.5 }}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Symptome"
                                                placeholder="Symptom eingeben oder auswählen..."
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <MedicalServices color="action" sx={{ mr: 1, ml: 1 }} />
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            disabled={selectedSymptoms.length === 0}
                                            endIcon={<ArrowForward />}
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
                                            Weiter
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {/* Step 1: Body Region & Severity */}
                            {activeStep === 1 && (
                                <Box sx={{ animation: 'fadeIn 0.5s' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Körperregion & Schweregrad
                                    </Typography>

                                    {/* Body Diagram Placeholder */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            mb: 3,
                                            bgcolor: 'grey.50',
                                            borderRadius: 2,
                                            textAlign: 'center',
                                            border: '2px dashed',
                                            borderColor: 'grey.300',
                                        }}
                                    >
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Körperdiagramm (Interaktiv - Platzhalter)
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
                                            {['Kopf', 'Hals', 'Brust', 'Bauch', 'Rücken', 'Arme', 'Beine'].map((region) => (
                                                <Chip
                                                    key={region}
                                                    label={region}
                                                    onClick={() => setBodyRegion(region)}
                                                    color={bodyRegion === region ? 'primary' : 'default'}
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            ))}
                                        </Box>
                                    </Paper>

                                    {/* Severity Slider */}
                                    <Typography gutterBottom sx={{ mb: 2 }}>
                                        Wie stark sind die Beschwerden?
                                    </Typography>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Box
                                            sx={{
                                                fontSize: 60,
                                                color: currentEmoji.color,
                                                transition: 'all 0.3s',
                                            }}
                                        >
                                            {currentEmoji.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ color: currentEmoji.color, fontWeight: 600 }}>
                                            {currentEmoji.label}
                                        </Typography>
                                    </Box>
                                    <Slider
                                        value={severity}
                                        onChange={(_, value) => setSeverity(value as number)}
                                        min={1}
                                        max={5}
                                        step={1}
                                        marks
                                        sx={{
                                            color: currentEmoji.color,
                                            '& .MuiSlider-thumb': {
                                                width: 24,
                                                height: 24,
                                            },
                                        }}
                                    />

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
                                            disabled={!bodyRegion}
                                            endIcon={<ArrowForward />}
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
                                            Weiter
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {/* Step 2: Details */}
                            {activeStep === 2 && (
                                <Box sx={{ animation: 'fadeIn 0.5s' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Details zur Dauer & Verlauf
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Seit wann haben Sie die Beschwerden?"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                placeholder="z.B. seit 2 Tagen, heute Morgen..."
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label="Zusätzliche Informationen"
                                                value={additionalInfo}
                                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                                placeholder="Gibt es Vorerkrankungen? Nehmen Sie Medikamente?"
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
                                            disabled={!duration}
                                            endIcon={loading ? null : <ArrowForward />}
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
                                            {loading ? 'Analysiere...' : 'Analyse starten'}
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {/* Step 3: Analysis Result */}
                            {activeStep === 3 && result && (
                                <Box sx={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                                    <Box sx={{ mb: 3 }}>
                                        <CheckCircle sx={{ fontSize: 60, color: '#4caf50' }} />
                                    </Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                        Analyse abgeschlossen
                                    </Typography>

                                    <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
                                            Ergebnis:
                                        </Typography>
                                        {result.result_message}
                                    </Alert>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                        Basierend auf Ihren Angaben empfehlen wir folgende Schritte:
                                    </Typography>

                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                startIcon={<MedicalServices />}
                                                onClick={() => window.location.href = '/appointments'}
                                            >
                                                Termin vereinbaren
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                onClick={handleReset}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                                    color: '#d63384',
                                                }}
                                            >
                                                Neue Prüfung
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar: History */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <History sx={{ mr: 1 }} /> Verlauf
                            </Typography>
                            {history.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    Noch keine Einträge vorhanden.
                                </Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {history.map((entry, index) => (
                                        <Paper key={index} elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                                {new Date(entry.date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="subtitle2" gutterBottom>
                                                {entry.symptoms.join(', ')}
                                            </Typography>
                                            <Chip
                                                label={severityEmojis.find(e => e.value === entry.severity)?.label}
                                                size="small"
                                                sx={{
                                                    bgcolor: severityEmojis.find(e => e.value === entry.severity)?.color + '20',
                                                    color: severityEmojis.find(e => e.value === entry.severity)?.color,
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
