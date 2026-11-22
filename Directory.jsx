import { useEffect, useState } from 'react';
import { api } from './api';

export default function Directory() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState({ search: '', year: '', department: '' });
  const load = () => api('/alumni?' + new URLSearchParams(q)).then(setList);
  useEffect(() => { load(); }, []);
  return (
    <>
      <h2>Alumni Directory</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input placeholder="Search name, company, role, city" value={q.search} onChange={(e) => setQ({ ...q, search: e.target.value })} />
        <input placeholder="Year" value={q.year} onChange={(e) => setQ({ ...q, year: e.target.value })} />
        <input placeholder="Department" value={q.department} onChange={(e) => setQ({ ...q, department: e.target.value })} />
        <button className="primary">Search</button>
      </form>
      <div className="cards">
        {list.map((a) => (
          <div className="card" key={a.id}>
            <h3>{a.name}</h3>
            <p className="muted">{[a.degree, a.department, a.graduation_year].filter(Boolean).join(' · ')}</p>
            <p>{[a.job_title, a.company].filter(Boolean).join(' at ')}</p>
            {a.location && <p>📍 {a.location}</p>}
            <p>✉️ {a.email}</p>
            {a.linkedin && <a href={a.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          </div>
        ))}
        {!list.length && <p>No alumni found.</p>}
      </div>
    </>
  );
}
