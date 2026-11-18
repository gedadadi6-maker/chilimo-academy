import React, { useState, useEffect } from 'react';
import { Language, AppView, UserAccount } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PortalCards } from './components/PortalCards';
import { ApplicationStatusView } from './components/ApplicationStatusView';
import { AdmissionRegistrationView } from './components/AdmissionRegistrationView';
import { LoginView } from './components/LoginView';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherPortalView } from './components/TeacherPortalView';
import { StudentPortalView } from './components/StudentPortalView';
import { ParentPortalView } from './components/ParentPortalView';
import { AboutSection } from './components/AboutSection';
import { HeritageTributeSection } from './components/HeritageTributeSection';
import { PublicNoticeBoardSection } from './components/PublicNoticeBoardSection';
import { Footer } from './components/Footer';
import { KgLearningHub } from './components/KgLearningHub';
import { Campus3DTourModal } from './components/Campus3DTourModal';
import { DigitalEBookReaderModal } from './components/DigitalEBookReaderModal';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { getActiveSession, setActiveSession, canUserAccessPortal } from './data/mockData';
import { scheduleAutoCloudSync, setCloudSyncToken, syncPublicFromCloudOnBoot, pullErpFromCloud } from './lib/backupAndSync';
import { LiveNotificationToast } from './components/NotificationCenter';
import { OfflineIndicator } from './components/PWAInstallControls';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('om'); // Afaan Oromoo default as requested
  const [activeView, setActiveView] = useState<AppView>('home');
  const [targetStatusCode, setTargetStatusCode] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getActiveSession());
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(null);
  const [showGlobalTour3D, setShowGlobalTour3D] = useState<boolean>(false);
  const [showGlobalEBook, setShowGlobalEBook] = useState<boolean>(false);

  useEffect(() => {
    setCloudSyncToken(firebaseIdToken);
  }, [firebaseIdToken]);

  useEffect(() => {
    const handleDataUpdated = () => {
      scheduleAutoCloudSync(1500);
      if (currentUser && !canUserAccessPortal(currentUser).allowed) {
        setActiveSession(null);
        setCurrentUser(null);
        setActiveView('login');
      }
    };
    window.addEventListener('chilimo:data-updated', handleDataUpdated);
    return () => window.removeEventListener('chilimo:data-updated', handleDataUpdated);
  }, [currentUser]);

  useEffect(() => {
    syncPublicFromCloudOnBoot();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          setFirebaseIdToken(token);
          const pulled = await pullErpFromCloud(token).catch(() => ({ restoredModules: 0 }));
          if (pulled.restoredModules > 0) {
            window.dispatchEvent(new Event('chilimo:data-updated'));
          }
        } catch {
          setFirebaseIdToken(null);
        }
      } else {
        setFirebaseIdToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const handleNavigate = (view: AppView) => {
    setActiveView(view);
  };

  const handleQuickTrack = (code: string) => {
    setTargetStatusCode(code);
    setActiveView('status_check');
  };

  const handleRegistrationSuccess = (code: string) => {
    setTargetStatusCode(code);
    setActiveView('status_check');
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'admin' || user.role === 'employee') {
      setActiveView('admin_dashboard');
    } else if (user.role === 'teacher') {
      setActiveView('teacher_dashboard');
    } else if (user.role === 'student') {
      setActiveView('student_dashboard');
    } else if (user.role === 'parent') {
      setActiveView('parent_dashboard');
    } else {
      setActiveView('home');
    }
  };

  const handleLogout = () => {
    setActiveSession(null);
    setCurrentUser(null);
    setFirebaseIdToken(null);
    signOut(auth).catch(() => {});
    setActiveView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeView={activeView}
        onNavigate={handleNavigate}
        onQuickTrack={handleQuickTrack}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenTour3D={() => setShowGlobalTour3D(true)}
        onOpenEBook={() => setShowGlobalEBook(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection
              currentLang={currentLang}
              onNavigate={handleNavigate}
              onQuickTrack={handleQuickTrack}
            />
            <PortalCards
              currentLang={currentLang}
              onNavigate={handleNavigate}
            />
            <HeritageTributeSection
              currentLang={currentLang}
              onNavigate={handleNavigate}
            />
            <AboutSection
              currentLang={currentLang}
              onNavigate={handleNavigate}
            />
            <PublicNoticeBoardSection
              currentLang={currentLang}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {activeView === 'status_check' && (
          <ApplicationStatusView
            currentLang={currentLang}
            onBack={() => setActiveView('home')}
            initialCode={targetStatusCode}
          />
        )}

        {activeView === 'register_admission' && (
          <AdmissionRegistrationView
            currentLang={currentLang}
            onBack={() => setActiveView('home')}
            onSuccess={handleRegistrationSuccess}
          />
        )}

        {activeView === 'login' && (
          <LoginView
            currentLang={currentLang}
            onBack={() => setActiveView('home')}
            onSuccess={handleLoginSuccess}
            onFirebaseToken={setFirebaseIdToken}
          />
        )}

        {activeView === 'admin_dashboard' && currentUser && (
          <AdminDashboard
            currentLang={currentLang}
            currentAdmin={currentUser}
            firebaseIdToken={firebaseIdToken}
            onFirebaseToken={setFirebaseIdToken}
            onLogout={handleLogout}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'teacher_dashboard' && currentUser && (
          <TeacherPortalView
            currentLang={currentLang}
            currentTeacher={currentUser}
            onLogout={handleLogout}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'student_dashboard' && currentUser && (
          <StudentPortalView
            currentLang={currentLang}
            currentStudent={currentUser}
            onLogout={handleLogout}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'parent_dashboard' && currentUser && (
          <ParentPortalView
            currentLang={currentLang}
            currentParent={currentUser}
            onLogout={handleLogout}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'about' && (
          <>
            <AboutSection
              currentLang={currentLang}
              onNavigate={handleNavigate}
            />
            <HeritageTributeSection
              currentLang={currentLang}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {activeView === 'kg_hub' && (
          <KgLearningHub
            currentLang={currentLang}
            onBack={() => setActiveView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
      />

      {/* Global 3D Virtual Campus Tour Modal */}
      {showGlobalTour3D && (
        <Campus3DTourModal onClose={() => setShowGlobalTour3D(false)} />
      )}

      {/* Global Digital E-Books Reader Modal */}
      {showGlobalEBook && (
        <DigitalEBookReaderModal onClose={() => setShowGlobalEBook(false)} />
      )}

      {/* Live Admission & Notice Board Notification Toast */}
      <LiveNotificationToast
        currentLang={currentLang}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onTrackApplication={handleQuickTrack}
      />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator currentLang={currentLang} />
    </div>
  );
}
