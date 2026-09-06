import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Clock, User, ShieldCheck } from 'lucide-react';
import api from '../../api/client';

export default function QueryDetail() {
  const { id } = useParams();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuery() {
      setLoading(true);
      try {
        const res = await api.get(`/queries/${id}`);
        if (res.data.success) {
          setQuery(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load query:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuery();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!query) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold font-display text-slate-900">Inquiry Thread Not Found</h2>
        <Link to="/dashboard" className="mt-4 inline-block px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-400">Ticket #{query.id}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {query.category.replace(/_/g, ' ')}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  query.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {query.status}
              </span>
            </div>
            <h1 className="text-xl font-bold font-display text-slate-900">{query.subject}</h1>
          </div>
          <span className="text-xs text-slate-400">
            {new Date(query.created_at).toLocaleString()}
          </span>
        </div>

        {/* Customer Original Message */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <span>Your Inquiry:</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {query.message}
          </div>
        </div>

        {/* Official Staff Response */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Official Response from GlobeTrek Negombo Team:</span>
          </div>
          {query.staff_response ? (
            <div className="p-5 bg-teal-50/70 rounded-2xl border border-teal-200 text-xs sm:text-sm text-teal-950 leading-relaxed space-y-2">
              <p>{query.staff_response}</p>
              <div className="pt-2 border-t border-teal-100 flex justify-between text-[11px] text-teal-700">
                <span>Handled by: <strong>{query.assigned_staff?.full_name || 'Operations Agent'}</strong></span>
                {query.resolved_at && <span>Resolved on {new Date(query.resolved_at).toLocaleDateString()}</span>}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>This inquiry is currently assigned to our dispatch team and awaiting staff review.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
