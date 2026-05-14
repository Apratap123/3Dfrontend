import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-morphism" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '20px', zIndex: 100 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text)', fontWeight: 'bold', fontSize: '1.5rem' }}>
        <Box size={32} color="var(--primary)" />
        <span className="gradient-text">Visi3D</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-secondary">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 15px', borderRadius: '20px', background: 'var(--surface)' }}>
              <UserIcon size={18} color="var(--text-muted)" />
              <span style={{ fontSize: '0.9rem' }}>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ color: 'var(--error)' }}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
