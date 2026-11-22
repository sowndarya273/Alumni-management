import { useEffect, useState } from 'react';
import { api } from './api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
  const load = () => api('/admin/users').then(setUsers);
  useEffect(() => { load(); }, []);
  const run = async (fn) => { try { setMsg((await fn()).message); load(); } catch (e) { setMsg(e.message); } };

  return (
    <>
      <h2>User Management</h2>
      {msg && <p className="success">{msg}</p>}
      <div className="scroll">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => run(() => api(`/admin/users/${u.id}/role`, { method: 'PATCH', body: { role: e.target.value } }))}>
                    <option>admin</option><option>alumni</option><option>student</option>
                  </select>
                </td>
                <td><span className={'tag ' + u.status}>{u.status}</span></td>
                <td className="row">
                  <button onClick={() => run(() => api(`/admin/users/${u.id}/status`, { method: 'PATCH', body: { status: u.status === 'active' ? 'inactive' : 'active' } }))}>
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="danger" onClick={() => confirm('Delete user?') && run(() => api(`/admin/users/${u.id}`, { method: 'DELETE' }))}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
