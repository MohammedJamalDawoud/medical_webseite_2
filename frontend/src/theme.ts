import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
    const isDark = mode === 'dark';

    return createTheme({
        palette: {
            mode,
            primary: {
                main: '#2563eb',
                light: '#60a5fa',
                dark: '#1e40af',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#10b981',
                light: '#34d399',
                dark: '#059669',
                contrastText: '#ffffff',
            },
            background: {
                default: isDark ? '#0f172a' : '#f8fafc',
                paper: isDark ? '#1e293b' : '#ffffff',
            },
            text: {
                primary: isDark ? '#f1f5f9' : '#1e293b',
                secondary: isDark ? '#94a3b8' : '#64748b',
            },
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontWeight: 700 },
            h2: { fontWeight: 600 },
            h3: { fontWeight: 600 },
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
            button: { textTransform: 'none', fontWeight: 500 },
        },
        shape: { borderRadius: 12 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: 10,
                        fontWeight: 500,
                        padding: '10px 24px',
                        boxShadow: 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                        },
                    },
                    contained: {
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        backgroundImage: 'none',
                        boxShadow: isDark
                            ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                            : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(226, 232, 240, 0.8)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: isDark
                                ? '0 20px 25px -5px rgba(0, 0, 0, 0.7)'
                                : '0 20px 25px -5px rgb(0 0 0 / 0.15)',
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: 'none' },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        color: isDark ? '#f1f5f9' : '#1e293b',
                        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    }
                }
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    }
                }
            }
        },
    });
};

export default getTheme('light');
