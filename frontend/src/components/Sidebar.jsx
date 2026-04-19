import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/resources', label: 'Resources', icon: '🏫' },
  { to: '/my-bookings', label: 'My Bookings', icon: '📅' },
  { to: '/my-complaints', label: 'My Complaints', icon: '📢' },
];

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/resources', label: 'Manage Resources', icon: '🏫' },
  { to: '/admin/bookings', label: 'All Bookings', icon: '📅' },
  { to: '/admin/complaints', label: 'All Complaints', icon: '📢' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Campus<span>Flow</span></h1>
      </div>

      <div className="nav-section-label">Navigation</div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <span>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}

      <div className="sidebar-bottom">
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 12, width: '100%' }} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
