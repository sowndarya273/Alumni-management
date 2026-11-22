import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import { api } from './api';

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await login(f.email, f.password); nav('/'); } catch (x) { setErr(x.message); }
  };
  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>Login</h2>
      {err && <p className="error">{err}</p>}
      <input placeholder="Email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input placeholder="Password" type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button className="primary">Login</button>
      <p>New here? <Link to="/register">Register</Link></p>
    </form>
  );
}

export function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'alumni' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await api('/auth/register', { method: 'POST', body: f }); alert('Registered! Please log in.'); nav('/login'); }
    catch (x) { setErr(x.message); }
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>Register</h2>
      {err && <p className="error">{err}</p>}
      <input placeholder="Full name" required value={f.name} onChange={set('name')} />
      <input placeholder="Email" type="email" required value={f.email} onChange={set('email')} />
      <input placeholder="Password (min 6)" type="password" required value={f.password} onChange={set('password')} />
      <select value={f.role} onChange={set('role')}>
        <option value="alumni">Alumni</option>
        <option value="student">Student</option>
      </select>
      <button className="primary">Create account</button>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
