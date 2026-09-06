import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../../api/client';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await api.get('/bookings');
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      b.customer?.full_name?.toLowerCase().includes(q) ||
      b.customer?.email?.toLowerCase().includes(q) ||
      b.package?.title?.toLowerCase().includes(q) ||
      b.id.toString().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalFilteredRevenue = filtered
    .filter((b) => b.payment_status === 'paid')
    .reduce((acc, b) => acc + b.total_price_lkr, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
            Master Oversight
          </span>
          <h1 className="text-3xl font-bold font-display text-slate-900 mt-2">
            Agency Booking Repository & Oversight
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Global ledger of all customer reservations across all Sri Lankan destinations.
          </p>
        </div>

        <a
          href="/api/admin/export-csv"
          download
          className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Download className="w-4 h-4" /> Export Ledger to CSV
        </a>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Filtered Bookings</span>
          <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-teal-600">Settled Revenue (LKR)</span>
          <p className="text-2xl font-extrabold text-teal-700 font-display mt-1">{totalFilteredRevenue.toLocaleString()} LKR</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-amber-600">Pending Approvals</span>
          <p className="text-2xl font-extrabold text-amber-600 font-display mt-1">
            {filtered.filter((b) => b.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'pending', 'confirmed', 'cancelled', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by customer, tour, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Tour Package</th>
                <th className="px-6 py-4">Departure</th>
                <th className="px-6 py-4">Revenue (LKR)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Handled By</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">#{b.id}</td>
                  <td className="px-6 py-4">
                    <strong className="text-slate-800 block">{b.customer?.full_name}</strong>
                    <span className="text-slate-400 text-[11px]">{b.customer?.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-800 font-semibold block">{b.package?.title}</span>
                    <span className="text-slate-400 text-[11px]">{b.num_travellers} Travelers</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{b.travel_date}</td>
                  <td className="px-6 py-4 font-extrabold text-teal-700">
                    {b.total_price_lkr.toLocaleString()} LKR
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : b.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {b.handled_by?.full_name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/booking/confirmation/${b.id}`}
                      className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold"
                    >
                      Receipt <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
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
