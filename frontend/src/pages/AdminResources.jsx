import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const TYPES = ['lab', 'classroom', 'auditorium', 'sports', 'other'];
const EMPTY_FORM = { name: '', type: 'lab', description: '', capacity: '', location: '', isAvailable: true };

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const fetch = async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setError(''); setShowModal(true); };
  const openEdit = (r) => { setEditItem(r); setForm({ name: r.name, type: r.type, description: r.description || '', capacity: r.capacity || '', location: r.location || '', isAvailable: r.isAvailable }); setError(''); setShowModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editItem) {
        await api.put(`/resources/${editItem._id}`, form);
        toast('Resource updated!');
      } else {
        await api.post('/resources', form);
        toast('Resource created!');
      }
      setShowModal(false);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await api.delete(`/resources/${id}`);
      toast('Resource deleted');
      fetch();
    } catch {
      toast('Failed to delete', 'error');
    }
  };

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="fade-in">
      <div className="page-header slide-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h2>Manage Resources</h2><p>Add, edit, or remove college resources</p></div>
        <button id="add-resource-btn" className="btn btn-primary" onClick={openCreate}>+ Add Resource</button>
      </div>

      <div className="card">
        {resources.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🏫</div><p>No resources. Add one to get started.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Type</th><th>Location</th><th>Capacity</th><th>Available</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r._id}>
                    <td><strong>{r.name}</strong>{r.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.description}</div>}</td>
                    <td style={{ textTransform: 'capitalize' }}>{r.type}</td>
                    <td>{r.location || '—'}</td>
                    <td>{r.capacity || '—'}</td>
                    <td><span className={`badge ${r.isAvailable ? 'badge-approved' : 'badge-rejected'}`}>{r.isAvailable ? 'Yes' : 'No'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button id={`edit-resource-${r._id}`} className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>Edit</button>
                        <button id={`delete-resource-${r._id}`} className="btn btn-danger btn-sm" onClick={() => remove(r._id)}>Delete</button>
                      </div>
                    </td>
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
              <span className="modal-title">{editItem ? 'Edit Resource' : 'Add Resource'}</span>
              <button className="modal-close" id="close-resource-modal" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label" htmlFor="res-name">Name</label>
                <input id="res-name" className="form-input" type="text" placeholder="e.g. Computer Lab A"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="res-type">Type</label>
                  <select id="res-type" className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="res-capacity">Capacity</label>
                  <input id="res-capacity" className="form-input" type="number" placeholder="0"
                    value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="res-location">Location</label>
                <input id="res-location" className="form-input" type="text" placeholder="e.g. Block A, Floor 2"
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="res-desc">Description</label>
                <textarea id="res-desc" className="form-textarea" placeholder="Optional description"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input id="res-available" type="checkbox" checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
                <label htmlFor="res-available" style={{ fontSize: '0.88rem', color: 'var(--text)' }}>Available for booking</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button id="save-resource-btn" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : editItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
