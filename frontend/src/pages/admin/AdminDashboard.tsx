import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
    Container, Typography, Box, Button, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Select, MenuItem, FormControl, InputLabel, CircularProgress, Divider,
    Chip, Stack, Avatar, Tooltip, IconButton, Paper, LinearProgress,
    alpha, Table, TableBody, TableCell, TableHead, TableRow, Collapse,
    Switch, FormControlLabel,
} from '@mui/material';
import {
    Add as AddIcon,
    Tune as TuneIcon,
    BarChart as BarChartIcon,
    Assignment as SurveyIcon,
    Publish as PublishIcon,
    Refresh as RefreshIcon,
    FiberManualRecord as DotIcon,
    Menu as MenuIcon,
    People as PeopleIcon,
    HowToReg as EligibleIcon,
    PersonOff as NotEligibleIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    getAdminSurveys, createAdminSurvey, updateAdminSurveyStatus,
    getSurveyStats, createQuestion, listQuestions, updateQuestion, deleteQuestion,
    createCondition, listConditions, updateCondition, deleteCondition,
} from '@/services/surveyApi';
import type { Survey, SurveyStats, Question, Condition } from '@/services/surveyApi';
import { toast } from 'react-toastify';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const surveySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
});

const questionSchema = z.object({
    questionText: z.string().min(1, 'Question text is required'),
    questionType: z.enum(['TEXT', 'NUMBER', 'SELECT']),
    options: z.string().optional(),
    isRequired: z.boolean(),
    order: z.number().min(1),
});

