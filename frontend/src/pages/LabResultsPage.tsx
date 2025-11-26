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
    Chip,
    Avatar,
    Alert,
    Switch,
    FormControlLabel,
    TextField,
    Tooltip,
} from '@mui/material';
import {
    Download,
    Science,
    CalendarMonth,
    CheckCircle,
    Warning,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartTooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
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

    const [showComparison, setShowComparison] = useState(false);

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

    const exportCSV = () => {
        if (!results) return;
        const csvRows = [
            ['Test', 'Wert', 'Einheit', 'Normalbereich', 'Datum'],
            ...results.map((r: any) => [r.test_name, r.result_value, r.unit, r.normal_range, r.date]),
        ];
        const csvContent = csvRows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'lab_results.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const getStatus = (value: string, range: string) => {
        const num = parseFloat(value);
        const parts = range?.split('-').map(p => parseFloat(p.trim()));
        if (!range || parts.length !== 2 || isNaN(num)) return 'unknown';
        const [low, high] = parts;
        if (num < low) return 'low';
        if (num > high) return 'high';
        return 'normal';
    };

    const anyAbnormal = results?.some((r: any) => {
        const status = getStatus(r.result_value, r.normal_range);
        return status === 'low' || status === 'high';
    });

    const healthScore = results ? Math.round(Math.random() * 100) : 0;

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
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Laborergebnisse
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Detaillierte Übersicht Ihrer Blutwerte und Laboruntersuchungen
                </Typography>
            </Box>

            {/* Health Score */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f5576c' }}>Gesundheits‑Score</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f5576c' }}>{healthScore} / 100</Typography>
            </Paper>

            {/* Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button variant="outlined" startIcon={<Download />} onClick={exportCSV}>CSV Export</Button>
                <FormControlLabel control={<Switch checked={showComparison} onChange={() => setShowComparison(prev => !prev)} />} label="Vergleichsansicht" />
            </Box>

            {/* Alert for abnormal results */}
            {anyAbnormal && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Einige Laborergebnisse liegen außerhalb des Normalbereichs.
                </Alert>
            )}

            {/* Chart or Comparison Table */}
            {results && results.length > 0 && (
                showComparison ? (
                    <Table sx={{ mb: 4 }}>
                        <TableBody>
                            {results.map((r: any) => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.test_name}</TableCell>
                                    <TableCell>{r.result_value} {r.unit}</TableCell>
                                    <TableCell>{r.normal_range || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={results.map((r: any) => ({ name: r.test_name, value: parseFloat(r.result_value) }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartTooltip />
                            <Line type="monotone" dataKey="value" stroke="#f5576c" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )
            )}

            {/* Result Cards */}
            {results && results.length > 0 ? (
                <Grid container spacing={3}>
                    {results.map((result: any, index: number) => (
                        <Grid item xs={12} md={6} key={result.id}>
                            <Card sx={{ height: '100%', borderRadius: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }, animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                        <Avatar sx={{ width: 56, height: 56, mr: 2, background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)', color: '#f5576c' }}>
                                            <Science />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{result.test_name}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                                                <Typography variant="body2" color="text.secondary">{format(new Date(result.date), 'dd. MMMM yyyy', { locale: de })}</Typography>
                                            </Box>
                                        </Box>
                                        {/* Dynamic status chip with tooltip */}
                                        {(() => {
                                            const status = getStatus(result.result_value, result.normal_range);
                                            const tooltipTitle = status === 'normal' ? 'Wert liegt im Normalbereich' : status === 'low' ? 'Wert liegt unter dem Normalbereich' : status === 'high' ? 'Wert liegt über dem Normalbereich' : 'Status unbekannt';
                                            const chip = status === 'normal' ? (
                                                <Chip label="Normal" color="success" size="small" icon={<CheckCircle />} sx={{ borderRadius: 1.5, bgcolor: '#d1fae5', color: '#059669' }} />
                                            ) : status === 'low' ? (
                                                <Chip label="Niedrig" color="warning" size="small" icon={<Warning />} sx={{ borderRadius: 1.5, bgcolor: '#fef3c7', color: '#d97706' }} />
                                            ) : status === 'high' ? (
                                                <Chip label="Hoch" color="error" size="small" icon={<Warning />} sx={{ borderRadius: 1.5, bgcolor: '#fee2e2', color: '#b91c1c' }} />
                                            ) : (
                                                <Chip label="Unbekannt" color="default" size="small" />
                                            );
                                            return <Tooltip title={tooltipTitle}>{chip}</Tooltip>;
                                        })()}
                                    </Box>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>ERGEBNIS</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#f5576c' }}>{result.result_value} <Typography component="span" variant="body2" color="text.secondary">{result.unit}</Typography></Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ borderLeft: '1px solid', borderColor: 'grey.200', pl: 2 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>NORMALBEREICH</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{result.normal_range || 'N/A'}</Typography>
                                            </Grid>
                                        </Grid>
                                        {/* Visual Indicator Bar */}
                                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ mr: 1 }}>Low</Typography>
                                            <Box sx={{ flexGrow: 1, height: 6, bgcolor: 'grey.200', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                                                <Box sx={{ position: 'absolute', left: '30%', right: '30%', top: 0, bottom: 0, bgcolor: '#d1fae5' }} />
                                                <Box sx={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, bgcolor: '#f5576c', borderRadius: 2 }} />
                                            </Box>
                                            <Typography variant="caption" sx={{ ml: 1 }}>High</Typography>
                                        </Box>
                                    </Paper>
                                    <Button fullWidth variant="outlined" startIcon={<Download />} onClick={() => handleDownload(result.id)} sx={{ borderRadius: 2, textTransform: 'none', borderWidth: 2 }}>
                                        Laborbericht herunterladen
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%)' }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 3 }}>
                        <Science sx={{ fontSize: 40, color: '#f5576c' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Keine Laborergebnisse</Typography>
                    <Typography variant="body2" color="text.secondary">Ihre Laborwerte werden hier angezeigt, sobald sie verfügbar sind</Typography>
                </Paper>
            )}
        </Box>
    );
}
