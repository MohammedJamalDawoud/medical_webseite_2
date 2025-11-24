import { useQuery } from '@tanstack/react-query';
import { Typography, Card, CardContent, Grid, Button, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { Download } from '@mui/icons-material';
import apiClient from '../api/client';

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

    if (isLoading) return <Typography>Laden...</Typography>;

    return (
        <>
            <Typography variant="h4" gutterBottom>Laborergebnisse</Typography>
            <Grid container spacing={2}>
                {results?.map((result: any) => (
                    <Grid item xs={12} md={6} key={result.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{result.test_name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(result.date).toLocaleDateString('de-DE')}
                                </Typography>
                                <Table size="small" sx={{ mt: 2 }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Wert:</TableCell>
                                            <TableCell>{result.result_value} {result.unit}</TableCell>
                                        </TableRow>
                                        {result.normal_range && (
                                            <TableRow>
                                                <TableCell>Normalbereich:</TableCell>
                                                <TableCell>{result.normal_range}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <Button startIcon={<Download />} onClick={() => handleDownload(result.id)} sx={{ mt: 2 }}>
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
