import { useState } from 'react';
import { updateProfile } from '../api/api';

export default function ProfilePage({ user, onUpdateUser }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    password: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const updates = { name: form.name, email: form.email, phone: form.phone };
      if (form.password) updates.password = form.password;

      const updated = await updateProfile(user.id, updates);
      setMessage('Profil mis a jour avec succes !');
      if (onUpdateUser) onUpdateUser(updated);
      setForm({ ...form, password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mon Profil</h1>
        <p>Gerez vos informations personnelles</p>
      </div>

      <div className="profile-layout">
        {/* Profile Card */}
        <div className="card profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <h2>{user.name}</h2>
            <p className="text-muted">{user.email}</p>
            <span className={`badge ${user.role === 'TEACHER' ? 'badge-teacher' : 'badge-student'}`}>
              {user.role === 'TEACHER' ? 'Enseignant' : 'Etudiant'}
            </span>
          </div>
          <div className="profile-details">
            <div className="profile-detail-item">
              <span className="detail-label">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Telephone</span>
              <span>{user.phone || 'Non renseigne'}</span>
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Inscrit le</span>
              <span>
                {new Date(user.registrationDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card profile-edit-card">
          <h3>Modifier mes informations</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="profile-name">Nom complet</label>
              <input
                id="profile-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-email">Adresse email</label>
              <input
                id="profile-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-phone">Telephone</label>
              <input
                id="profile-phone"
                type="tel"
                name="phone"
                placeholder="+33 6 12 34 56 78"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
              <input
                id="profile-password"
                type="password"
                name="password"
                placeholder="Nouveau mot de passe"
                value={form.password}
                onChange={handleChange}
                minLength={4}
              />
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Mise a jour...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
