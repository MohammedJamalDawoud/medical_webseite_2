import { useQuery } from '@tanstack/react-query';
import { Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import apiClient from '../api/client';

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

    if (isLoading) return <Typography>Laden...</Typography>;

    return (
        <>
            <Typography variant="h4" gutterBottom>Arztberichte</Typography>
            <Grid container spacing={2}>
                {reports?.map((report: any) => (
                    <Grid item xs={12} key={report.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{report.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Dr. {report.doctor_name} - {new Date(report.created_at).toLocaleDateString('de-DE')}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-line' }}>{report.content}</Typography>
                                <Button startIcon={<Download />} onClick={() => handleDownload(report.id)} sx={{ mt: 2 }}>
                                    PDF herunterladen
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
