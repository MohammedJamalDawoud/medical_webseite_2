import { useQuery } from '@tanstack/react-query';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import apiClient from '../api/client';

export default function FAQPage() {
    const { data: faqs, isLoading } = useQuery({
        queryKey: ['faq'],
        queryFn: async () => {
            const res = await apiClient.get('/content/faq');
            return res.data;
        },
    });

    if (isLoading) return <Typography>Laden...</Typography>;

    return (
        <>
            <Typography variant="h4" gutterBottom>Häufig gestellte Fragen (FAQ)</Typography>
            {faqs?.map((faq: any) => (
                <Accordion key={faq.id}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" color="text.secondary">{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
}
