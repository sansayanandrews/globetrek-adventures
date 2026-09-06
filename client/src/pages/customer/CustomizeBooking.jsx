import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Users, Bed, Car, CreditCard, ShieldCheck, ArrowRight,
  ArrowLeft, Check, AlertCircle, Sparkles, Lock, Info
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CustomizeBooking() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Trip inputs
  const [travelDate, setTravelDate] = useState('');
  const [numTravellers, setNumTravellers] = useState(2);
  const [selectedAccId, setSelectedAccId] = useState(null);
  const [selectedTransId, setSelectedTransId] = useState(null);
  const [extraNights, setExtraNights] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');

  // Simulated Payment Form Inputs
  const [cardholderName, setCardholderName] = useState(user?.full_name || '');
  const [cardNumber, setCardNumber] = useState('4532 8812 9043 2198');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('842');

  useEffect(() => {
    async function loadPackage() {
      setLoading(true);
      try {
        const res = await api.get(`/packages/${slug}`);
        if (res.data.success) {
          const data = res.data.data;
          setPkg(data);

          // Restore customizations from sessionStorage if present
          const stored = sessionStorage.getItem('globetrek_booking_customization');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.package_id === data.id) {
              if (parsed.travel_date) setTravelDate(parsed.travel_date);
              if (parsed.num_travellers) setNumTravellers(parsed.num_travellers);
              if (parsed.selected_accommodation_id) setSelectedAccId(parsed.selected_accommodation_id);
              if (parsed.selected_transport_id) setSelectedTransId(parsed.selected_transport_id);
              if (parsed.extra_nights !== undefined) setExtraNights(parsed.extra_nights);
            }
          }

          // Fallbacks for default accommodation and transport
          if (!selectedAccId && data.accommodations?.length > 0) {
            const defAcc = data.accommodations.find((a) => a.is_default) || data.accommodations[0];
            setSelectedAccId(defAcc.accommodation_id);
          }
          if (!selectedTransId && data.transports?.length > 0) {
            const defTrans = data.transports.find((t) => t.is_default) || data.transports[0];
            setSelectedTransId(defTrans.transportation_id);
          }
          if (!travelDate) {
            const d = new Date();
            d.setDate(d.getDate() + 14);
            setTravelDate(d.toISOString().split('T')[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load package for booking:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [slug]);

  if (loading || !pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  // Selected Entities
  const currentAcc = pkg.accommodations?.find((a) => a.accommodation_id === selectedAccId)?.accommodation;
  const currentTrans = pkg.transports?.find((t) => t.transportation_id === selectedTransId)?.transportation;

  // Calculation
  const baseCost = pkg.base_price_lkr * numTravellers;
  const extraNightsCost = (currentAcc ? currentAcc.price_per_night_lkr : 0) * extraNights;
  const transportCost = currentTrans ? currentTrans.price_lkr : 0;
  const totalLKR = baseCost + extraNightsCost + transportCost;

  // Validation
  const validateCard = () => {
    if (!cardholderName.trim()) {
      setError('Cardholder name is required.');
      return false;
    }
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15 || cleanNum.length > 16 || !/^\d+$/.test(cleanNum)) {
      setError('Please enter a valid 16-digit simulated card number.');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError('Expiration date must be in MM/YY format.');
      return false;
    }
    if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
      setError('CVV must be 3 or 4 digits.');
      return false;
    }
    setError('');
    return true;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!validateCard()) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        package_id: pkg.id,
        travel_date: travelDate,
        num_travellers: numTravellers,
        selected_accommodation_id: selectedAccId,
        selected_transport_id: selectedTransId,
        customizations: {
          extra_nights: extraNights,
          special_requests: specialRequests.trim()
        },
        payment_details: {
          cardholder_name: cardholderName.trim(),
          card_number: cardNumber.slice(-4), // Non-sensitive reference
          expiry,
          method: 'simulated'
        }
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        addToast('Booking successfully placed! Our Negombo office will coordinate details.', 'success');
        sessionStorage.removeItem('globetrek_booking_customization');
        navigate(`/booking/confirmation/${res.data.data.booking.id}`);
      }
    } catch (err) {
      console.error('Failed to create booking:', err);
      const msg = err.response?.data?.error?.message || 'Booking submission failed. Please review your details.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Step Indicator */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              1
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${step >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
              Customize Trip
            </span>
          </div>
          <div className={`h-1 flex-1 mx-3 rounded ${step >= 2 ? 'bg-teal-600' : 'bg-slate-200'}`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              2
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${step >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
              Review & Price
            </span>
          </div>
          <div className={`h-1 flex-1 mx-3 rounded ${step >= 3 ? 'bg-teal-600' : 'bg-slate-200'}`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              3
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${step >= 3 ? 'text-teal-700' : 'text-slate-400'}`}>
              Simulated Payment
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Customize Dates, Travelers & Upgrades */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded">
                Step 1 of 3
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900 mt-2">
                Configure {pkg.title}
              </h2>
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Departure Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-teal-500 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* Travelers */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Party Size (Adults / Children) *
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setNumTravellers(Math.max(1, numTravellers - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-lg"
                >
                  -
                </button>
                <span className="text-lg font-extrabold text-slate-900">
                  {numTravellers} {numTravellers === 1 ? 'Guest' : 'Guests'}
                </span>
                <button
                  type="button"
                  onClick={() => setNumTravellers(numTravellers + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Accommodation Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Partner Accommodation
              </label>
              <div className="space-y-2.5">
                {pkg.accommodations?.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAccId === item.accommodation_id
                        ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="acc"
                        checked={selectedAccId === item.accommodation_id}
                        onChange={() => setSelectedAccId(item.accommodation_id)}
                        className="accent-teal-600 w-4 h-4"
                      />
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block font-display">
                          {item.accommodation.name} ({item.accommodation.type})
                        </strong>
                        <span className="text-[11px] text-slate-500">{item.accommodation.location}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-teal-800">
                      {item.accommodation.price_per_night_lkr.toLocaleString()} LKR/nt
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transport Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Dedicated Transportation
              </label>
              <div className="space-y-2.5">
                {pkg.transports?.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTransId === item.transportation_id
                        ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="trans"
                        checked={selectedTransId === item.transportation_id}
                        onChange={() => setSelectedTransId(item.transportation_id)}
                        className="accent-teal-600 w-4 h-4"
                      />
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block font-display">
                          {item.transportation.type}
                        </strong>
                        <span className="text-[11px] text-slate-500">{item.transportation.provider_name}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-teal-800">
                      +{item.transportation.price_lkr.toLocaleString()} LKR
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Extra Nights */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Optional Extra Nights Extension
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setExtraNights(n)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                      extraNights === n
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n === 0 ? 'Standard Duration' : `+${n} Extra Nights`}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Special Coordination Requests (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Vegetarian/halal meal preference, airport pickup flight details, infant car seat..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                Review & Price Summary <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs h-fit space-y-6">
            <h3 className="text-base font-bold font-display text-slate-900">
              Live Price Recalculation
            </h3>
            
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Base Tour ({numTravellers} travelers):</span>
                <strong>{baseCost.toLocaleString()} LKR</strong>
              </div>
              {extraNights > 0 && (
                <div className="flex justify-between">
                  <span>Extra Nights ({extraNights}):</span>
                  <strong>+{extraNightsCost.toLocaleString()} LKR</strong>
                </div>
              )}
              {transportCost > 0 && (
                <div className="flex justify-between">
                  <span>Transport Upgrade:</span>
                  <strong>+{transportCost.toLocaleString()} LKR</strong>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-slate-900">
                <span className="font-bold text-sm">Estimated Total:</span>
                <span className="text-xl font-extrabold text-teal-700 font-display">
                  {totalLKR.toLocaleString()} <span className="text-xs font-medium text-slate-500">LKR</span>
                </span>
              </div>
            </div>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-[11px] text-teal-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Sri Lankan Rupees (LKR)
              </div>
              <p>All rates include taxes and chauffeur coordination services.</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Review Itinerary & Terms */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 max-w-3xl mx-auto">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded">
              Step 2 of 3
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900 mt-2">
              Review Your Tour Configuration
            </h2>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500">Package:</span>
              <strong className="text-slate-900 text-sm font-display">{pkg.title}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Travel Date:</span>
              <strong className="text-slate-800">{travelDate}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Number of Guests:</span>
              <strong className="text-slate-800">{numTravellers} Persons</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Accommodation:</span>
              <strong className="text-slate-800">{currentAcc?.name} ({currentAcc?.type})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Transportation:</span>
              <strong className="text-slate-800">{currentTrans?.type}</strong>
            </div>
            {extraNights > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Extension:</span>
                <strong className="text-slate-800">+{extraNights} Extra Nights</strong>
              </div>
            )}
            {specialRequests && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">Traveler Notes:</span>
                <p className="italic text-slate-700">"{specialRequests}"</p>
              </div>
            )}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Payable Amount:</span>
              <span className="text-2xl font-extrabold text-teal-700 font-display">
                {totalLKR.toLocaleString()} LKR
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Customizer
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              Proceed to Simulated Payment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Simulated Payment Gateway */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6 max-w-2xl mx-auto">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded">
              Step 3 of 3
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900 mt-2">
              Payment Details (Simulated Gateway)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Test payments are securely simulated. Non-sensitive card format is validated client-side without storing live credentials.
            </p>
          </div>

          {/* Stated Assumption 2 Notice */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Simulated Payment Protocol (Assumption 2):</strong>
              <span>
                Card information below is simulated for demonstration purposes. No real bank or gateway is contacted, and a mock transaction reference (<code>GT-TXN-XXXXXX</code>) will be recorded.
              </span>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Cardholder Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amara Perera"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Card Number *
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="4532 8812 9043 2198"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Expiry Date (MM/YY) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="12/28"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Security Code (CVV) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="842"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total to Charge</span>
                <span className="text-xl font-extrabold text-teal-700 font-display">
                  {totalLKR.toLocaleString()} LKR
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                Verified Format
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Review
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-teal-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Processing Simulation...' : `Pay ${totalLKR.toLocaleString()} LKR & Confirm`}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
