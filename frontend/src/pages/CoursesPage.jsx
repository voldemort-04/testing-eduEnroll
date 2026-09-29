import { useState, useEffect } from 'react';
import { getActiveCourses, enrollStudent } from '../api/api';

export default function CoursesPage({ user }) {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getActiveCourses();
      setCourses(data);
    } catch (err) {
      setError('Erreur de chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      setError('Veuillez vous connecter pour vous inscrire');
      return;
    }

    setLoadingCourseId(courseId);
    setMessage(null);
    setError(null);

    try {
      await enrollStudent(user.id, courseId);
      setMessage('Inscription au cours reussie ! Rendez-vous dans "Mes Inscriptions" pour effectuer le paiement.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCourseId(null);
    }
  };

  const categories = ['all', ...new Set(courses.map(c => c.category))];
  const levels = ['all', ...new Set(courses.map(c => c.level))];

  const filteredCourses = courses.filter(c => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterLevel !== 'all' && c.level !== filterLevel) return false;
    return true;
  });

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Débutant': return 'level-beginner';
      case 'Intermédiaire': return 'level-intermediate';
      case 'Avancé': return 'level-advanced';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Catalogue de Cours</h1>
        <p>Explorez nos formations et developpez vos competences</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="filter-category">Categorie</label>
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'Toutes les categories' : c}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="filter-level">Niveau</label>
          <select
            id="filter-level"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            {levels.map(l => (
              <option key={l} value={l}>{l === 'all' ? 'Tous les niveaux' : l}</option>
            ))}
          </select>
        </div>
        <div className="filter-results">
          {filteredCourses.length} cours trouve{filteredCourses.length !== 1 ? 's' : ''}
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card course-card">
            <div className="course-card-header">
              <span className="course-category-tag">{course.category}</span>
              <span className={`course-level-badge ${getLevelBadgeClass(course.level)}`}>
                {course.level}
              </span>
            </div>
            <h3>{course.title}</h3>
            <p className="course-description">{course.description}</p>
            <div className="course-meta">
              <span>{course.durationHours}h</span>
              <span>{course.teacherName}</span>
              <span>Max {course.maxStudents}</span>
            </div>
            <div className="course-card-footer">
              <div className="course-price">{course.price.toFixed(2)} EUR</div>
              {user && user.role === 'STUDENT' && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleEnroll(course.id)}
                  disabled={loadingCourseId === course.id}
                >
                  {loadingCourseId === course.id ? 'En cours...' : "S'inscrire"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="card empty-state">
          <div className="empty-icon">—</div>
          <h3>Aucun cours trouve</h3>
          <p>Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
}
