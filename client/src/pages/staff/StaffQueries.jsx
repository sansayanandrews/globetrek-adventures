import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Search, Filter, CheckCircle2, Clock, Send,
  X, User, Mail, ShieldCheck, AlertCircle
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function StaffQueries() {
  const { addToast } = useToast();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Response Modal State
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [statusInput, setStatusInput] = useState('resolved');
  const [submitting, setSubmitting] = useState(false);

  const loadQueries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/queries');
      if (res.data.success) {
        setQueries(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load queries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const openResponseModal = (q) => {
    setSelectedQuery(q);
    setResponseText(q.staff_response || '');
    setStatusInput(q.status === 'open' ? 'resolved' : q.status);
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      addToast('Please enter a response message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.patch(`/queries/${selectedQuery.id}/respond`, {
        staff_response: responseText.trim(),
        status: statusInput
      });

      if (res.data.success) {
        addToast(`Response recorded for Ticket #${selectedQuery.id}!`, 'success');
        setSelectedQuery(null);
        loadQueries();
      }
    } catch (err) {
      addToast('Failed to post reply.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = queries.filter((q) => {
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      q.subject.toLowerCase().includes(s) ||
      q.message.toLowerCase().includes(s) ||
      q.customer?.full_name?.toLowerCase().includes(s) ||
      q.id.toString().includes(s);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Client Support Desk
        </span>
        <h1 className="text-3xl font-bold font-display text-slate-900 mt-2">
          Customer Inquiries & Support Tickets
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Review questions submitted via public contact or traveler dashboards and dispatch verified staff replies.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          {['All', 'open', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-lg font-bold font-display text-slate-900">No Inquiries In This Category</h3>
          </div>
        ) : (
          filtered.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Ticket #{q.id}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {q.category.replace(/_/g, ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      q.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Logged on {new Date(q.created_at).toLocaleString()}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">{q.subject}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sender: <strong>{q.customer?.full_name || 'Anonymous Visitor'}</strong> ({q.customer?.email || 'No email'})
                </p>
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  "{q.message}"
                </div>
              </div>

              {q.staff_response && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-blue-950 block">
                    Recorded Staff Reply (by {q.assigned_staff?.full_name || 'Agent'}):
                  </span>
                  <p className="text-blue-900">{q.staff_response}</p>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => openResponseModal(q)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" /> {q.staff_response ? 'Update Staff Response' : 'Draft Response'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-100 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedQuery(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                Support Desk Reply
              </span>
              <h2 className="text-xl font-bold font-display text-slate-900 mt-2">
                Reply to Ticket #{selectedQuery.id}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Subject: {selectedQuery.subject}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
              "{selectedQuery.message}"
            </div>

            <form onSubmit={handleSendResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Official Staff Response *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Dear traveler, thank you for reaching out to GlobeTrek Adventures Negombo..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Set Ticket Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="resolved">Resolved (Customer notified)</option>
                  <option value="in_progress">In Progress (Follow-up needed)</option>
                  <option value="open">Open</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> {submitting ? 'Saving...' : 'Send Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
