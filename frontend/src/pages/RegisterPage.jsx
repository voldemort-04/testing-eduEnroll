import { useState } from 'react';
import { register } from '../api/api';

export default function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'STUDENT' });
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
      const user = await register(form);
      setMessage(`Inscription reussie ! Bienvenue ${user.name}`);
      // Auto-login after registration
      setTimeout(() => {
        if (onRegister) onRegister(user);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">EduEnroll</div>
          <h1>Creer un compte</h1>
          <p>Rejoignez EduEnroll des maintenant</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name">Nom complet</label>
            <div className="input-icon-wrapper">
              <input
                id="reg-name"
                type="text"
                name="name"
                placeholder="Jean Dupont"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Adresse email</label>
            <div className="input-icon-wrapper">
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="jean@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone">Telephone (optionnel)</label>
            <div className="input-icon-wrapper">
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                placeholder="+33 6 12 34 56 78"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Mot de passe</label>
            <div className="input-icon-wrapper">
              <input
                id="reg-password"
                type="password"
                name="password"
                placeholder="Minimum 4 caracteres"
                value={form.password}
                onChange={handleChange}
                required
                minLength={4}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-role">Type de compte</label>
            <select
              id="reg-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="select-input"
            >
              <option value="STUDENT">Etudiant</option>
              <option value="TEACHER">Enseignant</option>
            </select>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Deja un compte ?{' '}
            <button className="link-btn" onClick={onSwitchToLogin}>
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
