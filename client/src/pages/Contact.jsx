import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [category, setCategory] = useState('general_inquiry');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      addToast('Please provide both a subject and message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category,
        subject: subject.trim(),
        message: message.trim(),
        booking_id: bookingId ? parseInt(bookingId, 10) : null
      };

      const res = await api.post('/queries', payload);
      if (res.data.success) {
        setSubmittedQuery(res.data.data);
        addToast('Your inquiry has been logged successfully!', 'success');
        setSubject('');
        setMessage('');
        setBookingId('');
      }
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      addToast(err.response?.data?.error?.message || 'Failed to submit inquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
          Negombo Coordination Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-2">
          Contact GlobeTrek Adventures
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Whether you need advice on seasonal routes, want to customize a multi-day itinerary, or have a question about an existing reservation, our Negombo team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Information & Office Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              Headquarters in Negombo
            </h2>
            
            <ul className="space-y-4 text-xs text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Office Address:</strong>
                  <span>No. 48 Porutota Road, Negombo Beachside, Western Province, Sri Lanka</span>
                  <span className="block text-slate-400 mt-0.5">20 mins from Bandaranaike Airport (BIA)</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Direct Lines & WhatsApp:</strong>
                  <span>+94 31 222 4500 (Negombo Office)</span>
                  <span className="block">+94 77 123 4567 (24/7 Traveler Dispatch)</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Email Communications:</strong>
                  <span>info@globetrekadventures.lk</span>
                  <span className="block text-slate-400">bookings@globetrekadventures.lk</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-semibold mb-0.5">Working Hours:</strong>
                  <span>Monday � Saturday: 8:00 AM � 7:00 PM (IST)</span>
                  <span className="block text-slate-400">Emergency support active 24/7 for travelers on tour</span>
                </div>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-teal-700 bg-teal-50/50 p-3 rounded-xl text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0 text-teal-600" />
              <span>Certified under SLTDA License #TA/2026/0488</span>
            </div>
          </div>
        </div>

        {/* Inquiry Submission Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
            
            {submittedQuery ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  Inquiry Ticket Registered!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                  Your inquiry has been assigned reference ticket <strong>#{submittedQuery.id}</strong>. A dedicated staff member from our Negombo desk will respond shortly.
                </p>
                {user && (
                  <p className="text-xs text-teal-700 font-medium">
                    You can track staff responses in your <a href="/dashboard" className="underline font-bold">Customer Dashboard</a>.
                  </p>
                )}
                <button
                  onClick={() => setSubmittedQuery(null)}
                  className="mt-4 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-sm"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">
                    Send an Inquiry or Customization Request
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the details below. Our travel coordinators respond within 2-4 business hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Inquiry Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden cursor-pointer"
                    >
                      <option value="general_inquiry">General Inquiry</option>
                      <option value="customization_request">Customization Request</option>
                      <option value="booking_issue">Existing Booking Inquiry</option>
                      <option value="complaint">Service Feedback / Complaint</option>
                    </select>
                  </div>

                  {/* Optional Booking Reference */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Booking Reference ID (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 101"
                      value={bookingId}
                      onChange={(e) => setBookingId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inquiring about whale watching season in Mirissa or custom family package"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Your Message / Questions *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your planned travel dates, number of guests, desired destinations, or specific assistance required..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    {user ? `Logged in as ${user.full_name}` : 'Public inquiry submission'}
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Submitting...' : 'Send Inquiry to Negombo Desk'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
