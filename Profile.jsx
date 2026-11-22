import { useEffect, useState } from 'react';
import { api } from './api';

const FIELDS = [
  ['name', 'Full name'], ['phone', 'Phone'], ['graduation_year', 'Graduation year'], ['department', 'Department'],
  ['degree', 'Degree'], ['company', 'Company'], ['job_title', 'Job title'], ['location', 'Location'], ['linkedin', 'LinkedIn URL']
];

export default function Profile() {
  const [p, setP] = useState(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { api('/profile').then(setP); }, []);
  if (!p) return <p>Loading...</p>;
  const save = async (e) => {
    e.preventDefault();
    try { setMsg((await api('/profile', { method: 'PUT', body: p })).message); } catch (x) { setMsg(x.message); }
  };
  return (
    <form className="card" onSubmit={save}>
      <h2>My Profile</h2>
      <p className="muted">{p.email} · {p.role}</p>
      {msg && <p className="success">{msg}</p>}
      <div className="grid">
        {FIELDS.map(([k, label]) => (
          <label key={k}>{label}
            <input value={p[k] ?? ''} onChange={(e) => setP({ ...p, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      <label>Bio<textarea rows="4" value={p.bio ?? ''} onChange={(e) => setP({ ...p, bio: e.target.value })} /></label>
      <button className="primary">Save</button>
    </form>
  );
}
