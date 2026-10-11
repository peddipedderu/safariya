import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useGameStore } from './store/gameStore';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const CardsPage = lazy(() => import('./pages/CardsPage'));
const BattlePage = lazy(() => import('./pages/BattlePage'));
const MarketPage = lazy(() => import('./pages/MarketPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const LoadingFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--dark-bg)',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌍</div>
      <div className="loading-spinner" style={{ margin: '0 auto' }} />
      <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontFamily: 'Cinzel, serif' }}>
        Loading Safariya...
      </p>
    </div>
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useGameStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route
            path="/battle"
            element={
              <ProtectedRoute>
                <BattlePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* 404 */}
          <Route
            path="*"
            element={
              <div
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  paddingTop: '80px',
                }}
              >
                <div style={{ fontSize: '5rem' }}>🗺️</div>
                <h1 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)' }}>Lost in Africa</h1>
                <p style={{ color: 'var(--text-muted)' }}>This territory doesn't exist yet.</p>
                <a href="/" className="btn btn-primary">Return to Home</a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}
