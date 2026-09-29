import { useState } from 'react';
import { login } from '../api/api';

export default function LoginPage({ onLogin, onSwitchToRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(form.email, form.password);
      onLogin(user);
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
          <h1>Connexion</h1>
          <p>Accedez a votre espace EduEnroll</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Adresse email</label>
            <div className="input-icon-wrapper">
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Mot de passe</label>
            <div className="input-icon-wrapper">
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Votre mot de passe"
                value={form.password}
                onChange={handleChange}
                required
                minLength={4}
              />
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?{' '}
            <button className="link-btn" onClick={onSwitchToRegister}>
              Creer un compte
            </button>
          </p>
        </div>

        <div className="auth-demo-accounts">
          <p className="demo-title">Comptes de demonstration :</p>
          <div className="demo-grid">
            <div className="demo-account" onClick={() => setForm({ email: 'marie.laurent@eduenroll.com', password: 'teacher123' })}>
              <span className="demo-role">Enseignant</span>
              <span className="demo-email">marie.laurent@eduenroll.com</span>
            </div>
            <div className="demo-account" onClick={() => setForm({ email: 'ahmed.benali@eduenroll.com', password: 'teacher123' })}>
              <span className="demo-role">Enseignant</span>
              <span className="demo-email">ahmed.benali@eduenroll.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
