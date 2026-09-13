import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Package, Calendar, MessageSquare, CheckCircle2,
  Clock, AlertCircle, ArrowRight, ShieldCheck, UserCheck
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState({
    pendingBookings: 0,
    activePackages: 0,
    openQueries: 0,
    totalBookings: 0
  });
  const [pendingBookingsList, setPendingBookingsList] = useState([]);
  const [openQueriesList, setOpenQueriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, pkgsRes, queriesRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/packages?all=true'),
        api.get('/queries')
      ]);

      const allBookings = bookingsRes.data.success ? bookingsRes.data.data : [];
      const allPackages = pkgsRes.data.success ? pkgsRes.data.data : [];
      const allQueries = queriesRes.data.success ? queriesRes.data.data : [];

      const pending = allBookings.filter((b) => b.status === 'pending');
      const openQ = allQueries.filter((q) => q.status === 'open');

      setStats({
        pendingBookings: pending.length,
        activePackages: allPackages.filter((p) => p.is_published).length,
        openQueries: openQ.length,
        totalBookings: allBookings.length
      });

      setPendingBookingsList(pending.slice(0, 5));
      setOpenQueriesList(openQ.slice(0, 5));
    } catch (err) {
      console.error('Failed to load staff dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleQuickConfirmBooking = async (id) => {
    try {
      const res = await api.patch(`/bookings/${id}/status`, {
        status: 'confirmed',
        coordination_notes: 'Confirmed by agency staff. Chauffeur and hotel vouchers validated.'
      });
      if (res.data.success) {
        addToast(`Booking #${id} confirmed successfully!`, 'success');
        fetchStaffData();
      }
    } catch (err) {
      addToast('Failed to confirm booking.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
            Agency Staff Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mt-2">
            Operations Center — Negombo Desk
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Logged in as <strong>{user?.full_name}</strong> ({user?.role.toUpperCase()}). Manage tour packages, review traveler bookings, and answer client queries.
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <Link
            to="/staff/packages"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" /> Manage Packages
          </Link>
          <Link
            to="/staff/bookings"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" /> Bookings Queue
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Review</span>
          <p className="text-3xl font-extrabold text-amber-600 font-display mt-1">{stats.pendingBookings}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Bookings awaiting confirmation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Active Packages</span>
          <p className="text-3xl font-extrabold text-blue-700 font-display mt-1">{stats.activePackages}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Published on public catalog</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Open Inquiries</span>
          <p className="text-3xl font-extrabold text-rose-600 font-display mt-1">{stats.openQueries}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Customer tickets to respond</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Agency Bookings</span>
          <p className="text-3xl font-extrabold text-slate-900 font-display mt-1">{stats.totalBookings}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Cumulative reservation ledger</span>
        </div>
      </div>

      {/* Action Queues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Bookings Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold font-display text-slate-900">
                Pending Bookings Queue
              </h2>
              <p className="text-xs text-slate-400">Needs hotel & chauffeur coordination confirmation</p>
            </div>
            <Link
              to="/staff/bookings"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ) : pendingBookingsList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All incoming bookings are currently processed and confirmed!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookingsList.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">#{b.id} • {b.customer?.full_name}</strong>
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold uppercase">
                        Pending
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 font-medium">{b.package?.title}</p>
                    <span className="text-slate-400 text-[11px]">
                      Date: {b.travel_date} • {b.num_travellers} Guests • {b.total_price_lkr.toLocaleString()} LKR
                    </span>
                  </div>

                  <button
                    onClick={() => handleQuickConfirmBooking(b.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shrink-0 shadow-2xs cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open Inquiries Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold font-display text-slate-900">
                Customer Support Queue
              </h2>
              <p className="text-xs text-slate-400">Unanswered customer questions & requests</p>
            </div>
            <Link
              to="/staff/queries"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              Go to Ticket Desk <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ) : openQueriesList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Inbox zero! No unaddressed inquiries at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {openQueriesList.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        {q.category.replace(/_/g, ' ')}
                      </span>
                      <strong className="text-slate-900">{q.subject}</strong>
                    </div>
                    <p className="text-slate-500 mt-1 line-clamp-1 italic">"{q.message}"</p>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      From: {q.customer?.full_name || 'Visitor'} • Ticket #{q.id}
                    </span>
                  </div>

                  <Link
                    to="/staff/queries"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shrink-0 shadow-2xs"
                  >
                    Reply
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
