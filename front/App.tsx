
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ChatBot from './components/ChatBot';
import { AuthProvider } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ProtectedRoute } from './src/router/ProtectedRoute';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const EventCalendarPage = lazy(() => import('./pages/EventCalendarPage'));
const Sermons = lazy(() => import('./pages/Sermons'));
const Ministries = lazy(() => import('./pages/Ministries'));
const Donate = lazy(() => import('./pages/DonateWithPaystack'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const GalleryAlbum = lazy(() => import('./pages/GalleryAlbum'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage'));
const PasswordResetConfirmPage = lazy(() => import('./pages/PasswordResetConfirmPage'));
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard'));
const MemberProfile = lazy(() => import('./pages/member/MemberProfile'));
const MemberDonations = lazy(() => import('./pages/member/MemberDonations'));
const MemberEvents = lazy(() => import('./pages/member/MemberEvents'));
const PrayerRequestsPage = lazy(() => import('./pages/PrayerRequestsPage'));

// Placeholder components for other pages
const About = () => (
  <div className="pt-32 pb-20 container mx-auto px-4 text-center">
    <h1 className="text-4xl font-bold mb-6">About Us</h1>
    <p className="text-slate-600 max-w-2xl mx-auto">
      Trinity Lutheran Church has been a pillar of the community in Ghana for decades. We are a family of believers committed to living out the Gospel.
    </p>
    <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
      <div className="p-8 bg-white shadow-lg rounded-2xl">
        <h3 className="font-bold text-xl mb-4 text-blue-700">Our Vision</h3>
        <p className="text-slate-600">To be a vibrant sanctuary of grace where Christ is known and lives are transformed.</p>
      </div>
      <div className="p-8 bg-white shadow-lg rounded-2xl">
        <h3 className="font-bold text-xl mb-4 text-blue-700">Our Mission</h3>
        <p className="text-slate-600">Proclaiming the Gospel of Jesus Christ through Word, Worship, and Witness in Ghana.</p>
      </div>
      <div className="p-8 bg-white shadow-lg rounded-2xl">
        <h3 className="font-bold text-xl mb-4 text-blue-700">Our Heritage</h3>
        <p className="text-slate-600">Proudly following the Lutheran confessions within the unique cultural context of West Africa.</p>
      </div>
    </div>
  </div>
);



const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <Layout>
            <Suspense fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/ministries" element={<Ministries />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/events/calendar" element={<EventCalendarPage />} />
                <Route path="/sermons" element={<Sermons />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/:id" element={<GalleryAlbum />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/password-reset" element={<PasswordResetPage />} />
                <Route path="/password-reset/confirm" element={<PasswordResetConfirmPage />} />
                <Route path="/prayer-requests" element={<PrayerRequestsPage />} />
                
                {/* Member Portal Routes */}
                <Route path="/member" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
                <Route path="/member/profile" element={<ProtectedRoute><MemberProfile /></ProtectedRoute>} />
                <Route path="/member/donations" element={<ProtectedRoute><MemberDonations /></ProtectedRoute>} />
                <Route path="/member/events" element={<ProtectedRoute><MemberEvents /></ProtectedRoute>} />
              </Routes>
            </Suspense>
            <ChatBot />
          </Layout>
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
