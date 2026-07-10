import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import PrayerWallPage from './pages/PrayerWallPage';
import PostPrayerPage from './pages/PostPrayerPage';
import CelebratePage from './pages/CelebratePage';
import MyPrayersPage from './pages/MyPrayersPage';
import AdminDashboard from './pages/AdminDashboard';

// You can replace this with your actual Google Client ID via env variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-mockclientid.apps.googleusercontent.com';

function AppLayout() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/onboarding';

  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<PrayerWallPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/post" element={<PostPrayerPage />} />
        <Route path="/celebrate" element={<CelebratePage />} />
        <Route path="/my-prayers" element={<MyPrayersPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
