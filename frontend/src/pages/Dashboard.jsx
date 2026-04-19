import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const statusBadge = (status) => <span className={`badge badge-${status}`}>{status}</span>;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStats(data);
      } catch {
        setStats({});
      }
    };
    fetchStats();
  }, [user]);

  const isAdmin = user?.role === 'admin';

  return (
    <div>
      <div className="page-header slide-in">
        <h2>Welcome back, {user?.name} 👋</h2>
        <p>{isAdmin ? 'Admin Dashboard – manage resources, bookings & complaints' : 'Track your bookings and complaints'}</p>
      </div>

      {stats === null ? (
        <div className="loading pulse">Loading stats…</div>
      ) : (
        <>
          <div className="stats-grid fade-in">
            {isAdmin ? (
              <>
                <div className="stat-card hover-glow">
                  <span className="stat-label">Total Resources</span>
                  <span className="stat-value">{stats.totalResources ?? 0}</span>
                </div>
                <div className="stat-card hover-glow">
                  <span className="stat-label">Total Bookings</span>
                  <span className="stat-value">{stats.bookings?.total ?? 0}</span>
                </div>
                <div className="stat-card hover-glow warning-glow">
                  <span className="stat-label">Pending Bookings</span>
                  <span className="stat-value text-warning">{stats.bookings?.pending ?? 0}</span>
                  <span className="stat-sub">Awaiting approval</span>
                </div>
                <div className="stat-card hover-glow info-glow">
                  <span className="stat-label">Open Complaints</span>
                  <span className="stat-value text-info">{(stats.complaints?.open ?? 0) + (stats.complaints?.inProgress ?? 0)}</span>
                  <span className="stat-sub">Need attention</span>
                </div>
              </>
            ) : (
              <>
                <div className="stat-card hover-glow">
                  <span className="stat-label">My Bookings</span>
                  <span className="stat-value">{stats.bookings?.total ?? 0}</span>
                </div>
                <div className="stat-card hover-glow warning-glow">
                  <span className="stat-label">Pending</span>
                  <span className="stat-value text-warning">{stats.bookings?.pending ?? 0}</span>
                </div>
                <div className="stat-card hover-glow success-glow">
                  <span className="stat-label">Approved</span>
                  <span className="stat-value text-success">{stats.bookings?.approved ?? 0}</span>
                </div>
                <div className="stat-card hover-glow info-glow">
                  <span className="stat-label">Active Complaints</span>
                  <span className="stat-value text-info">{(stats.complaints?.open ?? 0) + (stats.complaints?.inProgress ?? 0)}</span>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginTop: '32px' }} className="fade-in">
            <div className="card panel">
              <div className="card-header">
                <span className="card-title">Recent Bookings</span>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(isAdmin ? '/admin/bookings' : '/my-bookings')}>View All</button>
              </div>
              {stats.recentBookings && stats.recentBookings.length > 0 ? (
                <div className="list-group">
                  {stats.recentBookings.map((b) => (
                    <div key={b._id} className="list-item">
                      <div className="list-item-content">
                        <strong>{b.resource?.name}</strong>
                        <span className="text-muted text-sm d-block">{new Date(b.startTime).toLocaleString()}</span>
                      </div>
                      {statusBadge(b.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No recent bookings.</p>
              )}
            </div>

            <div className="card panel">
              <div className="card-header">
                <span className="card-title">Recent Complaints</span>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(isAdmin ? '/admin/complaints' : '/my-complaints')}>View All</button>
              </div>
              {stats.recentComplaints && stats.recentComplaints.length > 0 ? (
                <div className="list-group">
                  {stats.recentComplaints.map((c) => (
                    <div key={c._id} className="list-item">
                      <div className="list-item-content">
                        <strong>{c.title}</strong>
                        <span className="text-muted text-sm d-block">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      {statusBadge(c.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No recent complaints.</p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="card glass-panel fade-in" style={{ marginTop: '32px' }}>
        <div className="card-header">
          <span className="card-title">Quick Actions</span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {isAdmin ? (
            <>
              <button id="quick-manage-resources" className="btn btn-primary" onClick={() => navigate('/admin/resources')}>Manage Resources</button>
              <button id="quick-all-bookings" className="btn btn-secondary" onClick={() => navigate('/admin/bookings')}>Review Bookings</button>
              <button id="quick-all-complaints" className="btn btn-secondary" onClick={() => navigate('/admin/complaints')}>Review Complaints</button>
            </>
          ) : (
            <>
              <button id="quick-book" className="btn btn-primary shadow-glow" onClick={() => navigate('/resources')}>Book a Resource</button>
              <button id="quick-complaint" className="btn btn-secondary" onClick={() => navigate('/my-complaints')}>Raise Complaint</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
