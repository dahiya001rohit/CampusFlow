import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

// Modal for creating a booking
function BookingModal({ resource, onClose, onSuccess }) {
  const toast = useToast();
  const [form, setForm] = useState({ startTime: '', endTime: '', purpose: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/bookings', { resourceId: resource._id, ...form });
      toast('Booking request submitted!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Book: {resource.name}</span>
          <button className="modal-close" id="close-booking-modal" onClick={onClose}>✕</button>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="start-time">Start Time</label>
            <input id="start-time" className="form-input" type="datetime-local"
              value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="end-time">End Time</label>
            <input id="end-time" className="form-input" type="datetime-local"
              value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="purpose">Purpose</label>
            <textarea id="purpose" className="form-textarea" placeholder="Describe why you need this resource…"
              value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="submit-booking" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchResources = async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  if (loading) return <div className="loading">Loading resources…</div>;

  return (
    <div className="fade-in">
      <div className="page-header slide-in">
        <h2>Available Resources</h2>
        <p>Select a resource to request a booking</p>
      </div>

      {resources.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">🏫</div><p>No resources available yet.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {resources.map((r) => (
            <div key={r._id} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div className="card-title">{r.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, textTransform: 'capitalize' }}>{r.type}</div>
                </div>
                <span className={`badge ${r.isAvailable ? 'badge-approved' : 'badge-rejected'}`}>
                  {r.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              {r.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>{r.description}</p>}
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                {r.capacity > 0 && <span>👥 {r.capacity} seats </span>}
                {r.location && <span>📍 {r.location}</span>}
              </div>
              <button
                id={`book-${r._id}`}
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={!r.isAvailable}
                onClick={() => setSelected(r)}
              >
                Request Booking
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <BookingModal
          resource={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
