import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from '@/lib/LanguageContext';
// Add page imports here
import Home from './pages/Home';
import ClientLogin from './pages/ClientLogin';
import MemberRegister from './pages/MemberRegister';
import AccountantRegister from './pages/AccountantRegister';
import AccountantPortal from './pages/AccountantPortal';
import Equipment from './pages/Equipment';
import EquipmentDetail from './pages/EquipmentDetail';
import GlobalExport from './pages/GlobalExport';
import AdminDashboard from './pages/admin/AdminDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
    {/* Add your page Route elements here */}
    <Route path="/" element={<Home />} />
    <Route path="/client-login" element={<ClientLogin />} />
    <Route path="/register" element={<MemberRegister />} />
    <Route path="/accountant-register" element={<AccountantRegister />} />
    <Route path="/accountant-portal" element={<AccountantPortal />} />
    <Route path="/equipment" element={<Equipment />} />
    <Route path="/equipment/:id" element={<EquipmentDetail />} />
    <Route path="/global-export" element={<GlobalExport />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
