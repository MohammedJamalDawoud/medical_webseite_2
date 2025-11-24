import { useState } from 'react';
import { Typography, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel, Button, Alert, Box } from '@mui/material';
import { Warning } from '@mui/icons-material';
import apiClient from '../api/client';

export default function SymptomCheckerPage() {
    const [formData, setFormData] = useState({ symptoms_category: '', severity: 'mild', duration: '' });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiClient.post('/symptom-checker', formData);
            setResult(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>Symptom-Checker</Typography>

            <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>WICHTIG:</strong> Dieses Tool ersetzt keinen Arztbesuch und stellt keine medizinische Diagnose.
                    Bei Beschwerden wenden Sie sich bitte an eine Ärztin oder einen Arzt.
                    Bei akuten Notfällen wählen Sie den Notruf 112!
                </Typography>
            </Alert>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Symptom-Kategorie"
                            value={formData.symptoms_category}
                            onChange={(e) => setFormData({ ...formData, symptoms_category: e.target.value })}
                            margin="normal"
                            required
                            placeholder="z.B. Kopfschmerzen, Bauchschmerzen, Fieber"
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Schweregrad</InputLabel>
                            <Select
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                            >
                                <MenuItem value="mild">Leicht</MenuItem>
                                <MenuItem value="moderate">Mittel</MenuItem>
                                <MenuItem value="severe">Stark</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Dauer"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            margin="normal"
                            required
                            placeholder="z.B. 2 Tage, 4 Stunden"
                        />

                        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
                            {loading ? 'Analysiere...' : 'Symptome prüfen'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {result && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Ergebnis:</Typography>
                        <Typography variant="body1" paragraph>{result.result_message}</Typography>

                        <Alert severity="error" sx={{ mt: 2 }}>
                            <Typography variant="body2">{result.disclaimer}</Typography>
                        </Alert>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
