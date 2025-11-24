import { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Button,
    CircularProgress,
} from '@mui/material';
import {
    Notifications,
    NotificationsNone,
    Circle,
    Event,
    LocalPharmacy,
    Science,
    Info,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function NotificationsMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await apiClient.get('/notifications');
            return res.data;
        },
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const { data: unreadCount } = useQuery({
        queryKey: ['notifications-unread'],
        queryFn: async () => {
            const res = await apiClient.get('/notifications/unread-count');
            return res.data.count;
        },
        refetchInterval: 30000,
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.post(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post('/notifications/read-all');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
        },
    });

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (notification: any) => {
        if (!notification.is_read) {
            markReadMutation.mutate(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
            handleClose();
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'APPOINTMENT': return <Event color="primary" />;
            case 'PRESCRIPTION': return <LocalPharmacy color="success" />;
            case 'LAB_RESULT': return <Science color="error" />;
            default: return <Info color="info" />;
        }
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{ mr: 2 }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 360,
                        maxHeight: 500,
                        mt: 1.5,
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Benachrichtigungen
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            onClick={() => markAllReadMutation.mutate()}
                            sx={{ textTransform: 'none' }}
                        >
                            Alle gelesen
                        </Button>
                    )}
                </Box>
                <Divider />

                {isLoading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : notifications?.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification: any) => (
                            <ListItem
                                key={notification.id}
                                button
                                onClick={() => handleNotificationClick(notification)}
                                sx={{
                                    bgcolor: notification.is_read ? 'transparent' : 'rgba(102, 126, 234, 0.05)',
                                    borderLeft: notification.is_read ? '4px solid transparent' : '4px solid #667eea',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'white', boxShadow: 1 }}>
                                        {getIcon(notification.type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2" sx={{ fontWeight: notification.is_read ? 400 : 600 }}>
                                            {notification.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box component="span">
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: de })}
                                            </Typography>
                                        </Box>
                                    }
                                />
                                {!notification.is_read && (
                                    <Circle sx={{ fontSize: 10, color: 'primary.main', ml: 1 }} />
                                )}
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <NotificationsNone sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Keine Benachrichtigungen
                        </Typography>
                    </Box>
                )}
            </Menu>
        </>
    );
}
