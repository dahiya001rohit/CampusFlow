import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const statusBadge = (status) => <span className={`badge badge-${status}`}>{status}</span>;

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast('Booking cancelled');
      fetch();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to cancel', 'error');
    }
  };

  if (loading) return <div className="loading">Loading bookings…</div>;

  return (
    <div className="fade-in">
      <div className="page-header slide-in">
        <h2>My Bookings</h2>
        <p>Track your resource booking requests</p>
      </div>

      <div className="card">
        {bookings.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📅</div><p>You have no bookings yet. Go to Resources to book one.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Purpose</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Admin Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td><strong>{b.resource?.name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.resource?.location}</div></td>
                    <td style={{ maxWidth: 180 }}>{b.purpose}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{new Date(b.startTime).toLocaleString()}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{new Date(b.endTime).toLocaleString()}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{b.adminNote || '—'}</td>
                    <td>
                      {b.status === 'pending' && (
                        <button id={`cancel-booking-${b._id}`} className="btn btn-danger btn-sm" onClick={() => cancel(b._id)}>
                          Cancel
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
    </div>
  );
}
