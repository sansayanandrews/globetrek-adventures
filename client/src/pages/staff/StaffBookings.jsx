import React, { useState, useEffect } from 'react';
import {
  Calendar, Search, Filter, CheckCircle2, XCircle, Clock,
  Edit, Save, X, User, Phone, MapPin, Bed, Car, ExternalLink
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function StaffBookings() {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Coordination Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notesInput, setNotesInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [saving, setSaving] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const openCoordinationModal = (b) => {
    setSelectedBooking(b);
    setNotesInput(b.coordination_notes || '');
    setStatusInput(b.status);
  };

  const handleUpdateStatus = async (id, newStatus, newNotes = null) => {
    setSaving(true);
    try {
      const res = await api.patch(`/bookings/${id}/status`, {
        status: newStatus,
        coordination_notes: newNotes !== null ? newNotes : selectedBooking?.coordination_notes
      });
      if (res.data.success) {
        addToast(`Booking #${id} updated to ${newStatus.toUpperCase()}`, 'success');
        setSelectedBooking(null);
        loadBookings();
      }
    } catch (err) {
      addToast('Failed to update booking status.', 'error');
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Operations & Dispatch
        </span>
        <h1 className="text-3xl font-bold font-display text-slate-900 mt-2">
          Agency Booking Queue & Coordination
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Review reservations, confirm partner accommodations and chauffeurs, and update internal dispatch notes.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['All', 'pending', 'confirmed', 'cancelled', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-2xs'
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
            placeholder="Search by name, email, tour..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-4">Booking</th>
                <th className="px-6 py-4">Traveler</th>
                <th className="px-6 py-4">Date & Party</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total (LKR)</th>
                <th className="px-6 py-4">Coordination Notes</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <strong className="text-slate-900 font-bold block">#{b.id}</strong>
                    <span className="text-slate-500 text-[11px] line-clamp-1">{b.package?.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <strong className="text-slate-800 block">{b.customer?.full_name}</strong>
                    <span className="text-slate-400 text-[11px]">{b.customer?.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-800 font-semibold block">{b.travel_date}</span>
                    <span className="text-slate-400 text-[11px]">{b.num_travellers} Guests</span>
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
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-800">
                    {b.total_price_lkr.toLocaleString()} LKR
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                      {b.coordination_notes || 'No dispatch notes yet.'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openCoordinationModal(b)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-[11px] rounded-lg transition-colors border border-slate-200"
                    >
                      Coordinate / Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coordination Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-100 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                Dispatch Management
              </span>
              <h2 className="text-xl font-bold font-display text-slate-900 mt-2">
                Booking #{selectedBooking.id} Coordination
              </h2>
              <p className="text-xs text-slate-500">
                Tour: <strong>{selectedBooking.package?.title}</strong> ({selectedBooking.travel_date})
              </p>
            </div>

            {/* Details Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Traveler</span>
                <strong>{selectedBooking.customer?.full_name}</strong>
                <span className="block text-slate-500 text-[11px]">{selectedBooking.customer?.phone || selectedBooking.customer?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Partner Hotel</span>
                <strong>{selectedBooking.accommodation?.name || 'Standard Assigned'}</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Chauffeur / Fleet</span>
                <strong>{selectedBooking.transportation?.type || 'Standard Fleet'}</strong>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Total Settled</span>
                <strong className="text-blue-700">{selectedBooking.total_price_lkr.toLocaleString()} LKR</strong>
              </div>
            </div>

            {/* Coordination Notes TextArea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Internal Agency Coordination Notes *
              </label>
              <textarea
                rows={4}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="e.g. Hotel vouchers sent to Aliya Resort. Assigned Chauffeur Mr. Ranjith (+94 77 444 3322) with Toyota KDH Van."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                These notes appear on the customer's dashboard and voucher once confirmed.
              </span>
            </div>

            {/* Status Actions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Update Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed', notesInput)}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'completed', notesInput)}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled', notesInput)}
                  className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleUpdateStatus(selectedBooking.id, selectedBooking.status, notesInput)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Save Notes Only
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
