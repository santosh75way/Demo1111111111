import { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button, Card, CardContent,
    CircularProgress, RadioGroup, FormControlLabel, Radio, TextField,
    Chip, Stack, Avatar, Paper, Divider, alpha
} from '@mui/material';
import {
    Assignment as SurveyIcon,
    ArrowForward as ArrowIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    ArrowBack as BackIcon,
    Poll as PollIcon,
    Send as SendIcon,
    QuestionAnswer as QuizIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import {
    getAvailableSurveys, getSurveyDetails, submitSurvey
} from '@/services/surveyApi';
import type { Survey, Question } from '@/services/surveyApi';
import { toast } from 'react-toastify';

export default function UserDashboard() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [eligibilityResult, setEligibilityResult] = useState<'ELIGIBLE' | 'NOT_ELIGIBLE' | null>(null);

    const { control, handleSubmit, reset } = useForm();

    const fetchSurveys = async () => {
        try {
            setLoading(true);
            const data = await getAvailableSurveys();
            setSurveys(data);
        } catch (err: any) {
            toast.error('Failed to load surveys');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const handleStartSurvey = async (id: string) => {
        try {
            setLoading(true);
            const data = await getSurveyDetails(id);
            setActiveSurvey(data);
            reset(); // clear old form
            setEligibilityResult(null);
        } catch (err) {
            toast.error('Failed to load survey details');
        } finally {
            setLoading(false);
        }
    };

    const onSubmitAnswers = async (data: any) => {
        if (!activeSurvey) return;

        // Convert react-hook-form flat object into array format expected by backend
        const answers = Object.entries(data).map(([questionId, value]) => ({
            questionId,
            value: String(value)
        }));

        try {
            setSubmitting(true);
            const result = await submitSurvey(activeSurvey.id, answers);
            setEligibilityResult(result.eligibilityStatus);
            toast.success('Survey submitted successfully!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to submit survey');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && surveys.length === 0) return (
        <Box p={6} display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress size={48} thickness={4} />
            <Typography color="text.secondary">Loading surveys...</Typography>
        </Box>
    );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* ── Hero Header ── */}
            <Paper
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #00897b 0%, #004d40 100%)',
                    color: 'white',
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 3,
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 48, height: 48 }}>
                        <PollIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700} letterSpacing={-0.5}>
                            User Dashboard
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.85 }}>
                            Take a Survey & Check Your Eligibility
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    icon={<SurveyIcon />}
                    label={`${surveys.length} Available`}
                    sx={{ bgcolor: alpha('#fff', 0.15), color: 'white', fontWeight: 600 }}
                />
            </Paper>

            {/* ── Available Surveys ── */}
            {!activeSurvey ? (
                <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>
                        Available Surveys
                    </Typography>
                    <Divider sx={{ mb: 2, mt: 0.5 }} />
                    {surveys.length === 0 ? (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 5,
                                textAlign: 'center',
                                borderRadius: 3,
                                bgcolor: '#f5f5f5',
                                border: '2px dashed #e0e0e0',
                            }}
                        >
                            <QuizIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                            <Typography color="text.secondary" fontWeight={500}>
                                No surveys are currently available.
                            </Typography>
                            <Typography variant="body2" color="text.disabled">
                                Check back later for new eligibility surveys.
                            </Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={2}>
                            {surveys.map((s, idx) => (
                                <Card
                                    key={s.id}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 3,
                                        transition: 'all 0.2s',
                                        border: '1.5px solid',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            boxShadow: '0 4px 20px rgba(0,137,123,0.15)',
                                            borderColor: 'primary.light',
                                            transform: 'translateY(-1px)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: idx % 2 === 0 ? alpha('#00897b', 0.12) : alpha('#1565c0', 0.12),
                                                        color: idx % 2 === 0 ? '#00897b' : '#1565c0',
                                                        width: 44, height: 44,
                                                    }}
                                                >
                                                    <SurveyIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={700}>{s.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {s.description || 'Eligibility Screening'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                endIcon={loading ? <CircularProgress size={14} color="inherit" /> : <ArrowIcon />}
                                                onClick={() => handleStartSurvey(s.id)}
                                                disabled={loading}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    px: 2.5,
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0,
                                                    boxShadow: '0 3px 10px rgba(0,137,123,0.35)',
                                                }}
                                            >
                                                Start Survey
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Box>
            ) : (
                /* ── Take Survey Section ── */
                <Box>
                    <Button
                        startIcon={<BackIcon />}
                        onClick={() => { setActiveSurvey(null); setEligibilityResult(null); }}
                        sx={{ mb: 2.5, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                    >
                        Back to Surveys
                    </Button>

                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>
                        Complete the Survey
                    </Typography>
                    <Divider sx={{ mb: 2, mt: 0.5 }} />

                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 3,
                            border: '1.5px solid',
                            borderColor: 'divider',
                            overflow: 'visible',
                        }}
                    >
                        {/* Survey Title Bar */}
                        <Box sx={{ bgcolor: alpha('#00897b', 0.06), p: 2, borderBottom: '1px solid', borderColor: 'divider', borderRadius: '12px 12px 0 0' }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <QuizIcon sx={{ color: '#00897b', fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={700}>{activeSurvey.title}</Typography>
                                <Chip label={`${activeSurvey.questions?.length || 0} Questions`} size="small" sx={{ ml: 'auto', fontWeight: 600 }} />
                            </Box>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            {activeSurvey.questions?.map((q: Question, idx: number) => (
                                <Box
                                    key={q.id}
                                    sx={{
                                        mb: idx < (activeSurvey.questions?.length ?? 0) - 1 ? 3 : 0,
                                        pb: idx < (activeSurvey.questions?.length ?? 0) - 1 ? 3 : 0,
                                        borderBottom: idx < (activeSurvey.questions?.length ?? 0) - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Box display="flex" alignItems="flex-start" gap={1.5} mb={1.5}>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'primary.main',
                                                width: 26, height: 26,
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                flexShrink: 0,
                                                mt: 0.2,
                                            }}
                                        >
                                            {idx + 1}
                                        </Avatar>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {q.questionText}
                                            {q.isRequired && (
                                                <Typography component="span" color="error.main" ml={0.5}>*</Typography>
                                            )}
                                        </Typography>
                                    </Box>

                                    {q.questionType === 'SELECT' ? (
                                        <Controller
                                            name={q.id}
                                            control={control}
                                            rules={{ required: q.isRequired ? 'This field is required' : false }}
                                            render={({ field }) => (
                                                <RadioGroup row {...field} sx={{ pl: 4.5, gap: 1 }}>
                                                    {(q.options as string[] || []).map((opt) => (
                                                        <Paper
                                                            key={opt}
                                                            variant="outlined"
                                                            sx={{
                                                                borderRadius: 2,
                                                                px: 1.5,
                                                                py: 0.5,
                                                                cursor: 'pointer',
                                                                border: '1.5px solid',
                                                                borderColor: field.value === opt ? 'primary.main' : 'divider',
                                                                bgcolor: field.value === opt ? alpha('#00897b', 0.06) : 'transparent',
                                                                transition: 'all 0.15s',
                                                            }}
                                                        >
                                                            <FormControlLabel value={opt} control={<Radio size="small" />} label={opt} />
                                                        </Paper>
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        />
                                    ) : (
                                        <Controller
                                            name={q.id}
                                            control={control}
                                            rules={{ required: q.isRequired ? 'This field is required' : false }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    type={q.questionType === 'NUMBER' ? 'number' : 'text'}
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Enter your answer"
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    sx={{ pl: 4.5 }}
                                                    InputProps={{ sx: { borderRadius: 2 } }}
                                                />
                                            )}
                                        />
                                    )}
                                </Box>
                            ))}

                            <Box textAlign="center" mt={4} pt={3} borderTop="1px solid" sx={{ borderColor: 'divider' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                                    onClick={handleSubmit(onSubmitAnswers)}
                                    disabled={submitting || !!eligibilityResult}
                                    sx={{
                                        borderRadius: 2.5,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        px: 5,
                                        py: 1.2,
                                        boxShadow: '0 4px 14px rgba(0,137,123,0.4)',
                                        '&:hover': { boxShadow: '0 6px 20px rgba(0,137,123,0.5)' },
                                    }}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Answers'}
                                </Button>
                            </Box>
                        </Box>
                    </Card>

                    {/* ── Eligibility Result ── */}
                    {eligibilityResult && (
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 3,
                                p: 4,
                                borderRadius: 3,
                                textAlign: 'center',
                                border: '2px solid',
                                borderColor: eligibilityResult === 'ELIGIBLE' ? 'success.main' : 'error.main',
                                bgcolor: eligibilityResult === 'ELIGIBLE'
                                    ? alpha('#2e7d32', 0.05)
                                    : alpha('#c62828', 0.05),
                            }}
                        >
                            {eligibilityResult === 'ELIGIBLE' ? (
                                <>
                                    <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 1 }} />
                                    <Typography variant="h5" fontWeight={800} color="success.main" gutterBottom>
                                        You are Eligible!
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Congratulations! You meet all the criteria for this survey.
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <CancelIcon sx={{ fontSize: 56, color: 'error.main', mb: 1 }} />
                                    <Typography variant="h5" fontWeight={800} color="error.main" gutterBottom>
                                        Not Eligible
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Sorry, you do not meet the criteria for this survey.
                                    </Typography>
                                </>
                            )}
                            <Button
                                variant="outlined"
                                sx={{ mt: 2.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                color={eligibilityResult === 'ELIGIBLE' ? 'success' : 'error'}
                                onClick={() => { setActiveSurvey(null); setEligibilityResult(null); }}
                            >
                                Back to Surveys
                            </Button>
                        </Paper>
                    )}
                </Box>
            )}
        </Container>
    );
}
