import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    TextField,
    InputAdornment,
    Paper,
    Grid,
    CircularProgress,
    Tabs,
    Tab,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Badge,
} from '@mui/material';
import {
    ExpandMore,
    Search,
    HelpOutline,
    ContactSupport,
    ThumbUp,
    ThumbDown,
    TrendingUp,
    Info,
    Payment,
    Build,
    LocalHospital,
} from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import apiClient from '../api/client';

// Mock data for popular questions and feedback
const mockPopularIds = [1, 2, 3]; // IDs of popular questions
const mockFeedback: Record<number, 'up' | 'down' | null> = {};

export default function FAQPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 300);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [category, setCategory] = useState('');
    const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>(mockFeedback);

    const { data: faqs, isLoading } = useQuery({
        queryKey: ['faq'],
        queryFn: async () => {
            const res = await apiClient.get('/content/faq');
            return res.data;
        },
    });

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleFeedback = (faqId: number, type: 'up' | 'down') => {
        setFeedback(prev => ({
            ...prev,
            [faqId]: prev[faqId] === type ? null : type,
        }));
    };

    const getRelatedQuestions = (currentFaq: any) => {
        if (!faqs) return [];
        // Simple keyword matching for related questions
        const keywords = currentFaq.question.toLowerCase().split(' ').filter((w: string) => w.length > 4);
        return faqs
            .filter((faq: any) => faq.id !== currentFaq.id)
            .filter((faq: any) =>
                keywords.some((keyword: string) =>
                    faq.question.toLowerCase().includes(keyword) ||
                    faq.answer.toLowerCase().includes(keyword)
                )
            )
            .slice(0, 3);
    };

    const filteredFaqs = useMemo(() => {
        if (!faqs) return [];

        let filtered = faqs;

        // Filter by category
        if (category) {
            filtered = filtered.filter((faq: any) => faq.category?.toLowerCase() === category.toLowerCase());
        }

        // Filter by search
        if (debouncedSearch) {
            const query = debouncedSearch.toLowerCase();
            filtered = filtered.filter((faq: any) =>
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [faqs, category, debouncedSearch]);

    const getCategoryIcon = (cat: string) => {
        const icons: Record<string, JSX.Element> = {
            'general': <Info />,
            'billing': <Payment />,
            'technical': <Build />,
            'clinical': <LocalHospital />,
        };
        return icons[cat.toLowerCase()] || <HelpOutline />;
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Sticky Header Section */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: 'background.default',
                    pb: 2,
                    pt: 2,
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
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
                        Häufig gestellte Fragen
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3, fontWeight: 400 }}>
                        Hier finden Sie Antworten auf die wichtigsten Fragen rund um unser Telemedizin-Portal
                    </Typography>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 1,
                            maxWidth: 600,
                            mx: 'auto',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Wonach suchen Sie?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" sx={{ ml: 1 }} />
                                    </InputAdornment>
                                ),
                                disableUnderline: true,
                            }}
                            variant="standard"
                            sx={{ px: 2 }}
                        />
                    </Paper>
                </Box>

                {/* Category Tabs */}
                <Paper elevation={0} sx={{ bgcolor: 'transparent', mb: 2 }}>
                    <Tabs
                        value={category}
                        onChange={(_, v) => setCategory(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        centered
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: 1.5,
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                mr: 2,
                                '&.Mui-selected': {
                                    color: '#667eea',
                                },
                            },
                        }}
                    >
                        <Tab label="Alle" value="" />
                        <Tab icon={<Info fontSize="small" />} iconPosition="start" label="Allgemein" value="general" />
                        <Tab icon={<Payment fontSize="small" />} iconPosition="start" label="Abrechnung" value="billing" />
                        <Tab icon={<Build fontSize="small" />} iconPosition="start" label="Technisch" value="technical" />
                        <Tab icon={<LocalHospital fontSize="small" />} iconPosition="start" label="Medizinisch" value="clinical" />
                    </Tabs>
                </Paper>
            </Box>

            <Grid container spacing={4}>
                {/* FAQ List */}
                <Grid item xs={12} md={8}>
                    {filteredFaqs && filteredFaqs.length > 0 ? (
                        <Box>
                            {filteredFaqs.map((faq: any, index: number) => {
                                const isPopular = mockPopularIds.includes(faq.id);
                                const relatedQuestions = getRelatedQuestions(faq);

                                return (
                                    <Accordion
                                        key={faq.id}
                                        expanded={expanded === `panel${faq.id}`}
                                        onChange={handleChange(`panel${faq.id}`)}
                                        sx={{
                                            mb: 2,
                                            borderRadius: '12px !important',
                                            boxShadow: isPopular ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
                                            '&:before': { display: 'none' },
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            border: isPopular ? '2px solid rgba(102, 126, 234, 0.3)' : 'none',
                                            '&.Mui-expanded': {
                                                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
                                            sx={{
                                                bgcolor: expanded === `panel${faq.id}` ? 'rgba(102, 126, 234, 0.05)' : 'white',
                                                minHeight: 64,
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <HelpOutline
                                                    sx={{
                                                        mr: 2,
                                                        color: expanded === `panel${faq.id}` ? 'primary.main' : 'text.disabled',
                                                        transition: 'color 0.3s',
                                                    }}
                                                />
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: expanded === `panel${faq.id}` ? 'primary.main' : 'text.primary',
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    {faq.question}
                                                </Typography>
                                                {isPopular && (
                                                    <Chip
                                                        icon={<TrendingUp />}
                                                        label="Beliebt"
                                                        size="small"
                                                        color="primary"
                                                        sx={{ ml: 2, mr: 2 }}
                                                    />
                                                )}
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ p: 3, bgcolor: 'rgba(102, 126, 234, 0.02)' }}>
                                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                                                {faq.answer}
                                            </Typography>

                                            {/* Feedback Section */}
                                            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mb: relatedQuestions.length > 0 ? 2 : 0 }}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Typography variant="body2" color="text.secondary">
                                                        War das hilfreich?
                                                    </Typography>
                                                    <Tooltip title="Hilfreich">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleFeedback(faq.id, 'up')}
                                                            sx={{
                                                                color: feedback[faq.id] === 'up' ? 'success.main' : 'text.secondary',
                                                                '&:hover': { bgcolor: 'success.light', color: 'success.main' },
                                                            }}
                                                        >
                                                            <ThumbUp fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Nicht hilfreich">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleFeedback(faq.id, 'down')}
                                                            sx={{
                                                                color: feedback[faq.id] === 'down' ? 'error.main' : 'text.secondary',
                                                                '&:hover': { bgcolor: 'error.light', color: 'error.main' },
                                                            }}
                                                        >
                                                            <ThumbDown fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Box>

                                            {/* Related Questions */}
                                            {relatedQuestions.length > 0 && (
                                                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                                        Ähnliche Fragen:
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {relatedQuestions.map((related: any) => (
                                                            <Box
                                                                key={related.id}
                                                                onClick={() => {
                                                                    setExpanded(`panel${related.id}`);
                                                                    // Scroll to the related question
                                                                    setTimeout(() => {
                                                                        document.getElementById(`panel${related.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                    }, 100);
                                                                }}
                                                                sx={{
                                                                    p: 1.5,
                                                                    borderRadius: 1,
                                                                    bgcolor: 'background.paper',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s',
                                                                    '&:hover': {
                                                                        bgcolor: 'primary.light',
                                                                        transform: 'translateX(4px)',
                                                                    },
                                                                }}
                                                            >
                                                                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                                                                    → {related.question}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </Box>
                    ) : (
                        <Paper
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                borderRadius: 3,
                                bgcolor: 'grey.50',
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Keine Ergebnisse gefunden
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Versuchen Sie es mit einem anderen Suchbegriff oder wählen Sie eine andere Kategorie
                            </Typography>
                        </Paper>
                    )}
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            textAlign: 'center',
                            position: 'sticky',
                            top: 100,
                        }}
                    >
                        <ContactSupport sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                            Noch Fragen?
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
                            Können Sie die Antwort, die Sie suchen, nicht finden? Kontaktieren Sie unser Support-Team.
                        </Typography>
                        <Box
                            component="a"
                            href="mailto:support@telemedizin.de"
                            sx={{
                                display: 'inline-block',
                                bgcolor: 'white',
                                color: 'primary.main',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            Kontaktieren
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
