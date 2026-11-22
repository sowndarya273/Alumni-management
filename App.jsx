import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { Login, Register } from './Auth.jsx';
import Profile from './Profile.jsx';
import Directory from './Directory.jsx';
import Events from './Events.jsx';
import Jobs from './Jobs.jsx';
import Admin from './Admin.jsx';

function Guard({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (admin && user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="nav">
        <b>🎓 Alumni Portal</b>
        {user && (
          <>
            <NavLink to="/" end>Directory</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/jobs">Careers</NavLink>
            <NavLink to="/profile">My Profile</NavLink>
            {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            <span className="spacer" />
            <span className="muted">{user.name} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Guard><Directory /></Guard>} />
          <Route path="/events" element={<Guard><Events /></Guard>} />
          <Route path="/jobs" element={<Guard><Jobs /></Guard>} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />
          <Route path="/admin" element={<Guard admin><Admin /></Guard>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
