import { useState, useEffect } from 'react';
import { getEnrollmentsByStudent, getActiveCourses } from '../api/api';

export default function StudentDashboard({ user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      const [enrs, courses] = await Promise.all([
        getEnrollmentsByStudent(user.id),
        getActiveCourses(),
      ]);
      setEnrollments(enrs);
      setCourseCount(courses.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paidEnrollments = enrollments.filter(e => e.paymentStatus === 'PAID');
  const pendingEnrollments = enrollments.filter(e => e.paymentStatus === 'PENDING');
  const avgProgress = paidEnrollments.length > 0
    ? Math.round(paidEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / paidEnrollments.length)
    : 0;

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bonjour, {user.name.split(' ')[0]} !</h1>
        <p>Bienvenue dans votre espace etudiant</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">C</div>
          <div className="stat-info">
            <div className="stat-value">{enrollments.length}</div>
            <div className="stat-label">Cours inscrits</div>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">P</div>
          <div className="stat-info">
            <div className="stat-value">{paidEnrollments.length}</div>
            <div className="stat-label">Cours payes</div>
          </div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">A</div>
          <div className="stat-info">
            <div className="stat-value">{pendingEnrollments.length}</div>
            <div className="stat-label">En attente</div>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">%</div>
          <div className="stat-info">
            <div className="stat-value">{avgProgress}%</div>
            <div className="stat-label">Progression moy.</div>
          </div>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="section-header">
        <h2>Mes cours recents</h2>
      </div>

      {enrollments.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">—</div>
          <h3>Aucun cours inscrit</h3>
          <p>Explorez le catalogue de cours et inscrivez-vous !</p>
        </div>
      ) : (
        <div className="dashboard-courses">
          {enrollments.slice(0, 4).map((enrollment) => (
            <div key={enrollment.id} className="card dashboard-course-card">
              <div className="dashboard-course-top">
                <div className="dashboard-course-info">
                  <h3>{enrollment.course?.title}</h3>
                  <p className="text-muted">{enrollment.course?.teacherName}</p>
                </div>
                <div className="dashboard-course-meta">
                  {enrollment.paymentStatus === 'PAID' ? (
                    <span className="badge badge-paid">Paye</span>
                  ) : (
                    <span className="badge badge-pending">En attente</span>
                  )}
                </div>
              </div>
              {enrollment.paymentStatus === 'PAID' && (
                <div className="progress-bar-container">
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${enrollment.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-label">{enrollment.progress || 0}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Available Courses Count */}
      <div className="card info-banner">
        <span className="info-banner-icon">i</span>
        <div>
          <strong>{courseCount} cours disponibles</strong> dans le catalogue.
          Decouvrez de nouveaux cours dans l'onglet "Cours" !
        </div>
      </div>
    </div>
  );
}
