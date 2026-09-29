import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CoursesPage from './pages/CoursesPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  // Persist session in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('eduenroll_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('eduenroll_user');
      }
    }
  }, []);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    localStorage.setItem('eduenroll_user', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eduenroll_user');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('eduenroll_user', JSON.stringify(updatedUser));
  };

  // ── Auth Screen ──
  if (!user) {
    return (
      <div className="app">
        {authView === 'login' ? (
          <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <RegisterPage onRegister={handleLogin} onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // ── Authenticated App ──
  const isTeacher = user.role === 'TEACHER';

  return (
    <Router>
      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-brand">
            <span className="brand-icon">E</span>
            <span className="brand-text">EduEnroll</span>
          </div>

          <div className="navbar-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Cours
            </NavLink>
            {!isTeacher && (
              <NavLink to="/enrollments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Mes Inscriptions
              </NavLink>
            )}
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Profil
            </NavLink>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">
                {isTeacher ? 'Enseignant' : 'Etudiant'}
              </span>
            </div>
            <button className="btn btn-logout" onClick={handleLogout}>
              Deconnexion
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              isTeacher ? <TeacherDashboard user={user} /> : <StudentDashboard user={user} />
            } />
            <Route path="/courses" element={<CoursesPage user={user} />} />
            {!isTeacher && (
              <Route path="/enrollments" element={<EnrollmentsPage user={user} />} />
            )}
            <Route path="/profile" element={
              <ProfilePage user={user} onUpdateUser={handleUpdateUser} />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 EduEnroll — Plateforme d'inscription aux cours en ligne</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
