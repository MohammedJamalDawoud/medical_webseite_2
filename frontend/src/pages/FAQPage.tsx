import { useState } from 'react';
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
    Container,
    Grid,
    CircularProgress,
} from '@mui/material';
import {
    ExpandMore,
    Search,
    HelpOutline,
    ContactSupport,
    QuestionAnswer,
} from '@mui/icons-material';
import apiClient from '../api/client';

export default function FAQPage() {
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | false>(false);

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

    const filteredFaqs = faqs?.filter((faq: any) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
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
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4, fontWeight: 400 }}>
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

            <Grid container spacing={4}>
                {/* FAQ List */}
                <Grid item xs={12} md={8}>
                    {filteredFaqs && filteredFaqs.length > 0 ? (
                        <Box>
                            {filteredFaqs.map((faq: any, index: number) => (
                                <Accordion
                                    key={faq.id}
                                    expanded={expanded === `panel${faq.id}`}
                                    onChange={handleChange(`panel${faq.id}`)}
                                    sx={{
                                        mb: 2,
                                        borderRadius: '12px !important',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        '&:before': { display: 'none' },
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
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
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                                }}
                                            >
                                                {faq.question}
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 3, bgcolor: 'rgba(102, 126, 234, 0.02)' }}>
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
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
                                Versuchen Sie es mit einem anderen Suchbegriff
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
