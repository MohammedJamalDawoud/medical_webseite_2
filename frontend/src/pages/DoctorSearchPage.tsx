import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography, Grid, Card, CardContent, TextField, Button, Chip, Box } from '@mui/material';
import apiClient from '../api/client';

export default function DoctorSearchPage() {
    const [filters, setFilters] = useState({ name: '', specialization: '', city: '' });
    const [searchParams, setSearchParams] = useState({});

    const { data: doctors, isLoading } = useQuery({
        queryKey: ['doctors', searchParams],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.specialization) params.append('specialization', searchParams.specialization);
            if (searchParams.city) params.append('city', searchParams.city);
            const res = await apiClient.get(`/doctors?${params}`);
            return res.data;
        },
    });

    const handleSearch = () => setSearchParams(filters);

    return (
        <>
            <Typography variant="h4" gutterBottom>Arzt finden</Typography>

            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Fachrichtung" value={filters.specialization} onChange={(e) => setFilters({ ...filters, specialization: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Stadt" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>Suchen</Button>
            </Box>

            {isLoading ? <Typography>Laden...</Typography> : (
                <Grid container spacing={2}>
                    {doctors?.map((doctor: any) => (
                        <Grid item xs={12} md={6} key={doctor.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{doctor.name}</Typography>
                                    <Chip label={doctor.specialization} size="small" sx={{ mt: 1 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{doctor.city}</Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>{doctor.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
}
