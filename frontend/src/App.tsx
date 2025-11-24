import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import MainLayout from './layout/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DoctorSearchPage from './pages/DoctorSearchPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import ReportsPage from './pages/ReportsPage';
import LabResultsPage from './pages/LabResultsPage';
import HealthTipsPage from './pages/HealthTipsPage';
import FAQPage from './pages/FAQPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import AccountPage from './pages/AccountPage';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/doctors" element={<DoctorSearchPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/prescriptions" element={<PrescriptionsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/lab-results" element={<LabResultsPage />} />
                <Route path="/health-tips" element={<HealthTipsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </MainLayout>
    );
}

export default App;
