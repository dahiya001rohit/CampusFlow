import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionModal, setActionModal] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const fetch = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (status) => {
    setSubmitting(true);
    try {
      await api.put(`/bookings/${actionModal._id}/status`, { status, adminNote: note });
      toast(`Booking ${status}!`);
      setActionModal(null);
      setNote('');
      fetch();
    } catch {
      toast('Failed to update', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <div className="loading">Loading bookings…</div>;

  return (
    <div className="fade-in">
      <div className="page-header slide-in">
        <h2>All Bookings</h2>
        <p>Review and approve or reject booking requests</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected', 'cancelled'].map((s) => (
          <button key={s} id={`filter-${s}`} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📅</div><p>No bookings found.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Student</th><th>Resource</th><th>Purpose</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id}>
                    <td><strong>{b.user?.name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user?.email}</div></td>
                    <td>{b.resource?.name}</td>
                    <td style={{ maxWidth: 160 }}>{b.purpose}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{new Date(b.startTime).toLocaleString()}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{new Date(b.endTime).toLocaleString()}</td>
                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    <td>
                      {b.status === 'pending' && (
                        <button id={`action-booking-${b._id}`} className="btn btn-secondary btn-sm" onClick={() => { setActionModal(b); setNote(''); }}>
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {actionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Review Booking</span>
              <button className="modal-close" id="close-booking-action-modal" onClick={() => setActionModal(null)}>✕</button>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 4 }}>
              <strong style={{ color: 'var(--text)' }}>{actionModal.user?.name}</strong> — {actionModal.resource?.name}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>{actionModal.purpose}</p>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-note">Admin Note (optional)</label>
              <textarea id="admin-note" className="form-textarea" placeholder="Reason for decision…"
                value={note} onChange={(e) => setNote(e.target.value)} style={{ minHeight: 60 }} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActionModal(null)}>Cancel</button>
              <button id="reject-booking-btn" className="btn btn-danger" disabled={submitting} onClick={() => updateStatus('rejected')}>Reject</button>
              <button id="approve-booking-btn" className="btn btn-success" disabled={submitting} onClick={() => updateStatus('approved')}>Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
