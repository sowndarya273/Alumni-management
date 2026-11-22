import { useEffect, useState } from 'react';
import { api } from './api';
import { useAuth } from './auth.jsx';

const empty = { title: '', description: '', venue: '', event_date: '', status: 'published' };

export default function Events() {
  const { user } = useAuth();
  const admin = user.role === 'admin';
  const [list, setList] = useState([]);
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const load = () => api('/events' + (admin ? '?all=1' : '')).then(setList);
  useEffect(() => { load(); }, []);
  const run = async (fn) => { try { setMsg((await fn()).message); load(); } catch (e) { setMsg(e.message); } };

  const submit = (e) => {
    e.preventDefault();
    run(() => api(editId ? `/events/${editId}` : '/events', { method: editId ? 'PUT' : 'POST', body: f }));
    setF(empty); setEditId(null);
  };
  const edit = (ev) => { setEditId(ev.id); setF({ ...ev, event_date: ev.event_date.slice(0, 16).replace(' ', 'T') }); };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <>
      <h2>Events</h2>
      {msg && <p className="success">{msg}</p>}
      {admin && (
        <form className="card" onSubmit={submit}>
          <h3>{editId ? 'Edit event' : 'Create event'}</h3>
          <input placeholder="Title" required value={f.title} onChange={set('title')} />
          <input placeholder="Venue" value={f.venue || ''} onChange={set('venue')} />
          <input type="datetime-local" required value={f.event_date} onChange={set('event_date')} />
          <textarea placeholder="Description" value={f.description || ''} onChange={set('description')} />
          <select value={f.status} onChange={set('status')}><option value="published">Published</option><option value="draft">Draft</option></select>
          <div className="row">
            <button className="primary">{editId ? 'Update' : 'Create'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setF(empty); }}>Cancel</button>}
          </div>
        </form>
      )}
      <div className="cards">
        {list.map((ev) => (
          <div className="card" key={ev.id}>
            <h3>{ev.title} {ev.status === 'draft' && <span className="tag">Draft</span>}</h3>
            <p className="muted">🗓 {ev.event_date.slice(0, 16)} · 📍 {ev.venue || 'TBA'}</p>
            <p>{ev.description}</p>
            <p className="muted">{ev.registrations} registered</p>
            <div className="row">
              {ev.status === 'published' && (ev.registered
                ? <button onClick={() => run(() => api(`/events/${ev.id}/register`, { method: 'DELETE' }))}>Cancel registration</button>
                : <button className="primary" onClick={() => run(() => api(`/events/${ev.id}/register`, { method: 'POST' }))}>Register</button>)}
              {admin && <>
                <button onClick={() => edit(ev)}>Edit</button>
                <button className="danger" onClick={() => confirm('Delete event?') && run(() => api(`/events/${ev.id}`, { method: 'DELETE' }))}>Delete</button>
              </>}
            </div>
          </div>
        ))}
        {!list.length && <p>No events yet.</p>}
      </div>
    </>
  );
}
