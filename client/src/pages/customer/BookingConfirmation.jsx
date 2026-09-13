import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Calendar, Users, Bed, Car, Printer, Home, Download, ShieldCheck } from 'lucide-react';
import api from '../../api/client';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      setLoading(true);
      try {
        const res = await api.get(`/bookings/${id}`);
        if (res.data.success) {
          setBooking(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load booking:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold font-display text-slate-900">Booking Record Not Found</h2>
        <Link to="/dashboard" className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const payment = booking.payments && booking.payments.length > 0 ? booking.payments[0] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block">
          Booking Successful
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
          Your Sri Lankan Adventure is Booked!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Thank you for traveling with GlobeTrek Adventures. Our Negombo dispatch desk has received your reservation and is coordinating your accommodations and chauffeur.
        </p>
      </div>

      {/* Printable Booking Voucher Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6 print:shadow-none print:border-none">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Official Booking Voucher
            </span>
            <h2 className="text-xl font-extrabold font-display text-slate-900">
              Booking Ref: #GT-BKG-{booking.id.toString().padStart(5, '0')}
            </h2>
            <span className="text-xs text-blue-700 font-semibold">
              Simulated Txn: {payment?.transaction_ref || 'GT-TXN-PENDING'}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span
              className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full ${
                booking.status === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Status: {booking.status}
            </span>
            <span className="block text-[11px] text-slate-400 mt-1">
              Placed on {new Date(booking.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-slate-400 uppercase font-bold block mb-1">Tour Package</span>
            <h3 className="text-sm font-bold text-slate-900 font-display">{booking.package?.title}</h3>
            <p className="text-slate-500 mt-0.5">{booking.package?.destination} ({booking.package?.duration_days} Days)</p>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-bold block mb-1">Lead Traveler</span>
            <h3 className="text-sm font-bold text-slate-900">{booking.customer?.full_name}</h3>
            <p className="text-slate-500 mt-0.5">{booking.customer?.email} • {booking.customer?.phone || 'No phone'}</p>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-bold block mb-1">Departure Date</span>
            <p className="text-slate-800 font-bold text-sm">{booking.travel_date}</p>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-bold block mb-1">Total Guests</span>
            <p className="text-slate-800 font-bold text-sm">{booking.num_travellers} Persons</p>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-bold block mb-1">Partner Accommodation</span>
            <p className="text-slate-800 font-semibold">{booking.accommodation?.name || 'Standard Assigned'}</p>
            <span className="text-[11px] text-slate-500">{booking.accommodation?.location}</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase font-bold block mb-1">Chauffeur Transportation</span>
            <p className="text-slate-800 font-semibold">{booking.transportation?.type || 'Dedicated Chauffeur'}</p>
            <span className="text-[11px] text-slate-500">{booking.transportation?.provider_name}</span>
          </div>
        </div>

        {booking.coordination_notes && (
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
            <span className="font-bold block text-blue-950">Coordination & Dispatch Status:</span>
            <p>{booking.coordination_notes}</p>
          </div>
        )}

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Base Package & Accommodations:</span>
            <span>{booking.subtotal_lkr.toLocaleString()} LKR</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Taxes & Chauffeur Services:</span>
            <span>Included</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Total Settled (Simulated Card):</span>
            <span className="text-xl font-extrabold text-blue-700 font-display">
              {booking.total_price_lkr.toLocaleString()} LKR
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Negombo Operations Hub • SLTDA License #TA/2026/0488
          </span>
          <span>Hotline: +94 31 222 4500</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-all"
        >
          <Printer className="w-4 h-4" /> Print Booking Voucher
        </button>

        <Link
          to="/dashboard"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" /> Return to Customer Dashboard
        </Link>
      </div>
    </div>
  );
}
