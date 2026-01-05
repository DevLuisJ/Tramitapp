import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Car, ClipboardList, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Usuarios', path: '/users' },
    { icon: <Users size={20} />, label: 'Clientes', path: '/clients' },
    { icon: <Car size={20} />, label: 'Vehículos', path: '/vehicles' },
    { icon: <ClipboardList size={20} />, label: 'Trámites', path: '/procedures' },
    { icon: <Settings size={20} />, label: 'Reportes', path: '/reports' },
  ];

  return (
    <aside className="sidebar glass-panel" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50
    }}>
      <div className="logo-container" style={{ marginBottom: '3rem', padding: '0 1rem' }}>
        <h2 style={{
          background: 'linear-gradient(to right, var(--primary), var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.5rem',
          fontWeight: '800'
        }}>
          AutoManager
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Concesionario Admin</p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: isActive ? 'white' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary)' : 'transparent',
              transition: 'all var(--transition-fast)',
              fontSize: '0.95rem',
              fontWeight: '500'
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            padding: '0.8rem 1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--danger)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.95rem'
          }}
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
