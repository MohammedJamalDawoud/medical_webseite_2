import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography, Tabs, Tab, Box, Card, CardContent, Grid } from '@mui/material';
import apiClient from '../api/client';

export default function HealthTipsPage() {
    const [category, setCategory] = useState('');

    const { data: tips, isLoading } = useQuery({
        queryKey: ['health-tips', category],
        queryFn: async () => {
            const params = category ? `?category=${category}` : '';
            const res = await apiClient.get(`/content/health-tips${params}`);
            return res.data;
        },
    });

    return (
        <>
            <Typography variant="h4" gutterBottom>Gesundheitstipps</Typography>
            <Tabs value={category} onChange={(_, v) => setCategory(v)} sx={{ mb: 3 }}>
                <Tab label="Alle" value="" />
                <Tab label="Bewegung & Sport" value="bewegung" />
                <Tab label="Ernährung" value="ernährung" />
                <Tab label="Prävention" value="prävention" />
            </Tabs>

            {isLoading ? <Typography>Laden...</Typography> : (
                <Grid container spacing={2}>
                    {tips?.map((tip: any) => (
                        <Grid item xs={12} md={6} key={tip.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{tip.title}</Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>{tip.content}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
}