const conditionSchema = z.object({
    questionId: z.string().min(1, 'Question is required'),
    operator: z.enum(['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'GREATER_THAN_EQUAL', 'LESS_THAN', 'LESS_THAN_EQUAL', 'CONTAINS']),
    value: z.string().min(1, 'Value is required'),
});

type SurveyForm = z.infer<typeof surveySchema>;
type QuestionForm = z.infer<typeof questionSchema>;
type ConditionForm = z.infer<typeof conditionSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [stats, setStats] = useState<SurveyStats | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQuestions, setShowQuestions] = useState(true);
    const [showConditions, setShowConditions] = useState(true);
    const [socketStatus, setSocketStatus] = useState<'Live' | 'Reconnecting...' | 'Disconnected'>('Disconnected');

    // Modals
    const [openSurveyModal, setOpenSurveyModal] = useState(false);
    const [openQuestionModal, setOpenQuestionModal] = useState(false);
    const [openConditionModal, setOpenConditionModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [editingCondition, setEditingCondition] = useState<Condition | null>(null);

    // ── Forms ──
    const surveyForm = useForm<SurveyForm>({
        resolver: zodResolver(surveySchema),
        defaultValues: { title: '', description: '' },
    });

    const questionForm = useForm<QuestionForm>({
        resolver: zodResolver(questionSchema),
        defaultValues: { questionText: '', questionType: 'TEXT', options: '', isRequired: true, order: 1 },
    });
    const questionTypeWatch = questionForm.watch('questionType');

    const conditionForm = useForm<ConditionForm>({
        resolver: zodResolver(conditionSchema),
        defaultValues: { questionId: '', operator: 'EQUALS', value: '' },
    });

    // ── Data fetchers ──

    const fetchSurveys = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAdminSurveys();
            setSurveys(data);
            if (data.length > 0) {
                setSelectedSurvey(prev => prev ? (data.find(s => s.id === prev.id) ?? data[0]) : data[0]);
            }
        } catch {
            toast.error('Failed to load surveys');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSurveyData = useCallback(async (surveyId: string) => {
        try {
            const [qs, cds, st] = await Promise.allSettled([
                listQuestions(surveyId),
                listConditions(surveyId),
                getSurveyStats(surveyId),
            ]);
            setQuestions(qs.status === 'fulfilled' ? qs.value : []);
            setConditions(cds.status === 'fulfilled' ? cds.value : []);
            setStats(st.status === 'fulfilled' ? st.value : null);
        } catch {
            // silently ignore
        }
    }, []);

    useEffect(() => { fetchSurveys(); }, [fetchSurveys]);

    useEffect(() => {
        if (selectedSurvey) fetchSurveyData(selectedSurvey.id);
        else { setQuestions([]); setConditions([]); setStats(null); }
    }, [selectedSurvey, fetchSurveyData]);

    // ── Socket Logic ──
    useEffect(() => {
        if (!selectedSurvey) {
            setSocketStatus('Disconnected');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const socket: Socket = io(URL, {
            auth: { token }
        });

        socket.on('connect', () => {
            setSocketStatus('Live');
            socket.emit('join-survey-stats', { surveyId: selectedSurvey.id });
        });

        socket.on('disconnect', () => {
            setSocketStatus('Disconnected');
        });

        socket.on('connect_error', () => {
            setSocketStatus('Reconnecting...');
        });

        socket.on('survey:stats-updated', (payload: any) => {
            if (payload.surveyId === selectedSurvey.id) {
                setStats({
                    totalResponses: payload.totalResponses,
                    eligibleCount: payload.eligibleCount,
                    notEligibleCount: payload.notEligibleCount
                });
            }
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('survey:stats-updated');
            socket.disconnect();
        };
    }, [selectedSurvey]);

    // ── Survey handlers ──

    const onSurveySubmit = async (data: SurveyForm) => {
        try {
            const newSurvey = await createAdminSurvey(data);
            setSurveys(prev => [newSurvey, ...prev]);
            setSelectedSurvey(newSurvey);
            setOpenSurveyModal(false);
            surveyForm.reset();
            toast.success('Survey created!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to create survey');
        }
    };

    const publishSurvey = async () => {
        if (!selectedSurvey) return;
        try {
            const updated = await updateAdminSurveyStatus(selectedSurvey.id, 'PUBLISHED');
            toast.success('Survey published!');
            setSelectedSurvey(updated);
            setSurveys(prev => prev.map(s => s.id === updated.id ? updated : s));
        } catch (err: any) {
            toast.error(err.message || 'Failed to publish survey');
        }
    };

    // ── Question handlers ──

    const openAddQuestion = () => {
        setEditingQuestion(null);
        questionForm.reset({ questionText: '', questionType: 'TEXT', options: '', isRequired: true, order: questions.length + 1 });
        setOpenQuestionModal(true);
    };

    const openEditQuestion = (q: Question) => {
        setEditingQuestion(q);
        questionForm.reset({
            questionText: q.questionText,
            questionType: q.questionType,
            options: Array.isArray(q.options) ? q.options.join(', ') : '',
            isRequired: q.isRequired,
            order: q.order,
        });
        setOpenQuestionModal(true);
    };

    const onQuestionSubmit = async (data: QuestionForm) => {
        if (!selectedSurvey) return;
        try {
            const payload = {
                ...data,
                options: data.questionType === 'SELECT' && data.options
                    ? data.options.split(',').map(s => s.trim()).filter(Boolean)
                    : undefined,
            };
            if (editingQuestion) {
                const updated = await updateQuestion(editingQuestion.id, payload);
                setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
                toast.success('Question updated!');
            } else {
                const created = await createQuestion(selectedSurvey.id, payload);
                setQuestions(prev => [...prev, created]);
                toast.success('Question added!');
            }
            setOpenQuestionModal(false);
            questionForm.reset();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save question');
        }
    };

    const handleDeleteQuestion = async (q: Question) => {
        if (!window.confirm(`Delete question "${q.questionText}"?`)) return;
        try {
            await deleteQuestion(q.id);
            setQuestions(prev => prev.filter(x => x.id !== q.id));
            // also remove conditions that reference this question
            setConditions(prev => prev.filter(c => c.questionId !== q.id));
            toast.success('Question deleted');
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete question');
        }
    };

    // ── Condition handlers ──

    const openAddCondition = () => {
        setEditingCondition(null);
        conditionForm.reset({ questionId: '', operator: 'EQUALS', value: '' });
        setOpenConditionModal(true);
    };

    const openEditCondition = (c: Condition) => {
        setEditingCondition(c);
        conditionForm.reset({ questionId: c.questionId, operator: c.operator, value: c.value });
        setOpenConditionModal(true);
    };

    const onConditionSubmit = async (data: ConditionForm) => {
        if (!selectedSurvey) return;
        try {
            if (editingCondition) {
                const updated = await updateCondition(editingCondition.id, data);
                setConditions(prev => prev.map(c => c.id === updated.id ? updated : c));
                toast.success('Condition updated!');
            } else {
                const created = await createCondition(selectedSurvey.id, data);
                setConditions(prev => [...prev, created]);
                toast.success('Condition added!');
            }
            setOpenConditionModal(false);
            conditionForm.reset();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save condition');
        }
    };

    const handleDeleteCondition = async (c: Condition) => {
        const label = questions.find(q => q.id === c.questionId)?.questionText ?? c.questionId;
        if (!window.confirm(`Delete condition on "${label}"?`)) return;
        try {
            await deleteCondition(c.id);
            setConditions(prev => prev.filter(x => x.id !== c.id));
            toast.success('Condition deleted');
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete condition');
        }
    };

    // ── Helpers ──

    const eligiblePct = stats && stats.totalResponses > 0
        ? Math.round((stats.eligibleCount / stats.totalResponses) * 100) : 0;

    if (loading) return (
        <Box p={6} display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress size={48} thickness={4} />
            <Typography color="text.secondary">Loading dashboard...</Typography>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>

            {/* ── Hero Header ── */}
            <Paper elevation={0} sx={{
                background: 'linear-gradient(135deg, #3949ab 0%, #1a237e 100%)',
                color: 'white', p: { xs: 2.5, md: 3.5 }, borderRadius: 3, mb: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 2,
            }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 48, height: 48 }}><MenuIcon /></Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700} letterSpacing={-0.5}>Admin Dashboard</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.85 }}>Eligibility Survey Builder</Typography>
                    </Box>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip icon={<SurveyIcon />} label={`${surveys.length} Surveys`}
                        sx={{ bgcolor: alpha('#fff', 0.15), color: 'white', fontWeight: 600 }} />
                    {selectedSurvey && (
                        <Chip label={selectedSurvey.status}
                            color={selectedSurvey.status === 'PUBLISHED' ? 'success' : selectedSurvey.status === 'CLOSED' ? 'error' : 'warning'}
                            size="small" sx={{ fontWeight: 700 }} />
                    )}
                </Stack>
            </Paper>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>

                {/* ── Left Column ── */}
                <Box sx={{ flex: '1 1 55%', minWidth: { xs: '100%', md: '55%' } }}>

                    {/* Create Survey */}
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>Create Survey</Typography>
                    <Divider sx={{ mb: 2, mt: 0.5 }} />
                    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenSurveyModal(true)}
                            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 14px rgba(57,73,171,0.4)' }}>
                            New Survey
                        </Button>
                        <FormControl size="small" sx={{ minWidth: 220 }}>
                            <InputLabel>Manage Surveys</InputLabel>
                            <Select value={selectedSurvey?.id || ''} label="Manage Surveys" sx={{ borderRadius: 2 }}
                                onChange={e => {
                                    const s = surveys.find(s => s.id === e.target.value);
                                    if (s) setSelectedSurvey(s);
                                }}>
                                {surveys.length === 0 && <MenuItem disabled>No surveys yet</MenuItem>}
                                {surveys.map(s => (
                                    <MenuItem key={s.id} value={s.id}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <DotIcon sx={{ fontSize: 10, color: s.status === 'PUBLISHED' ? 'success.main' : s.status === 'CLOSED' ? 'error.main' : 'warning.main' }} />
                                            {s.title}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedSurvey?.status === 'DRAFT' && (
                            <Tooltip title="Publish this survey to make it available to users">
                                <Button variant="outlined" color="success" startIcon={<PublishIcon />} onClick={publishSurvey}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                                    Publish
                                </Button>
                            </Tooltip>
                        )}
                    </Box>

                    {/* Design Survey — Action Cards */}
                    <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>Design Survey</Typography>
                    <Divider sx={{ mb: 2, mt: 0.5 }} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                        {/* Questions Card */}
                        <Card variant="outlined" sx={{
                            flex: 1, minWidth: '240px', borderRadius: 3, transition: 'box-shadow 0.2s',
                            '&:hover': { boxShadow: '0 4px 20px rgba(57,73,171,0.15)' },
                            border: '1.5px solid', borderColor: !selectedSurvey ? '#e0e0e0' : 'primary.light',
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                    <Avatar sx={{ bgcolor: alpha('#3949ab', 0.1), width: 38, height: 38 }}>
                                        <SurveyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                    </Avatar>
                                    <Typography variant="subtitle1" fontWeight={700}>Questions</Typography>
                                    {questions.length > 0 && <Chip label={questions.length} size="small" color="primary" sx={{ ml: 'auto', fontWeight: 700 }} />}
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, minHeight: 36 }}>
                                    Add & edit survey questions for eligibility screening
                                </Typography>
                                <Button variant="contained" fullWidth disabled={!selectedSurvey} onClick={openAddQuestion}
                                    startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                                    Add Question
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Conditions Card */}
                        <Card variant="outlined" sx={{
                            flex: 1, minWidth: '240px', borderRadius: 3, transition: 'box-shadow 0.2s',
                            '&:hover': { boxShadow: '0 4px 20px rgba(57,73,171,0.15)' },
                            border: '1.5px solid', borderColor: !selectedSurvey ? '#e0e0e0' : 'primary.light',
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                    <Avatar sx={{ bgcolor: alpha('#3949ab', 0.1), width: 38, height: 38 }}>
                                        <TuneIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                    </Avatar>
                                    <Typography variant="subtitle1" fontWeight={700}>Eligibility Conditions</Typography>
                                    {conditions.length > 0 && <Chip label={conditions.length} size="small" color="secondary" sx={{ ml: 'auto', fontWeight: 700 }} />}
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, minHeight: 36 }}>
                                    Set rules to determine user eligibility
                                </Typography>
                                <Button variant="contained" fullWidth disabled={!selectedSurvey || questions.length === 0}
                                    onClick={openAddCondition} startIcon={<TuneIcon />}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                                    Set Condition
                                </Button>
                                {selectedSurvey && questions.length === 0 && (
                                    <Typography variant="caption" color="text.disabled" display="block" mt={1} textAlign="center">
                                        Add questions first
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Questions Table */}
                    {selectedSurvey && (
                        <Box mb={3}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>
                                    Questions ({questions.length})
                                </Typography>
                                <IconButton size="small" onClick={() => setShowQuestions(v => !v)}>
                                    {showQuestions ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                </IconButton>
                            </Box>
                            <Divider sx={{ mb: 1 }} />
                            <Collapse in={showQuestions}>
                                {questions.length === 0 ? (
                                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2, border: '1px dashed #e0e0e0' }}>
                                        <Typography variant="body2" color="text.disabled">No questions yet. Click "Add Question" to start.</Typography>
                                    </Paper>
                                ) : (
                                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Question</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Required</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {[...questions].sort((a, b) => a.order - b.order).map(q => (
                                                    <TableRow key={q.id} hover>
                                                        <TableCell>{q.order}</TableCell>
                                                        <TableCell sx={{ maxWidth: 200 }}>
                                                            <Typography variant="body2" noWrap title={q.questionText}>{q.questionText}</Typography>
                                                            {q.options && Array.isArray(q.options) && q.options.length > 0 && (
                                                                <Typography variant="caption" color="text.disabled">
                                                                    Options: {q.options.join(', ')}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip label={q.questionType} size="small"
                                                                color={q.questionType === 'SELECT' ? 'secondary' : q.questionType === 'NUMBER' ? 'info' : 'default'}
                                                                sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip label={q.isRequired ? 'Yes' : 'No'} size="small"
                                                                color={q.isRequired ? 'warning' : 'default'} sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Tooltip title="Edit">
                                                                <IconButton size="small" color="primary" onClick={() => openEditQuestion(q)}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton size="small" color="error" onClick={() => handleDeleteQuestion(q)}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                )}
                            </Collapse>
                        </Box>
                    )}

                    {/* Conditions Table */}
                    {selectedSurvey && (
                        <Box>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>
                                    Conditions ({conditions.length})
                                </Typography>
                                <IconButton size="small" onClick={() => setShowConditions(v => !v)}>
                                    {showConditions ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                </IconButton>
                            </Box>
                            <Divider sx={{ mb: 1 }} />
                            <Collapse in={showConditions}>
                                {conditions.length === 0 ? (
                                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2, border: '1px dashed #e0e0e0' }}>
                                        <Typography variant="body2" color="text.disabled">No conditions set yet.</Typography>
                                    </Paper>
                                ) : (
                                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>Question</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Operator</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Value</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {conditions.map(c => {
                                                    const q = questions.find(q => q.id === c.questionId);
                                                    return (
                                                        <TableRow key={c.id} hover>
                                                            <TableCell>
                                                                <Typography variant="body2" noWrap title={q?.questionText ?? c.questionId}>
                                                                    {q?.questionText ?? <em style={{ color: '#9e9e9e' }}>Unknown question</em>}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip label={c.operator.replace(/_/g, ' ')} size="small"
                                                                    color="primary" variant="outlined"
                                                                    sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight={600}>{c.value}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Tooltip title="Edit">
                                                                    <IconButton size="small" color="primary" onClick={() => openEditCondition(c)}>
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Delete">
                                                                    <IconButton size="small" color="error" onClick={() => handleDeleteCondition(c)}>
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                )}
                            </Collapse>
                        </Box>
                    )}
                </Box>

                {/* ── Right Column: Stats ── */}
                <Box sx={{ flex: '1 1 35%', minWidth: '280px' }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.5}>
                            Eligibility Stats
                        </Typography>
                        <Tooltip title="Refresh stats">
                            <IconButton size="small" onClick={() => selectedSurvey && fetchSurveyData(selectedSurvey.id)}>
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Divider sx={{ mb: 2, mt: 0.5 }} />

                    <Stack spacing={2}>
                        {/* Stat cards */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Total Responses', value: stats?.totalResponses ?? '—', icon: <PeopleIcon />, color: '#3949ab', bg: '#e8eaf6' },
                                { label: 'Eligible', value: stats?.eligibleCount ?? '—', icon: <EligibleIcon />, color: '#2e7d32', bg: '#e8f5e9' },
                                { label: 'Not Eligible', value: stats?.notEligibleCount ?? '—', icon: <NotEligibleIcon />, color: '#c62828', bg: '#ffebee' },
                            ].map(item => (
                                <Paper key={item.label} elevation={0} sx={{
                                    flex: 1, minWidth: '80px', p: 2, borderRadius: 3,
                                    bgcolor: item.bg, textAlign: 'center',
                                    border: `1.5px solid ${alpha(item.color, 0.2)}`,
                                }}>
                                    <Box sx={{ color: item.color, mb: 0.5 }}>{item.icon}</Box>
                                    <Typography variant="h5" fontWeight={800} sx={{ color: item.color }}>{item.value}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.label}</Typography>
                                </Paper>
                            ))}
                        </Box>

                        {/* Progress bar */}
                        {stats && stats.totalResponses > 0 && (
                            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body2" fontWeight={600}>Eligibility Rate</Typography>
                                        <Typography variant="body2" fontWeight={700} color="success.main">{eligiblePct}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={eligiblePct} sx={{
                                        height: 8, borderRadius: 4, bgcolor: '#ffcdd2',
                                        '& .MuiLinearProgress-bar': { bgcolor: 'success.main', borderRadius: 4 },
                                    }} />
                                    <Box display="flex" justifyContent="space-between" mt={0.5}>
                                        <Typography variant="caption" color="success.main">Eligible</Typography>
                                        <Typography variant="caption" color="error.main">Not Eligible</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        {/* Live stats */}
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                    <BarChartIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                    <Typography variant="subtitle2" fontWeight={700}>Live Stats Preview</Typography>
                                    <Chip
                                        label={socketStatus}
                                        size="small"
                                        color={socketStatus === 'Live' ? 'success' : socketStatus === 'Reconnecting...' ? 'warning' : 'default'}
                                        sx={{ ml: 'auto', fontSize: '0.65rem', height: 20 }}
                                    />
                                </Box>
                                {stats ? (
                                    <Stack spacing={1}>
                                        {[
                                            { dot: '#ffa726', text: `Total responses: ${stats.totalResponses} users` },
                                            { dot: '#66bb6a', text: `Eligible: ${stats.eligibleCount} users` },
                                            { dot: '#ef5350', text: `Not eligible: ${stats.notEligibleCount} users` },
                                        ].map(item => (
                                            <Box key={item.text} display="flex" alignItems="center" gap={1}>
                                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.dot, flexShrink: 0 }} />
                                                <Typography variant="body2" color="text.secondary">{item.text}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                        Select a survey to view live statistics.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>
            </Box>

            {/* ── Survey Modal ── */}
            <Dialog open={openSurveyModal} onClose={() => setOpenSurveyModal(false)} PaperProps={{ sx: { borderRadius: 3, minWidth: 400 } }}>
                <form onSubmit={surveyForm.handleSubmit(onSurveySubmit)}>
                    <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
                        <Box display="flex" alignItems="center" gap={1}><AddIcon color="primary" /> Create New Survey</Box>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ pt: 2 }}>
                        <Controller name="title" control={surveyForm.control} render={({ field, fieldState }) => (
                            <TextField {...field} label="Survey Title" fullWidth margin="normal"
                                error={!!fieldState.error} helperText={fieldState.error?.message}
                                InputProps={{ sx: { borderRadius: 2 } }} />
                        )} />
                        <Controller name="description" control={surveyForm.control} render={({ field }) => (
                            <TextField {...field} label="Description (optional)" fullWidth margin="normal"
                                multiline rows={3} InputProps={{ sx: { borderRadius: 2 } }} />
                        )} />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                        <Button onClick={() => setOpenSurveyModal(false)} sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}>Create</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* ── Question Modal (Add / Edit) ── */}
            <Dialog open={openQuestionModal} onClose={() => setOpenQuestionModal(false)} PaperProps={{ sx: { borderRadius: 3, minWidth: 440 } }}>
                <form onSubmit={questionForm.handleSubmit(onQuestionSubmit)}>
                    <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <SurveyIcon color="primary" />
                            {editingQuestion ? 'Edit Question' : 'Add Question'}
                        </Box>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ pt: 2 }}>
                        <Controller name="questionText" control={questionForm.control} render={({ field, fieldState }) => (
                            <TextField {...field} label="Question Text" fullWidth margin="normal"
                                error={!!fieldState.error} helperText={fieldState.error?.message}
                                InputProps={{ sx: { borderRadius: 2 } }} />
                        )} />
                        <Controller name="questionType" control={questionForm.control} render={({ field }) => (
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Type</InputLabel>
                                <Select {...field} label="Type" sx={{ borderRadius: 2 }}>
                                    <MenuItem value="TEXT">Text</MenuItem>
                                    <MenuItem value="NUMBER">Number</MenuItem>
                                    <MenuItem value="SELECT">Select (Multiple Choice)</MenuItem>
                                </Select>
                            </FormControl>
                        )} />
                        {questionTypeWatch === 'SELECT' && (
                            <Controller name="options" control={questionForm.control} render={({ field, fieldState }) => (
                                <TextField {...field} label="Options (comma separated)" fullWidth margin="normal"
                                    placeholder="e.g. India, USA, Other"
                                    error={!!fieldState.error} helperText={fieldState.error?.message}
                                    InputProps={{ sx: { borderRadius: 2 } }} />
                            )} />
                        )}
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Controller name="order" control={questionForm.control} render={({ field }) => (
                                <TextField {...field} type="number" label="Order" sx={{ flex: 1 }}
                                    onChange={e => field.onChange(Number(e.target.value))}
                                    InputProps={{ sx: { borderRadius: 2 } }} />
                            )} />
                            <Controller name="isRequired" control={questionForm.control} render={({ field }) => (
                                <FormControlLabel
                                    control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} color="primary" />}
                                    label="Required"
                                    sx={{ mt: 1 }}
                                />
                            )} />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                        <Button onClick={() => setOpenQuestionModal(false)} sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}>
                            {editingQuestion ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* ── Condition Modal (Add / Edit) ── */}
            <Dialog open={openConditionModal} onClose={() => setOpenConditionModal(false)} PaperProps={{ sx: { borderRadius: 3, minWidth: 440 } }}>
                <form onSubmit={conditionForm.handleSubmit(onConditionSubmit)}>
                    <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <TuneIcon color="primary" />
                            {editingCondition ? 'Edit Condition' : 'Set Eligibility Condition'}
                        </Box>
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ pt: 2 }}>
                        {/* Question dropdown — lists real questions from this survey */}
                        <Controller name="questionId" control={conditionForm.control} render={({ field, fieldState }) => (
                            <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                                <InputLabel>Question</InputLabel>
                                <Select {...field} label="Question" sx={{ borderRadius: 2 }}>
                                    {questions.length === 0 && <MenuItem disabled>No questions available</MenuItem>}
                                    {questions.map(q => (
                                        <MenuItem key={q.id} value={q.id}>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>{q.questionText}</Typography>
                                                <Typography variant="caption" color="text.secondary">{q.questionType}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {fieldState.error && <Typography variant="caption" color="error">{fieldState.error.message}</Typography>}
                            </FormControl>
                        )} />
                        <Controller name="operator" control={conditionForm.control} render={({ field }) => (
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Operator</InputLabel>
                                <Select {...field} label="Operator" sx={{ borderRadius: 2 }}>
                                    {['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'GREATER_THAN_EQUAL', 'LESS_THAN', 'LESS_THAN_EQUAL', 'CONTAINS'].map(op => (
                                        <MenuItem key={op} value={op}>{op.replace(/_/g, ' ')}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )} />
                        <Controller name="value" control={conditionForm.control} render={({ field, fieldState }) => (
                            <TextField {...field} label="Required Value" fullWidth margin="normal"
                                placeholder="e.g. 18, India, Developer"
                                error={!!fieldState.error} helperText={fieldState.error?.message}
                                InputProps={{ sx: { borderRadius: 2 } }} />
                        )} />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                        <Button onClick={() => setOpenConditionModal(false)} sx={{ borderRadius: 2, textTransform: 'none' }}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}>
                            {editingCondition ? 'Update' : 'Set Condition'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </Container>
    );
}
