import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import DashboardPage from '@/pages/DashboardPage'; // This will be Tutor/Admin Dashboard
import CreateCoursePage from '@/pages/CreateCoursePage';
import MyCoursesPage from '@/pages/MyCoursesPage';
import ProfilePage from '@/pages/ProfilePage';
import EditCoursePage from '@/pages/EditCoursePage';
import AboutUsPage from '@/pages/AboutUsPage';
import CoursesPage from '@/pages/CoursesPage'; // General course listing for all
import PopularCoursesPage from '@/pages/PopularCoursesPage';
import ContactUsPage from '@/pages/ContactUsPage';
import ReferralPage from '@/pages/ReferralPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import RoleSelectionPage from '@/pages/RoleSelectionPage';
import StudentDashboardPage from '@/pages/student/StudentDashboardPage';
import StudentCoursesPage from '@/pages/student/StudentCoursesPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage'; // Placeholder for admin user management

import { Toaster } from '@/components/ui/toaster';
import { CourseProvider } from '@/contexts/CourseContext';
import { AuthProvider, AuthContext } from '@/contexts/AuthContext';

const pageVariants = {
  initial: { opacity: 0, x: "-20vw", scale: 0.95 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: "20vw", scale: 1.05 }
};

const pageTransition = { type: "spring", stiffness: 50, damping: 15, duration: 0.4 };

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="flex-1 p-6 md:p-10 overflow-auto bg-background"
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-background"><p className="text-primary text-xl">Loading authentication...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a generic dashboard or an unauthorized page
    return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/home'} replace />;
  }

  return <Outlet />;
};


const Layout = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Outlet />; // For login/signup pages that don't need sidebar

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Router>
          <Toaster />
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
              <Route path="/signup" element={<AnimatedPage><SignupPage /></AnimatedPage>} />
              <Route path="/role-selection" element={<AnimatedPage><RoleSelectionPage /></AnimatedPage>} />

              {/* Routes with Sidebar Layout */}
              <Route element={<Layout />}>
                {/* Common authenticated routes */}
                <Route element={<ProtectedRoute allowedRoles={['student', 'tutor', 'admin']} />}>
                  <Route path="/about-us" element={<AnimatedPage><AboutUsPage /></AnimatedPage>} />
                  <Route path="/courses" element={<AnimatedPage><CoursesPage /></AnimatedPage>} />
                  <Route path="/popular-courses" element={<AnimatedPage><PopularCoursesPage /></AnimatedPage>} />
                  <Route path="/contact-us" element={<AnimatedPage><ContactUsPage /></AnimatedPage>} />
                  <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} /> {/* Generic profile, can be enhanced by role */}
                </Route>

                {/* Student Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}> {/* Admin can also see student views */}
                  <Route path="/student/dashboard" element={<AnimatedPage><StudentDashboardPage /></AnimatedPage>} />
                  <Route path="/student/my-courses" element={<AnimatedPage><StudentCoursesPage /></AnimatedPage>} />
                </Route>

                {/* Tutor Routes (also accessible by Admin) */}
                <Route element={<ProtectedRoute allowedRoles={['tutor', 'admin']} />}>
                  <Route path="/home" element={<AnimatedPage><DashboardPage /></AnimatedPage>} /> {/* Tutor/Admin Dashboard */}
                  <Route path="/admin/create-course" element={<AnimatedPage><CreateCoursePage /></AnimatedPage>} />
                  <Route path="/admin/my-courses" element={<AnimatedPage><MyCoursesPage /></AnimatedPage>} />
                  <Route path="/admin/my-courses/edit/:courseId" element={<AnimatedPage><EditCoursePage /></AnimatedPage>} />
                  <Route path="/admin/referral" element={<AnimatedPage><ReferralPage /></AnimatedPage>} />
                </Route>
                
                {/* Admin Only Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                   <Route path="/admin/users" element={<AnimatedPage><AdminUsersPage /></AnimatedPage>} />
                </Route>
                
                {/* Fallback redirect based on role or to login */}
                <Route path="*" element={<FallbackRedirect />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

const FallbackRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/home" replace />; // Default for tutor/admin
};

export default App;