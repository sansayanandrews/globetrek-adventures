import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Forbidden() {
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div>
          <span className="text-4xl font-extrabold text-amber-600 font-display">403</span>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-2">
            Restricted Area Access
          </h1>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">
            You do not possess the required permissions to view this operations area. This portal is restricted to authorized GlobeTrek staff and administrators.
          </p>
          {user && (
            <p className="text-[11px] text-slate-400 mt-2">
              Current account role: <strong className="uppercase text-slate-700">{user.role}</strong>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link
            to="/"
            className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link
            to="/login"
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}
