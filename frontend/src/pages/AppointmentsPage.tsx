import { useQuery } from '@tanstack/react-query';
import { Typography, Card, CardContent, Chip, Grid } from '@mui/material';
import apiClient from '../api/client';

export default function AppointmentsPage() {
    const { data: appointments, isLoading } = useQuery({
        queryKey: ['appointments'],
        queryFn: async () => {
            const res = await apiClient.get('/appointments');
            return res.data;
        },
    });

    if (isLoading) return <Typography>Laden...</Typography>;

    return (
        <>
            <Typography variant="h4" gutterBottom>Meine Termine</Typography>
            <Grid container spacing={2}>
                {appointments?.map((apt: any) => (
                    <Grid item xs={12} md={6} key={apt.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{apt.doctor_name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(apt.date).toLocaleDateString('de-DE')} um {apt.time}
                                </Typography>
                                <Chip label={apt.status} size="small" sx={{ mt: 1 }} />
                                <Chip label={apt.type} size="small" sx={{ mt: 1, ml: 1 }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
