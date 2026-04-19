import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'other' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const fetch = async () => {
    try {
      const { data } = await api.get('/complaints/my');
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/complaints', form);
      toast('Complaint raised successfully!');
      setShowModal(false);
      setForm({ title: '', description: '', category: 'other' });
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => <span className={`badge badge-${status}`}>{status}</span>;

  if (loading) return <div className="loading">Loading complaints…</div>;

  return (
    <div className="fade-in">
      <div className="page-header slide-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>My Complaints</h2>
          <p>Track the status of your raised complaints</p>
        </div>
        <button id="raise-complaint-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>+ Raise Complaint</button>
      </div>

      <div className="card">
        {complaints.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📢</div><p>No complaints yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Category</th><th>Status</th><th>Admin Response</th><th>Date</th></tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.title}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.description}</div></td>
                    <td style={{ textTransform: 'capitalize' }}>{c.category}</td>
                    <td>{statusBadge(c.status)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{c.adminResponse || '—'}</td>
                    <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Raise a Complaint</span>
              <button className="modal-close" id="close-complaint-modal" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label" htmlFor="complaint-title">Title</label>
                <input id="complaint-title" className="form-input" type="text" placeholder="Brief issue title"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="complaint-category">Category</label>
                <select id="complaint-category" className="form-select"
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="academics">Academics</option>
                  <option value="hostel">Hostel</option>
                  <option value="facilities">Facilities</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="complaint-desc">Description</label>
                <textarea id="complaint-desc" className="form-textarea" placeholder="Describe your complaint in detail…"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button id="submit-complaint" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
