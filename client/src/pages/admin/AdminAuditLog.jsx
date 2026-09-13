import React, { useState, useEffect } from 'react';
import { Activity, Search, ShieldCheck, User, Calendar, Clock } from 'lucide-react';
import api from '../../api/client';

export default function AdminAuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const res = await api.get('/admin/audit-logs');
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target_type.toLowerCase().includes(search.toLowerCase()) ||
      l.actor?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.actor?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Security & Compliance
        </span>
        <h1 className="text-3xl font-bold font-display text-slate-900 mt-2">
          System Audit Trail & Access History
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Chronological record of all staff and administrator actions across tour packages, reservations, and accounts.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 shadow-2xs"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Logged Events: <strong>{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action Event</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">Target Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <strong className="text-slate-900 block">{log.actor?.full_name}</strong>
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {log.actor?.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.action.includes('CONFIRMED') || log.action.includes('ACTIVATED')
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action.includes('CREATED')
                          ? 'bg-blue-100 text-blue-800'
                          : log.action.includes('CANCEL') || log.action.includes('DEACTIVATED')
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {log.target_type}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
                    {log.target_id ? `#${log.target_id}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
