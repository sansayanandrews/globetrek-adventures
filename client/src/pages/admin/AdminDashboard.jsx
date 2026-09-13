import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, DollarSign, Calendar, TrendingUp,
  FileText, Activity, ArrowRight, Download, CheckCircle2
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const overview = stats?.overview || {
    totalRevenueLKR: 0,
    totalBookingsCount: 0,
    pendingBookingsCount: 0,
    confirmedBookingsCount: 0,
    totalCustomersCount: 0,
    totalPackagesCount: 0,
    openQueriesCount: 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
            Executive Control Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mt-2">
            Administrator Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Welcome, <strong>{user?.full_name}</strong>. Monitor agency revenue, manage staff access credentials, and review security audit trails.
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4" /> Reports & Analytics
          </Link>
          <a
            href="/api/admin/export-csv"
            download
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Total Agency Revenue</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-display mt-1">
            {overview.totalRevenueLKR.toLocaleString()} <span className="text-xs font-normal text-slate-500">LKR</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">From confirmed & paid bookings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Master Bookings</span>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-1">{overview.totalBookingsCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">{overview.confirmedBookingsCount} confirmed trips</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Registered Travelers</span>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-1">{overview.totalCustomersCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active customer accounts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Active Tour Packages</span>
          <p className="text-3xl font-extrabold text-amber-600 font-display mt-1">{overview.totalPackagesCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Published on public site</span>
        </div>
      </div>

      {/* Admin Modules Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/staff"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-blue-600 transition-colors">
            Staff Account Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Create staff accounts, manage roles, and activate/deactivate user credentials.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 mt-4">
            Manage Staff <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-amber-600 transition-colors">
            Master Booking Oversight
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Cross-business ledger of all customer reservations, filterable by destination and date.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 mt-4">
            View All Bookings <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-blue-600 transition-colors">
            Reports & Business Analytics
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Revenue trends, bookings by destination charts, and customer acquisition graphs.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 mt-4">
            Open Analytics <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          to="/admin/audit-log"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-slate-900 transition-colors">
            Security Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of all staff and admin actions (package changes, booking statuses).
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 mt-4">
            Review Logs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

    </div>
  );
}
