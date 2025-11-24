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
    Stack,
    Avatar,
    Chip,
    Divider,
} from '@mui/material';
import {
    Download,
    Description,
    Person,
    CalendarMonth,
    Share,
    Print,
    Visibility,
} from '@mui/icons-material';
import apiClient from '../api/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function ReportsPage() {
    const { data: reports, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: async () => {
            const res = await apiClient.get('/reports');
            return res.data;
        },
    });

    const handleDownload = async (reportId: number) => {
        const res = await apiClient.get(`/reports/${reportId}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report_${reportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
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
                    Arztberichte
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Ihre medizinischen Befunde und Arztbriefe
                </Typography>
            </Box>

            {reports && reports.length > 0 ? (
                <Grid container spacing={3}>
                    {reports.map((report: any, index: number) => (
                        <Grid item xs={12} key={report.id}>
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
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Grid container spacing={3}>
                                        {/* Icon Section */}
                                        <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                                            <Avatar
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    bgcolor: 'primary.light',
                                                    color: 'primary.main',
                                                    background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                                                }}
                                            >
                                                <Description sx={{ fontSize: 32, color: '#fff' }} />
                                            </Avatar>
                                        </Grid>

                                        {/* Content Section */}
                                        <Grid item xs={12} md={8}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {report.title}
                                                </Typography>
                                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                                    <Chip
                                                        icon={<Person sx={{ fontSize: '16px !important' }} />}
                                                        label={`Dr. ${report.doctor_name}`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ borderRadius: 1.5 }}
                                                    />
                                                    <Chip
                                                        icon={<CalendarMonth sx={{ fontSize: '16px !important' }} />}
                                                        label={format(new Date(report.created_at), 'dd. MMMM yyyy', { locale: de })}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ borderRadius: 1.5 }}
                                                    />
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                                    {report.content}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Actions Section */}
                                        <Grid item xs={12} md={3}>
                                            <Stack spacing={1.5} justifyContent="center" height="100%">
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Download />}
                                                    onClick={() => handleDownload(report.id)}
                                                    fullWidth
                                                    sx={{
                                                        borderRadius: 2,
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    PDF herunterladen
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Visibility />}
                                                    fullWidth
                                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                                >
                                                    Vorschau
                                                </Button>
                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        variant="text"
                                                        startIcon={<Share />}
                                                        fullWidth
                                                        sx={{ borderRadius: 2, textTransform: 'none', color: 'text.secondary' }}
                                                    >
                                                        Teilen
                                                    </Button>
                                                    <Button
                                                        variant="text"
                                                        startIcon={<Print />}
                                                        fullWidth
                                                        sx={{ borderRadius: 2, textTransform: 'none', color: 'text.secondary' }}
                                                    >
                                                        Drucken
                                                    </Button>
                                                </Stack>
                                            </Stack>
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
                        <Description sx={{ fontSize: 40, color: '#667eea' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Keine Berichte vorhanden
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sobald Ihr Arzt einen Bericht erstellt, erscheint er hier
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
