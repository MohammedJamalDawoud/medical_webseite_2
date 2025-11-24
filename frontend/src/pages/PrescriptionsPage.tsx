import { useQuery } from '@tanstack/react-query';
import { Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import apiClient from '../api/client';

export default function PrescriptionsPage() {
    const { data: prescriptions, isLoading } = useQuery({
        queryKey: ['prescriptions'],
        queryFn: async () => {
            const res = await apiClient.get('/prescriptions');
            return res.data;
        },
    });

    if (isLoading) return <Typography>Laden...</Typography>;

    return (
        <>
            <Typography variant="h4" gutterBottom>Meine Rezepte</Typography>
            <Grid container spacing={2}>
                {prescriptions?.map((prescription: any) => (
                    <Grid item xs={12} key={prescription.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Rezept von {prescription.doctor_name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(prescription.created_at).toLocaleDateString('de-DE')}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>{prescription.description}</Typography>
                                <Box sx={{ mt: 2 }}>
                                    {prescription.medications?.map((med: any) => (
                                        <Chip key={med.id} label={`${med.name} - ${med.dosage}`} sx={{ mr: 1, mb: 1 }} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
