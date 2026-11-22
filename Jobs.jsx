import { useEffect, useState } from 'react';
import { api } from './api';
import { useAuth } from './auth.jsx';

const empty = { title: '', company: '', location: '', job_type: 'Full-time', description: '', requirements: '', apply_link: '', status: 'published' };

export default function Jobs() {
  const { user } = useAuth();
  const admin = user.role === 'admin';
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const load = () => api(`/jobs?search=${encodeURIComponent(search)}${admin ? '&all=1' : ''}`).then(setList);
  useEffect(() => { load(); }, []);
  const run = async (fn) => { try { setMsg((await fn()).message); load(); } catch (e) { setMsg(e.message); } };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    run(() => api(editId ? `/jobs/${editId}` : '/jobs', { method: editId ? 'PUT' : 'POST', body: f }));
    setF(empty); setEditId(null);
  };

  return (
    <>
      <h2>Career Opportunities</h2>
      {msg && <p className="success">{msg}</p>}
      <form className="row" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input placeholder="Search title, company, location" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="primary">Search</button>
      </form>
      {admin && (
        <form className="card" onSubmit={submit}>
          <h3>{editId ? 'Edit job' : 'Post a job'}</h3>
          <div className="grid">
            <input placeholder="Job title" required value={f.title} onChange={set('title')} />
            <input placeholder="Company" required value={f.company} onChange={set('company')} />
            <input placeholder="Location" value={f.location || ''} onChange={set('location')} />
            <select value={f.job_type} onChange={set('job_type')}>
              {['Full-time', 'Part-time', 'Internship', 'Contract'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <input placeholder="Application link" value={f.apply_link || ''} onChange={set('apply_link')} />
            <select value={f.status} onChange={set('status')}><option value="published">Published</option><option value="draft">Draft</option></select>
          </div>
          <textarea placeholder="Description" value={f.description || ''} onChange={set('description')} />
          <textarea placeholder="Requirements" value={f.requirements || ''} onChange={set('requirements')} />
          <div className="row">
            <button className="primary">{editId ? 'Update' : 'Post'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setF(empty); }}>Cancel</button>}
          </div>
        </form>
      )}
      <div className="cards">
        {list.map((j) => (
          <div className="card" key={j.id}>
            <h3>{j.title} {j.status === 'draft' && <span className="tag">Draft</span>}</h3>
            <p className="muted">{j.company} · {j.location || 'Remote/NA'} · {j.job_type}</p>
            <p>{j.description}</p>
            {j.requirements && <p><b>Requirements:</b> {j.requirements}</p>}
            <div className="row">
              {j.apply_link && <a className="btn primary" href={j.apply_link} target="_blank" rel="noreferrer">Apply</a>}
              {admin && <>
                <button onClick={() => { setEditId(j.id); setF(j); }}>Edit</button>
                <button className="danger" onClick={() => confirm('Delete job?') && run(() => api(`/jobs/${j.id}`, { method: 'DELETE' }))}>Delete</button>
              </>}
            </div>
          </div>
        ))}
        {!list.length && <p>No jobs found.</p>}
      </div>
    </>
  );
}
