import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-8 h-8 animate-spin duration-3000" />
        </div>
        
        <div>
          <span className="text-4xl font-extrabold text-blue-700 font-display">404</span>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-2">
            You�ve Wandered Off The Trail
          </h1>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">
            The page or destination you are seeking does not exist or has been relocated along another Sri Lankan path.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link
            to="/"
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/packages"
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Search className="w-4 h-4" /> Browse Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
