import { useState, useEffect } from 'react';
import { getCoursesByTeacher, getEnrollmentsByCourse, createCourse, updateCourse, deleteCourse } from '../api/api';

export default function TeacherDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [courseEnrollments, setCourseEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [viewStudents, setViewStudents] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '', description: '', price: '', category: 'Testing',
    durationHours: 20, level: 'Débutant', maxStudents: 30,
  });

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      const coursesData = await getCoursesByTeacher(user.id);
      setCourses(coursesData);

      // Load enrollment counts for each course
      const enrollmentData = {};
      for (const course of coursesData) {
        const enrs = await getEnrollmentsByCourse(course.id);
        enrollmentData[course.id] = enrs;
      }
      setCourseEnrollments(enrollmentData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await createCourse({
        ...newCourse,
        price: parseFloat(newCourse.price),
        teacherId: user.id,
      });
      setMessage('Cours cree avec succes !');
      setShowCreateModal(false);
      setNewCourse({
        title: '', description: '', price: '', category: 'Testing',
        durationHours: 20, level: 'Débutant', maxStudents: 30,
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await updateCourse(editCourse.id, {
        ...editCourse,
        price: parseFloat(editCourse.price),
      });
      setMessage('Cours mis a jour avec succes !');
      setEditCourse(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Etes-vous sur de vouloir supprimer ce cours ?')) return;
    setMessage(null);
    setError(null);

    try {
      await deleteCourse(courseId);
      setMessage('Cours supprime');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const totalStudents = Object.values(courseEnrollments).reduce((sum, enrs) => sum + enrs.length, 0);
  const totalRevenue = Object.values(courseEnrollments).reduce((sum, enrs) =>
    sum + enrs.filter(e => e.paymentStatus === 'PAID').reduce((s, e) => s + (e.amountPaid || 0), 0), 0);

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de votre espace enseignant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Espace Enseignant</h1>
        <p>Gerez vos cours et suivez vos etudiants</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">C</div>
          <div className="stat-info">
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Mes cours</div>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">E</div>
          <div className="stat-info">
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-label">Etudiants inscrits</div>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">R</div>
          <div className="stat-info">
            <div className="stat-value">{totalRevenue.toFixed(2)} EUR</div>
            <div className="stat-label">Revenus</div>
          </div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">A</div>
          <div className="stat-info">
            <div className="stat-value">{courses.filter(c => c.active).length}</div>
            <div className="stat-label">Cours actifs</div>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Actions */}
      <div className="section-header">
        <h2>Mes cours</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Nouveau cours
        </button>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">—</div>
          <h3>Aucun cours cree</h3>
          <p>Cliquez sur "Nouveau cours" pour commencer !</p>
        </div>
      ) : (
        <div className="teacher-courses-list">
          {courses.map((course) => {
            const enrs = courseEnrollments[course.id] || [];
            const paidCount = enrs.filter(e => e.paymentStatus === 'PAID').length;
            return (
              <div key={course.id} className={`card teacher-course-card ${!course.active ? 'inactive-course' : ''}`}>
                <div className="teacher-course-header">
                  <div>
                    <h3>{course.title}</h3>
                    <div className="teacher-course-tags">
                      <span className="course-category-tag">{course.category}</span>
                      <span className={`course-level-badge level-${course.level === 'Débutant' ? 'beginner' : course.level === 'Intermédiaire' ? 'intermediate' : 'advanced'}`}>
                        {course.level}
                      </span>
                      {!course.active && <span className="badge badge-inactive">Inactif</span>}
                    </div>
                  </div>
                  <div className="teacher-course-price">{course.price.toFixed(2)} EUR</div>
                </div>
                <p className="text-muted">{course.description}</p>
                <div className="teacher-course-stats">
                  <span>{enrs.length}/{course.maxStudents} inscrits</span>
                  <span>{paidCount} payes</span>
                  <span>{course.durationHours}h</span>
                </div>
                <div className="teacher-course-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => setViewStudents(course)}>
                    Etudiants
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => setEditCourse({ ...course })}>
                    Modifier
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCourse(course.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouveau cours</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateCourse} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Titre du cours</label>
                  <input type="text" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Prix (EUR)</label>
                  <input type="number" step="0.01" min="0" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Categorie</label>
                  <select value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}>
                    <option value="Testing">Testing</option>
                    <option value="Développement">Developpement</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Niveau</label>
                  <select value={newCourse.level} onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}>
                    <option value="Débutant">Debutant</option>
                    <option value="Intermédiaire">Intermediaire</option>
                    <option value="Avancé">Avance</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duree (heures)</label>
                  <input type="number" min="1" value={newCourse.durationHours} onChange={(e) => setNewCourse({ ...newCourse, durationHours: parseInt(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label>Places max.</label>
                  <input type="number" min="1" value={newCourse.maxStudents} onChange={(e) => setNewCourse({ ...newCourse, maxStudents: parseInt(e.target.value) })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                Creer le cours
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editCourse && (
        <div className="modal-overlay" onClick={() => setEditCourse(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modifier le cours</h2>
              <button className="modal-close" onClick={() => setEditCourse(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdateCourse} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Titre</label>
                  <input type="text" value={editCourse.title} onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Prix (EUR)</label>
                  <input type="number" step="0.01" min="0" value={editCourse.price} onChange={(e) => setEditCourse({ ...editCourse, price: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={editCourse.description} onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Categorie</label>
                  <select value={editCourse.category} onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}>
                    <option value="Testing">Testing</option>
                    <option value="Développement">Developpement</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Niveau</label>
                  <select value={editCourse.level} onChange={(e) => setEditCourse({ ...editCourse, level: e.target.value })}>
                    <option value="Débutant">Debutant</option>
                    <option value="Intermédiaire">Intermediaire</option>
                    <option value="Avancé">Avance</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duree (heures)</label>
                  <input type="number" min="1" value={editCourse.durationHours} onChange={(e) => setEditCourse({ ...editCourse, durationHours: parseInt(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label>Places max.</label>
                  <input type="number" min="1" value={editCourse.maxStudents} onChange={(e) => setEditCourse({ ...editCourse, maxStudents: parseInt(e.target.value) })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={editCourse.active} onChange={(e) => setEditCourse({ ...editCourse, active: e.target.checked })} />
                  Cours actif (visible dans le catalogue)
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                Mettre a jour
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Students Modal */}
      {viewStudents && (
        <div className="modal-overlay" onClick={() => setViewStudents(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Etudiants — {viewStudents.title}</h2>
              <button className="modal-close" onClick={() => setViewStudents(null)}>✕</button>
            </div>
            <div className="modal-body">
              {(courseEnrollments[viewStudents.id] || []).length === 0 ? (
                <div className="empty-state-sm">
                  <p>Aucun etudiant inscrit a ce cours.</p>
                </div>
              ) : (
                <div className="students-table">
                  <div className="table-header">
                    <span>Nom</span>
                    <span>Email</span>
                    <span>Statut</span>
                    <span>Date</span>
                  </div>
                  {(courseEnrollments[viewStudents.id] || []).map((enr) => (
                    <div key={enr.id} className="table-row">
                      <span>{enr.student?.name}</span>
                      <span className="text-muted">{enr.student?.email}</span>
                      <span>
                        {enr.paymentStatus === 'PAID' ? (
                          <span className="badge badge-paid">Paye</span>
                        ) : enr.paymentStatus === 'REFUNDED' ? (
                          <span className="badge badge-refunded">Rembourse</span>
                        ) : (
                          <span className="badge badge-pending">En attente</span>
                        )}
                      </span>
                      <span className="text-muted">
                        {new Date(enr.enrollmentDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
