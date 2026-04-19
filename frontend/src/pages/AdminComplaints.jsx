import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['open', 'in-progress', 'resolved', 'closed'];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionModal, setActionModal] = useState(null);
  const [statusVal, setStatusVal] = useState('in-progress');
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const fetch = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openAction = (c) => {
    setActionModal(c);
    setStatusVal(c.status === 'open' ? 'in-progress' : c.status);
    setResponse(c.adminResponse || '');
  };

  const update = async () => {
    setSubmitting(true);
    try {
      await api.put(`/complaints/${actionModal._id}/status`, { status: statusVal, adminResponse: response });
      toast('Complaint updated!');
      setActionModal(null);
      fetch();
    } catch {
      toast('Failed to update', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filter === 'all' ? complaints : complaints.filter((c) => c.status === filter);

  if (loading) return <div className="loading">Loading complaints…</div>;

  return (
    <div className="fade-in">
      <div className="page-header slide-in">
        <h2>All Complaints</h2>
        <p>Review and respond to student complaints</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'open', 'in-progress', 'resolved', 'closed'].map((s) => (
          <button key={s} id={`filter-complaint-${s}`} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📢</div><p>No complaints found.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Student</th><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.user?.name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.user?.email}</div></td>
                    <td><strong>{c.title}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.description.substring(0, 60)}{c.description.length > 60 ? '…' : ''}</div></td>
                    <td style={{ textTransform: 'capitalize' }}>{c.category}</td>
                    <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                    <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button id={`action-complaint-${c._id}`} className="btn btn-secondary btn-sm" onClick={() => openAction(c)}>
                        Respond
                      </button>
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
              <span className="modal-title">Respond to Complaint</span>
              <button className="modal-close" id="close-complaint-action-modal" onClick={() => setActionModal(null)}>✕</button>
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>{actionModal.title}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>{actionModal.description}</p>
            <div className="form-group">
              <label className="form-label" htmlFor="complaint-status">Update Status</label>
              <select id="complaint-status" className="form-select" value={statusVal} onChange={(e) => setStatusVal(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-response">Admin Response</label>
              <textarea id="admin-response" className="form-textarea" placeholder="Write your response to the student…"
                value={response} onChange={(e) => setResponse(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActionModal(null)}>Cancel</button>
              <button id="update-complaint-btn" className="btn btn-primary" disabled={submitting} onClick={update}>
                {submitting ? 'Saving…' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
