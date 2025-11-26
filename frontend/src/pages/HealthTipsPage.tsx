import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Typography,
    Tabs,
    Tab,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
    CardActions,
    Button,
    CircularProgress,
    Paper,
    Avatar,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Share,
    FitnessCenter,
    Restaurant,
    LocalHospital,
    Spa,
    ArrowForward,
    TipsAndUpdates,
    Search,
    AccessTime,
    Facebook,
    Twitter,
    LinkedIn,
    Email,
} from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import apiClient from '../api/client';

export default function HealthTipsPage() {
    const [category, setCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 300);
    const [bookmarkedTips, setBookmarkedTips] = useState<Set<number>>(new Set());
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedTip, setSelectedTip] = useState<any>(null);

    const { data: tips, isLoading } = useQuery({
        queryKey: ['health-tips', category],
        queryFn: async () => {
            const params = category ? `?category=${category}` : '';
            const res = await apiClient.get(`/content/health-tips${params}`);
            return res.data;
        },
    });

    const filteredTips = useMemo(() => {
        if (!tips) return [];
        if (!debouncedSearch) return tips;

        const query = debouncedSearch.toLowerCase();
        return tips.filter((tip: any) =>
            tip.title.toLowerCase().includes(query) ||
            tip.content.toLowerCase().includes(query)
        );
    }, [tips, debouncedSearch]);

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    const toggleBookmark = (tipId: number) => {
        setBookmarkedTips(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tipId)) {
                newSet.delete(tipId);
            } else {
                newSet.add(tipId);
            }
            return newSet;
        });
    };

    const handleShare = (tip: any) => {
        setSelectedTip(tip);
        setShareDialogOpen(true);
    };

    const getCategoryIcon = (cat: string) => {
        const icons: Record<string, JSX.Element> = {
            'bewegung': <FitnessCenter />,
            'ernährung': <Restaurant />,
            'prävention': <LocalHospital />,
            'mental': <Spa />,
        };
        return icons[cat.toLowerCase()] || <TipsAndUpdates />;
    };

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = {
            'bewegung': '#4facfe',
            'ernährung': '#43e97b',
            'prävention': '#fa709a',
            'mental': '#a18cd1',
        };
        return colors[cat.toLowerCase()] || '#667eea';
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
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Gesundheitstipps
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Expertenrat für ein gesünderes Leben
                </Typography>
            </Box>

            {/* Search Bar */}
            <TextField
                fullWidth
                placeholder="Tipps durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Category Tabs */}
            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    bgcolor: 'transparent',
                }}
            >
                <Tabs
                    value={category}
                    onChange={(_, v) => setCategory(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: 1.5,
                            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            mr: 2,
                            '&.Mui-selected': {
                                color: '#4facfe',
                            },
                        },
                    }}
                >
                    <Tab label="Alle Tipps" value="" />
                    <Tab icon={<FitnessCenter fontSize="small" />} iconPosition="start" label="Bewegung" value="bewegung" />
                    <Tab icon={<Restaurant fontSize="small" />} iconPosition="start" label="Ernährung" value="ernährung" />
                    <Tab icon={<LocalHospital fontSize="small" />} iconPosition="start" label="Prävention" value="prävention" />
                </Tabs>
            </Paper>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} thickness={4} />
                </Box>
            ) : filteredTips && filteredTips.length > 0 ? (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                        gridAutoRows: 'auto',
                    }}
                >
                    {filteredTips.map((tip: any, index: number) => (
                        <Card
                            key={tip.id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                borderLeft: `4px solid ${getCategoryColor(tip.category)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                },
                                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                                '@keyframes fadeInUp': {
                                    from: { opacity: 0, transform: 'translateY(20px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    height: 140,
                                    background: `linear-gradient(135deg, ${getCategoryColor(tip.category)}40 0%, ${getCategoryColor(tip.category)}10 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.2)',
                                    }}
                                />
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'white',
                                        color: getCategoryColor(tip.category),
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    {getCategoryIcon(tip.category)}
                                </Avatar>
                                <Chip
                                    label={tip.category}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(4px)',
                                        fontWeight: 600,
                                        color: getCategoryColor(tip.category),
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => toggleBookmark(tip.id)}
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 16,
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(4px)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                                    }}
                                >
                                    {bookmarkedTips.has(tip.id) ? (
                                        <Favorite sx={{ color: '#ef4444', fontSize: 20 }} />
                                    ) : (
                                        <FavoriteBorder sx={{ color: 'text.secondary', fontSize: 20 }} />
                                    )}
                                </IconButton>
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                                    {tip.title}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {calculateReadingTime(tip.content)} Min. Lesezeit
                                    </Typography>
                                </Stack>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {tip.content}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                                <IconButton
                                    size="small"
                                    onClick={() => handleShare(tip)}
                                    sx={{ color: 'text.secondary', '&:hover': { color: '#4facfe' } }}
                                >
                                    <Share fontSize="small" />
                                </IconButton>
                                <Button
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        textTransform: 'none',
                                        color: getCategoryColor(tip.category),
                                        fontWeight: 600,
                                    }}
                                >
                                    Mehr lesen
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%)',
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4facfe20 0%, #00f2fe20 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 3,
                        }}
                    >
                        <TipsAndUpdates sx={{ fontSize: 40, color: '#4facfe' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Keine Tipps gefunden
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {searchQuery ? 'Versuchen Sie eine andere Suchanfrage' : 'Wählen Sie eine andere Kategorie oder schauen Sie später wieder vorbei'}
                    </Typography>
                </Paper>
            )}

            {/* Share Dialog */}
            <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Tipp teilen</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Teilen Sie "{selectedTip?.title}" mit Ihren Freunden
                    </Typography>
                    <Stack spacing={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Facebook />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        >
                            Auf Facebook teilen
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Twitter />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        >
                            Auf Twitter teilen
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<LinkedIn />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        >
                            Auf LinkedIn teilen
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Email />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                            href={`mailto:?subject=${encodeURIComponent(selectedTip?.title || '')}&body=${encodeURIComponent('Schau dir diesen Gesundheitstipp an: ' + selectedTip?.title)}`}
                        >
                            Per E-Mail teilen
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialogOpen(false)}>Schließen</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
