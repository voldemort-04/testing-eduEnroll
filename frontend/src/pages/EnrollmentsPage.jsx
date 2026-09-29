import { useState, useEffect } from 'react';
import { getEnrollmentsByStudent, processPayment, processRefund } from '../api/api';

export default function EnrollmentsPage({ user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CARD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, [user.id]);

  const loadEnrollments = async () => {
    try {
      const data = await getEnrollmentsByStudent(user.id);
      setEnrollments(data);
    } catch (err) {
      setError('Erreur de chargement des inscriptions');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (enrollment) => {
    setPaymentModal(enrollment);
    setSelectedPaymentMethod('CARD');
  };

  const handlePayment = async () => {
    if (!paymentModal) return;
    setLoadingId(paymentModal.id);
    setMessage(null);
    setError(null);

    try {
      await processPayment(paymentModal.id, selectedPaymentMethod);
      setMessage('Paiement effectue avec succes !');
      setPaymentModal(null);
      loadEnrollments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRefund = async (enrollmentId) => {
    setLoadingId(enrollmentId);
    setMessage(null);
    setError(null);

    try {
      await processRefund(enrollmentId);
      setMessage('Remboursement effectue avec succes');
      loadEnrollments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="badge badge-paid">Paye</span>;
      case 'REFUNDED':
        return <span className="badge badge-refunded">Rembourse</span>;
      default:
        return <span className="badge badge-pending">En attente</span>;
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de vos inscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mes Inscriptions</h1>
        <p>Gerez vos inscriptions et effectuez vos paiements</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {enrollments.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">—</div>
          <h3>Aucune inscription</h3>
          <p>Allez dans "Cours" pour vous inscrire a un cours !</p>
        </div>
      ) : (
        <div className="enrollments-list">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="card enrollment-card">
              <div className="enrollment-info">
                <div className="enrollment-details">
                  <h3>{enrollment.course?.title || 'Cours'}</h3>
                  <p className="enrollment-student">
                    {enrollment.course?.teacherName || 'Enseignant'}
                  </p>
                  <p className="enrollment-date">
                    {new Date(enrollment.enrollmentDate).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {enrollment.paymentMethod && (
                    <p className="enrollment-method">
                      Paye par {enrollment.paymentMethod === 'CARD' ? 'Carte bancaire' :
                        enrollment.paymentMethod === 'PAYPAL' ? 'PayPal' : 'Virement bancaire'}
                    </p>
                  )}
                </div>
                <div className="enrollment-actions">
                  <div className="enrollment-price">
                    {enrollment.course?.price?.toFixed(2)} EUR
                  </div>
                  {getStatusBadge(enrollment.paymentStatus)}
                  {enrollment.paymentStatus === 'PENDING' && (
                    <button
                      className="btn btn-pay"
                      onClick={() => openPaymentModal(enrollment)}
                      disabled={loadingId === enrollment.id}
                    >
                      {loadingId === enrollment.id ? 'Traitement...' : 'Payer'}
                    </button>
                  )}
                  {enrollment.paymentStatus === 'PAID' && (
                    <button
                      className="btn btn-refund"
                      onClick={() => handleRefund(enrollment.id)}
                      disabled={loadingId === enrollment.id}
                    >
                      {loadingId === enrollment.id ? '...' : 'Rembourser'}
                    </button>
                  )}
                </div>
              </div>
              {enrollment.paymentStatus === 'PAID' && (
                <div className="progress-bar-container" style={{ marginTop: '1rem' }}>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${enrollment.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-label">{enrollment.progress || 0}% complete</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && (
        <div className="modal-overlay" onClick={() => setPaymentModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Paiement</h2>
              <button className="modal-close" onClick={() => setPaymentModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="payment-summary">
                <h3>{paymentModal.course?.title}</h3>
                <div className="payment-amount">{paymentModal.course?.price?.toFixed(2)} EUR</div>
              </div>

              <div className="payment-methods">
                <label className="payment-method-label">Methode de paiement :</label>
                <div className="payment-method-options">
                  <label className={`payment-option ${selectedPaymentMethod === 'CARD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={selectedPaymentMethod === 'CARD'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span className="payment-option-icon">CB</span>
                    <span>Carte bancaire</span>
                  </label>
                  <label className={`payment-option ${selectedPaymentMethod === 'PAYPAL' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAYPAL"
                      checked={selectedPaymentMethod === 'PAYPAL'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span className="payment-option-icon">PP</span>
                    <span>PayPal</span>
                  </label>
                  <label className={`payment-option ${selectedPaymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={selectedPaymentMethod === 'BANK_TRANSFER'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span className="payment-option-icon">VB</span>
                    <span>Virement bancaire</span>
                  </label>
                </div>
              </div>

              <button
                className="btn btn-pay btn-full"
                onClick={handlePayment}
                disabled={loadingId === paymentModal.id}
              >
                {loadingId === paymentModal.id ? 'Traitement en cours...' : `Payer ${paymentModal.course?.price?.toFixed(2)} EUR`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
