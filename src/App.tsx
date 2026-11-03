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
import { Footer } from './components/Footer';
import { getActiveSession, setActiveSession } from './data/mockData';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('om'); // Afaan Oromoo default as requested
  const [activeView, setActiveView] = useState<AppView>('home');
  const [targetStatusCode, setTargetStatusCode] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getActiveSession());

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
        currentUser={currentUser}
        onLogout={handleLogout}
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
            <AboutSection
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
          />
        )}

        {activeView === 'admin_dashboard' && currentUser && (
          <AdminDashboard
            currentLang={currentLang}
            currentAdmin={currentUser}
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
          <AboutSection
            currentLang={currentLang}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
