import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { analyticsAPI } from './lib/api';
import SplashScreen from './components/SplashScreen';

// Lazy-load pages for code splitting
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDesigns = lazy(() => import('./pages/ProjectDesigns'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/Layout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = lazy(() => import('./pages/admin/Projects'));
const AdminDesigns = lazy(() => import('./pages/admin/Designs'));
const AdminSkills = lazy(() => import('./pages/admin/Skills'));
const AdminServices = lazy(() => import('./pages/admin/Services'));
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminBlog = lazy(() => import('./pages/admin/Blog'));
const AdminMedia = lazy(() => import('./pages/admin/Media'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminExperience = lazy(() => import('./pages/admin/Experience'));
const AdminLanguages = lazy(() => import('./pages/admin/Languages'));
const AdminClientLogos = lazy(() => import('./pages/admin/ClientLogos'));

// Loading screen
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#050816' }}>
    <div className="text-center">
      <div className="spinner mx-auto mb-4" />
      <p className="text-primary text-sm font-mono tracking-widest animate-pulse">INITIALIZING...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    return () => unsub();
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050816' }}>
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-primary text-sm font-mono tracking-widest animate-pulse">RESTORING SESSION...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Track page visit on mount
  useEffect(() => {
    analyticsAPI.trackVisit().catch((err) => console.error('[APP] trackVisit error:', err?.message));
  }, []);

  // Keep serverless function warm
  useEffect(() => {
    const warm = () => fetch('/api/_health').catch(() => {});
    warm();
    const id = setInterval(warm, 5 * 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<Portfolio />} />
          <Route path="/project/:id" element={<ProjectDesigns />} />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Dashboard (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="designs" element={<AdminDesigns />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="languages" element={<AdminLanguages />} />
            <Route path="client-logos" element={<AdminClientLogos />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
