import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider,
    IconButton,
    CircularProgress,
} from '@mui/material';
import {
    Search,
    Close,
    Person,
    FitnessCenter,
    Help,
    ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useDebounce } from 'use-debounce';

interface GlobalSearchProps {
    open: boolean;
    onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 500);
    const navigate = useNavigate();

    const { data: results, isLoading } = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: async () => {
            if (debouncedQuery.length < 3) return null;
            const res = await apiClient.get(`/search/?q=${debouncedQuery}`);
            return res.data;
        },
        enabled: debouncedQuery.length >= 3,
    });

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    position: 'fixed',
                    top: 50,
                    m: 0,
                    maxHeight: '80vh',
                },
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <Search sx={{ color: 'text.disabled', mr: 2 }} />
                <InputBase
                    placeholder="Suchen Sie nach Ärzten, Tipps, Fragen..."
                    fullWidth
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{ fontSize: '1.1rem' }}
                />
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0, minHeight: 100 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : results ? (
                    <List>
                        {results.doctors?.length > 0 && (
                            <>
                                <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', bgcolor: 'grey.50', fontWeight: 600 }}>
                                    Ärzte
                                </Typography>
                                {results.doctors.map((doc: any) => (
                                    <ListItem key={doc.id} disablePadding>
                                        <ListItemButton onClick={() => handleNavigate('/doctors')}>
                                            <ListItemIcon><Person color="primary" /></ListItemIcon>
                                            <ListItemText primary={doc.name} secondary={doc.specialty} />
                                            <ArrowForward fontSize="small" color="action" />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </>
                        )}

                        {results.health_tips?.length > 0 && (
                            <>
                                <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', bgcolor: 'grey.50', fontWeight: 600 }}>
                                    Gesundheitstipps
                                </Typography>
                                {results.health_tips.map((tip: any) => (
                                    <ListItem key={tip.id} disablePadding>
                                        <ListItemButton onClick={() => handleNavigate('/health-tips')}>
                                            <ListItemIcon><FitnessCenter color="success" /></ListItemIcon>
                                            <ListItemText primary={tip.title} />
                                            <ArrowForward fontSize="small" color="action" />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </>
                        )}

                        {results.faqs?.length > 0 && (
                            <>
                                <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', bgcolor: 'grey.50', fontWeight: 600 }}>
                                    FAQ
                                </Typography>
                                {results.faqs.map((faq: any) => (
                                    <ListItem key={faq.id} disablePadding>
                                        <ListItemButton onClick={() => handleNavigate('/faq')}>
                                            <ListItemIcon><Help color="info" /></ListItemIcon>
                                            <ListItemText primary={faq.question} />
                                            <ArrowForward fontSize="small" color="action" />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </>
                        )}

                        {results.doctors?.length === 0 && results.health_tips?.length === 0 && results.faqs?.length === 0 && (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">Keine Ergebnisse gefunden</Typography>
                            </Box>
                        )}
                    </List>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            Geben Sie mindestens 3 Zeichen ein, um zu suchen
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
