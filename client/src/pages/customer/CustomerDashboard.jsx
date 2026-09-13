import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, CreditCard, Clock, MessageSquare, Bell,
  User, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, ExternalLink
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [queries, setQueries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [bookingsRes, queriesRes, notifsRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/queries/my'),
          api.get('/notifications')
        ]);

        if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
        if (queriesRes.data.success) setQueries(queriesRes.data.data);
        if (notifsRes.data.success) setNotifications(notifsRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleMarkNotificationRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-900/40 px-2.5 py-1 rounded-md border border-amber-600/30">
            Traveler Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mt-2">
            Ayubowan, {user?.full_name || 'Traveler'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Manage your Sri Lankan holiday reservations, track hotel coordination, and submit custom requests.
          </p>
        </div>

        <Link
          to="/packages"
          className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm shrink-0 transition-all"
        >
          <Sparkles className="w-4 h-4" /> Book New Adventure
        </Link>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Bookings</span>
          <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">{bookings.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-blue-600">Confirmed Trips</span>
          <p className="text-2xl font-extrabold text-blue-700 font-display mt-1">{confirmedBookings.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-amber-600">Pending Review</span>
          <p className="text-2xl font-extrabold text-amber-600 font-display mt-1">{pendingBookings.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Support Inquiries</span>
          <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">{queries.length}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'border-b-2 border-blue-600 text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> My Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('queries')}
          className={`pb-3 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'queries'
              ? 'border-b-2 border-blue-600 text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Inquiries & Support ({queries.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-b-2 border-blue-600 text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications ({notifications.filter((n) => !n.is_read).length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-600 text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" /> Profile Info
        </button>
      </div>

      {/* Tab 1: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold font-display text-slate-900">No Bookings Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                You haven't booked any Sri Lankan tour packages yet. Browse our catalog to get started.
              </p>
              <Link to="/packages" className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm">
                Browse Tour Packages
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Booking #{b.id}</span>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        ? {b.status}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Payment: {b.payment_status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-slate-900">
                      {b.package?.title}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Departure Date</span>
                        <strong className="text-slate-800">{b.travel_date}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Party Size</span>
                        <strong className="text-slate-800">{b.num_travellers} Guests</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Accommodation</span>
                        <strong className="text-slate-800">{b.accommodation?.name || 'Standard Partner'}</strong>
                      </div>
                    </div>

                    {/* Agency Coordination Notes */}
                    {b.coordination_notes && (
                      <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 mt-2">
                        <span className="font-bold block text-blue-950 mb-0.5">Negombo Agency Dispatch Notes:</span>
                        <p>{b.coordination_notes}</p>
                        {b.handled_by && (
                          <span className="text-[10px] text-blue-700 mt-1 block">
                            Handled by: {b.handled_by.full_name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col justify-between md:justify-center items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Settled</span>
                      <span className="text-xl font-extrabold text-blue-700 font-display">
                        {b.total_price_lkr.toLocaleString()} LKR
                      </span>
                    </div>

                    <Link
                      to={`/booking/confirmation/${b.id}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      View Receipt <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Queries */}
      {activeTab === 'queries' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Your Support & Customization Inquiries
            </h3>
            <Link
              to="/contact"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-2xs"
            >
              + Submit New Inquiry
            </Link>
          </div>

          {queries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold font-display text-slate-900">No Support Tickets Logged</h3>
              <p className="text-xs text-slate-500 mt-1">
                Have a question about an itinerary or special dietary needs? Contact our Negombo desk.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {queries.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Ticket #{q.id}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {q.category.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            q.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{q.subject}</h4>
                    </div>
                    <Link
                      to={`/queries/${q.id}`}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                    >
                      View Thread <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                    "{q.message}"
                  </p>

                  {q.staff_response ? (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center text-emerald-950 font-bold">
                        <span>Staff Response from {q.assigned_staff?.full_name || 'GlobeTrek Agent'}:</span>
                      </div>
                      <p className="text-emerald-900">{q.staff_response}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Pending review by our Negombo coordination team.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Notifications (Simulated Email/SMS Log) */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                In-App Notification Dispatch (Simulated Email & SMS Log)
              </h3>
              <p className="text-xs text-slate-400">
                In accordance with Assumption 4, notifications are recorded in-app in lieu of external telecom/email providers.
              </p>
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No notifications recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    n.is_read
                      ? 'bg-slate-50 border-slate-100 text-slate-600'
                      : 'bg-blue-50/60 border-blue-200 text-slate-900 font-semibold shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className={`w-4 h-4 ${n.is_read ? 'text-slate-400' : 'text-blue-600'}`} />
                    <span>{n.message}</span>
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkNotificationRead(n.id)}
                      className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs max-w-xl space-y-6">
          <h3 className="text-lg font-bold font-display text-slate-900">
            Traveler Account Profile
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-bold block mb-1">Full Name</span>
              <p className="text-slate-800 text-sm font-semibold">{user?.full_name}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold block mb-1">Email Address</span>
              <p className="text-slate-800 text-sm font-semibold">{user?.email}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold block mb-1">Phone / WhatsApp</span>
              <p className="text-slate-800 text-sm font-semibold">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold block mb-1">Account Role</span>
              <span className="inline-block px-2.5 py-0.5 rounded uppercase font-bold text-[10px] bg-blue-100 text-blue-800">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
