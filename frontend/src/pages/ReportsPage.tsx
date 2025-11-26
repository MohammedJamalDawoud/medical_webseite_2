import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    Download,
    Description,
    Person,
    CalendarMonth,
    Share,
    Print,
    Visibility,
    Science,
    Image,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import apiClient from '../api/client';

export default function ReportsPage() {
    const { data: reports, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: async () => {
            const res = await apiClient.get('/reports');
            return res.data;
        },
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null,
    });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewReport, setPreviewReport] = useState<any>(null);

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

    const openPreview = (report: any) => {
        setPreviewReport(report);
        setPreviewOpen(true);
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setPreviewReport(null);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    const filteredReports = reports
        ? reports.filter((r: any) => {
            const matchesCategory =
                selectedCategories.length === 0 || selectedCategories.includes(r.category?.toLowerCase());
            const matchesDate =
                (!dateRange.start || new Date(r.created_at) >= dateRange.start) &&
                (!dateRange.end || new Date(r.created_at) <= dateRange.end);
            return matchesCategory && matchesDate;
        })
        : [];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                {['lab', 'consultation', 'imaging'].map((cat) => (
                    <Chip
                        key={cat}
                        label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                        clickable
                        color={selectedCategories.includes(cat) ? 'primary' : 'default'}
                        onClick={() => {
                            setSelectedCategories((prev) =>
                                prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                            );
                        }}
                    />
                ))}
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
                    <DatePicker
                        label="Startdatum"
                        value={dateRange.start}
                        onChange={(newValue: Date | null) => setDateRange((prev) => ({ ...prev, start: newValue }))}
                        slotProps={{ textField: { size: 'small' } }}
                    />
                    <DatePicker
                        label="Enddatum"
                        value={dateRange.end}
                        onChange={(newValue: Date | null) => setDateRange((prev) => ({ ...prev, end: newValue }))}
                        slotProps={{ textField: { size: 'small' } }}
                    />
                </LocalizationProvider>
            </Box>
            {filteredReports && filteredReports.length > 0 ? (
                <Grid container spacing={3}>
                    {filteredReports.map((report: any, index: number) => (
                        <Grid item xs={12} key={report.id}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' },
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Avatar
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    bgcolor: 'primary.light',
                                                    background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                                                }}
                                            >
                                                {report.category === 'lab' && <Science sx={{ fontSize: 32, color: '#fff' }} />}
                                                {report.category === 'consultation' && <Person sx={{ fontSize: 32, color: '#fff' }} />}
                                                {report.category === 'imaging' && <Image sx={{ fontSize: 32, color: '#fff' }} />}
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {report.title}
                                                    </Typography>
                                                    {report.status === 'new' && <Chip label="Neu" color="primary" size="small" />}
                                                    {report.status === 'read' && <Chip label="Gelesen" color="default" size="small" />}
                                                </Box>
                                                <Stack direction="row" spacing={1} alignItems="center">
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
                                                <Divider sx={{ my: 2 }} />
                                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                                    {report.content}
                                                </Typography>
                                            </Box>
                                        </Grid>
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
                                                    onClick={() => openPreview(report)}
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
                                                        href={`mailto:?subject=${encodeURIComponent(report.title)}&body=${encodeURIComponent('Bitte prüfen Sie den Bericht hier: ' + window.location.origin + '/reports/' + report.id)}`}
                                                    >
                                                        Teilen
                                                    </Button>
                                                    <Button
                                                        variant="text"
                                                        startIcon={<Print />}
                                                        onClick={() => handleDownload(report.id)}
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
                            background: 'linear-gradient(135deg, #667ea20 0%, #764ba220 100%)',
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
            <Dialog open={previewOpen} onClose={closePreview} maxWidth="md" fullWidth>
                <DialogTitle>{previewReport?.title}</DialogTitle>
                <DialogContent dividers>
                    <iframe
                        src={previewReport ? `/reports/${previewReport.id}/preview` : ''}
                        style={{ width: '100%', height: '500px', border: 'none' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePreview} color="primary">
                        Schließen
                    </Button>
                    <Button onClick={() => handleDownload(previewReport.id)} startIcon={<Print />} color="primary">
                        Drucken
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
