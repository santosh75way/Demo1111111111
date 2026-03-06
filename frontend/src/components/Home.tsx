import { Box, Container, Typography, Button, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assignment, Timeline, GroupAdd, DataObject } from '@mui/icons-material';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      pt: 12, pb: 12
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            variant="h2"
            fontWeight="900"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              letterSpacing: '-1.5px',
              fontSize: { xs: '3rem', md: '4.5rem' }
            }}
          >
            Survey Eligibility Flow Builder
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 5, fontWeight: 400, fontSize: { xs: '1.1rem', md: '1.25rem' }, lineHeight: 1.6 }}>
            A powerful visual survey builder that uses flow-based logic to determine user eligibility for surveys based on their responses. Perfect for market research, customer feedback, and participant screening.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                px: 5, py: 1.5, borderRadius: 3, fontSize: '1.1rem', fontWeight: 600,
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)',
                '&:hover': { background: 'linear-gradient(45deg, #4f46e5, #7c3aed)' }
              }}
            >
              Get Started for Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 5, py: 1.5, borderRadius: 3, fontSize: '1.1rem', fontWeight: 600,
                borderColor: '#6366f1', color: '#6366f1',
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': { borderColor: '#4f46e5', background: 'rgba(99, 102, 241, 0.1)' }
              }}
            >
              Sign In to Dashboard
            </Button>
          </Stack>
        </Box>

        {/* Features Section */}
        <Typography variant="h4" fontWeight="800" textAlign="center" mb={6} sx={{ color: '#1e293b' }}>
          Platform Features
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 4
        }}>
          {[
            {
              title: "Visual Flow Builder",
              description: "Drag-and-drop flow builder using React Flow for configuring logic rules visually.",
              icon: <Timeline sx={{ fontSize: 40, color: '#6366f1' }} />
            },
            {
              title: "Advanced Eligibility",
              description: "Conditional logic to instantly filter and segment eligible users in real-time.",
              icon: <DataObject sx={{ fontSize: 40, color: '#8b5cf6' }} />
            },
            {
              title: "Public & Anonymous",
              description: "Share forms easily. Allow responses from anonymous or fully logged-in registered users.",
              icon: <GroupAdd sx={{ fontSize: 40, color: '#ec4899' }} />
            },
            {
              title: "Export & Analytics",
              description: "Real-time eligibility count preview and instantly export survey logic or dataset results.",
              icon: <Assignment sx={{ fontSize: 40, color: '#14b8a6' }} />
            }
          ].map((feature, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'left',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <Box sx={{
                width: 64, height: 64, borderRadius: 3,
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 3
              }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" fontWeight="700" mb={1.5} sx={{ color: '#0f172a' }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}