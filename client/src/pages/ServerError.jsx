import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function ServerError() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertOctagon className="w-8 h-8" />
        </div>
        
        <div>
          <span className="text-4xl font-extrabold text-rose-600 font-display">500</span>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-2">
            Temporary System Interruption
          </h1>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">
            Our Negombo digital desk encountered an unexpected issue while processing your request. Our technical team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            to="/"
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
