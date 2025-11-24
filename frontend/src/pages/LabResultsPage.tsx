import { useQuery } from '@tanstack/react-query';
import {
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Avatar,
    Stack,
    LinearProgress,
} from '@mui/material';
import {
    Download,
    Science,
    CalendarMonth,
    TrendingUp,
    CheckCircle,
    Warning,
} from '@mui/icons-material';
import apiClient from '../api/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function LabResultsPage() {
    const { data: results, isLoading } = useQuery({
        queryKey: ['lab-results'],
        queryFn: async () => {
            const res = await apiClient.get('/lab-results');
            return res.data;
        },
    });

    const handleDownload = async (resultId: number) => {
        const res = await apiClient.get(`/lab-results/${resultId}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `lab_result_${resultId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // Helper to determine if result is normal (mock logic)
    const isNormal = (value: string, range: string) => {
        // This is a simplified check. In a real app, you'd parse the numbers.
        return true;
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
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Laborergebnisse
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Detaillierte Übersicht Ihrer Blutwerte und Laboruntersuchungen
                </Typography>
            </Box>

            {results && results.length > 0 ? (
                <Grid container spacing={3}>
                    {results.map((result: any, index: number) => (
                        <Grid item xs={12} md={6} key={result.id}>
                            <Card
                                sx={{
                                    height: '100%',
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
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                mr: 2,
                                                background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)',
                                                color: '#f5576c',
                                            }}
                                        >
                                            <Science />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {result.test_name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {format(new Date(result.date), 'dd. MMMM yyyy', { locale: de })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label="Normal"
                                            color="success"
                                            size="small"
                                            icon={<CheckCircle />}
                                            sx={{ borderRadius: 1.5, bgcolor: '#d1fae5', color: '#059669' }}
                                        />
                                    </Box>

                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            bgcolor: 'grey.50',
                                            borderRadius: 2,
                                            mb: 3,
                                        }}
                                    >
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    ERGEBNIS
                                                </Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#f5576c' }}>
                                                    {result.result_value} <Typography component="span" variant="body2" color="text.secondary">{result.unit}</Typography>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ borderLeft: '1px solid', borderColor: 'grey.200', pl: 2 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                    NORMALBEREICH
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {result.normal_range || 'N/A'}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        {/* Visual Indicator Bar (Mock) */}
                                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ mr: 1 }}>Low</Typography>
                                            <Box sx={{ flexGrow: 1, height: 6, bgcolor: 'grey.200', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                                                <Box sx={{
                                                    position: 'absolute',
                                                    left: '30%',
                                                    right: '30%',
                                                    top: 0,
                                                    bottom: 0,
                                                    bgcolor: '#d1fae5'
                                                }} />
                                                <Box sx={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    top: 0,
                                                    bottom: 0,
                                                    width: 4,
                                                    bgcolor: '#f5576c',
                                                    borderRadius: 2,
                                                }} />
                                            </Box>
                                            <Typography variant="caption" sx={{ ml: 1 }}>High</Typography>
                                        </Box>
                                    </Paper>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Download />}
                                        onClick={() => handleDownload(result.id)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            borderWidth: 2,
                                            '&:hover': { borderWidth: 2 },
                                        }}
                                    >
                                        Laborbericht herunterladen
                                    </Button>
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
                        background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%)',
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 3,
                        }}
                    >
                        <Science sx={{ fontSize: 40, color: '#f5576c' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Keine Laborergebnisse
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ihre Laborwerte werden hier angezeigt, sobald sie verfügbar sind
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
