import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import { getSurveySummaryReport } from '@/services/surveyApi';
import type { SurveySummaryReport } from '@/services/surveyApi';

export default function SurveyReport() {
    const [report, setReport] = useState<SurveySummaryReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSurveySummaryReport()
            .then(data => {
                setReport(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load report data');
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <Box p={6} display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress size={48} thickness={4} />
            <Typography color="text.secondary">Generating Report...</Typography>
        </Box>
    );

    if (error) return (
        <Container sx={{ py: 4 }}>
            <Typography color="error">{error}</Typography>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} className="no-print">
                <Typography variant="h4" fontWeight={700}>Survey Report</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    Download / Print Report
                </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Box mb={4}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>Surveys Summary</Typography>
                    <Box display="flex" gap={4} color="text.secondary">
                        <Typography variant="body2"><strong>Generated:</strong> {report?.generatedAt ? new Date(report.generatedAt).toLocaleString() : ''}</Typography>
                        <Typography variant="body2"><strong>Total Surveys:</strong> {report?.totalSurveys}</Typography>
                    </Box>
                </Box>

                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell sx={{ fontWeight: 700 }}>No.</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Survey Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Total Responses</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Eligible</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Not Eligible</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Eligibility Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {report?.surveys.map(s => (
                            <TableRow key={s.surveyId}>
                                <TableCell>{s.surveyNumber}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{s.surveyName}</TableCell>
                                <TableCell align="right">{s.totalResponses}</TableCell>
                                <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>{s.eligible}</TableCell>
                                <TableCell align="right" sx={{ color: 'error.main', fontWeight: 600 }}>{s.notEligible}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>{s.eligibilityRate}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    @page { margin: 20mm; }
                }
                `}
            </style>
        </Container>
    );
}
