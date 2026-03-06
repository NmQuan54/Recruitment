import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import EditJob from './pages/employer/EditJob';
import ManageJobs from './pages/employer/ManageJobs';
import AllApplications from './pages/employer/AllApplications';
import CompanyProfile from './pages/employer/CompanyProfile';
import JobApplicants from './pages/employer/Applicants';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import AdminCategories from './pages/admin/AdminCategories';
import AdminReports from './pages/admin/AdminReports';
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateAppliedJobs from './pages/candidate/AppliedJobs';
import CandidateProfile from './pages/candidate/Profile';
import SavedJobs from './pages/candidate/SavedJobs';
import ResumeEditor from './pages/candidate/ResumeEditor';
import Chat from './pages/Chat';
import Candidates from './pages/Candidates';
import Opportunities from './pages/Opportunities';
import AdsPage from './pages/Ads';
import NotificationsPage from './pages/Notifications';
import ChangePassword from './pages/ChangePassword';
import Footer from './components/Footer';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      <Toaster position="top-right" />
      
      {!isAuthPage && <Navbar />}
      
      <main className={`flex-grow w-full flex flex-col ${!isAuthPage ? 'pt-0' : ''}`}>
        <div className="w-[90%] mx-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            {/* Protected Routes */}
            <Route path="/employer/dashboard" element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employer/post-job" element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/employer/jobs" element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <ManageJobs />
              </ProtectedRoute>
            } />
            <Route path="/employer/applications" element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <AllApplications />
              </ProtectedRoute>
            } />
            <Route path="/employer/jobs/:id/edit" element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <EditJob />
              </ProtectedRoute>
            } />
            <Route path="/employer/jobs/:jobId/applicants" element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <JobApplicants />
              </ProtectedRoute>
            } />
            <Route path="/employer/company" element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <CompanyProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/candidate/dashboard" element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <CandidateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/candidate/profile" element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <CandidateProfile />
              </ProtectedRoute>
            } />
            <Route path="/candidate/resume" element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <ResumeEditor />
              </ProtectedRoute>
            } />
            <Route path="/candidate/saved-jobs" element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <SavedJobs />
              </ProtectedRoute>
            } />
            <Route path="/candidate/applied-jobs" element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <CandidateAppliedJobs />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCompanies /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminJobs /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCategories /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReports /></ProtectedRoute>} />
            
            <Route path="/messages" element={<Chat />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/ads" element={<AdsPage />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tighter">404</h1>
                <p className="text-slate-500 font-bold mb-8">Trang bạn tìm kiếm hiện không khả dụng.</p>
                <a href="/" className="btn-premium px-8 py-3">Trở về trang chủ</a>
              </div>
            } />
          </Routes>
        </div>
      </main>
      
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

