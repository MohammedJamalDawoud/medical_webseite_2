import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Chip,
    Box,
    Avatar,
    InputAdornment,
    Paper,
    Divider,
    Stack,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Badge,
} from '@mui/material';
import {
    Search,
    LocationOn,
    MedicalServices,
    Star,
    Schedule,
    Clear,
    Person,
    Sort,
    FiberManualRecord,
    People,
} from '@mui/icons-material';
import apiClient from '../api/client';
import { useDebounce } from 'use-debounce';

export default function DoctorSearchPage() {
    const [filters, setFilters] = useState({ name: '', specialization: '', city: '' });
    const [searchParams, setSearchParams] = useState<{ name?: string; specialization?: string; city?: string }>({});
    const [sortBy, setSortBy] = useState('name');
    const [debouncedFilters] = useDebounce(filters, 500);

    // Auto-search with debounced filters
    useEffect(() => {
        setSearchParams(debouncedFilters);
    }, [debouncedFilters]);

    const { data: doctors, isLoading } = useQuery({
        queryKey: ['doctors', searchParams, sortBy],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.specialization) params.append('specialization', searchParams.specialization);
            if (searchParams.city) params.append('city', searchParams.city);
            const res = await apiClient.get(`/doctors?${params}`);

            // Client-side sorting
            let sorted = res.data;
            if (sortBy === 'rating') {
                sorted = [...sorted].sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
            } else if (sortBy === 'experience') {
                sorted = [...sorted].sort((a, b) => (b.years_of_experience || 10) - (a.years_of_experience || 10));
            } else if (sortBy === 'patients') {
                sorted = [...sorted].sort((a, b) => (b.total_patients || 100) - (a.total_patients || 100));
            }
            return sorted;
        },
    });

    const handleClear = () => {
        setFilters({ name: '', specialization: '', city: '' });
        setSearchParams({});
    };

    const getSpecialtyColor = (specialty: string) => {
        const colors: Record<string, string> = {
            'Allgemeinmedizin': '#4facfe',
            'Kardiologie': '#f093fb',
            'Dermatologie': '#43e97b',
            'Orthopädie': '#fa709a',
            'Neurologie': '#667eea',
            'Pädiatrie': '#feca57',
        };
        return colors[specialty] || '#667eea';
    };

    const isAvailableToday = () => {
        // Simulate availability (in real app, this would come from backend)
        return Math.random() > 0.5;
    };

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
                    Arzt finden
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Finden Sie den passenden Spezialisten für Ihre Bedürfnisse
                </Typography>
            </Box>

            {/* Search Filters */}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Arztname"
                            placeholder="z.B. Dr. Schmidt"
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Fachrichtung"
                            placeholder="z.B. Kardiologie"
                            value={filters.specialization}
                            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MedicalServices color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Stadt"
                            placeholder="z.B. Berlin"
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOn color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'white' } }}>
                            <InputLabel>Sortieren nach</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sortieren nach"
                                onChange={(e) => setSortBy(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Sort color="action" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="rating">Bewertung</MenuItem>
                                <MenuItem value="experience">Erfahrung</MenuItem>
                                <MenuItem value="patients">Patientenanzahl</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            onClick={handleClear}
                            startIcon={<Clear />}
                            sx={{
                                px: 3,
                                py: 1.2,
                                borderRadius: 2,
                                textTransform: 'none',
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 },
                            }}
                        >
                            Filter zurücksetzen
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : doctors && doctors.length > 0 ? (
                <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {doctors.length} Ärzte gefunden
                    </Typography>
                    <Grid container spacing={3}>
                        {doctors.map((doctor: any, index: number) => {
                            const available = isAvailableToday();
                            return (
                                <Grid item xs={12} md={6} key={doctor.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                                            },
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                            '@keyframes fadeInUp': {
                                                from: {
                                                    opacity: 0,
                                                    transform: 'translateY(20px)',
                                                },
                                                to: {
                                                    opacity: 1,
                                                    transform: 'translateY(0)',
                                                },
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Doctor Header */}
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                <Badge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    badgeContent={
                                                        available ? (
                                                            <FiberManualRecord
                                                                sx={{
                                                                    fontSize: 16,
                                                                    color: '#43e97b',
                                                                    filter: 'drop-shadow(0 0 4px rgba(67, 233, 123, 0.6))',
                                                                }}
                                                            />
                                                        ) : null
                                                    }
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 64,
                                                            height: 64,
                                                            mr: 2,
                                                            background: `linear-gradient(135deg, ${getSpecialtyColor(doctor.specialization)}40 0%, ${getSpecialtyColor(doctor.specialization)} 100%)`,
                                                            fontSize: '1.5rem',
                                                            fontWeight: 600,
                                                            color: getSpecialtyColor(doctor.specialization),
                                                        }}
                                                    >
                                                        {doctor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                                    </Avatar>
                                                </Badge>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {doctor.name}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={doctor.specialization}
                                                            size="small"
                                                            sx={{
                                                                background: `${getSpecialtyColor(doctor.specialization)}20`,
                                                                color: getSpecialtyColor(doctor.specialization),
                                                                fontWeight: 600,
                                                                borderRadius: 1.5,
                                                            }}
                                                        />
                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                            <Star sx={{ fontSize: 16, color: '#feca57', mr: 0.5 }} />
                                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                {doctor.rating || '4.8'}
                                                            </Typography>
                                                        </Box>
                                                        {available && (
                                                            <Chip
                                                                label="Heute verfügbar"
                                                                size="small"
                                                                sx={{
                                                                    background: '#43e97b20',
                                                                    color: '#43e97b',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.7rem',
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            {/* Doctor Info */}
                                            <Stack spacing={1.5}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {doctor.city} • {doctor.clinic_address?.split(',')[0] || 'Klinik'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Schedule sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {doctor.years_of_experience || '10'}+ Jahre Erfahrung
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <People sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {doctor.total_patients || '500'}+ Patienten
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mt: 2,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {doctor.description}
                                            </Typography>

                                            {/* Action Button */}
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                sx={{
                                                    mt: 3,
                                                    py: 1.2,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    background: `linear-gradient(135deg, ${getSpecialtyColor(doctor.specialization)} 0%, ${getSpecialtyColor(doctor.specialization)}CC 100%)`,
                                                    '&:hover': {
                                                        background: `linear-gradient(135deg, ${getSpecialtyColor(doctor.specialization)}CC 0%, ${getSpecialtyColor(doctor.specialization)} 100%)`,
                                                    },
                                                }}
                                            >
                                                Termin buchen
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </>
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
                        <MedicalServices sx={{ fontSize: 40, color: '#667eea' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Keine Ärzte gefunden
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Versuchen Sie andere Suchkriterien oder lassen Sie die Filter leer, um alle Ärzte anzuzeigen
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
