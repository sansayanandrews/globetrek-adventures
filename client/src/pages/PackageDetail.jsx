import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, Users, ShieldCheck, Check, Sparkles,
  ArrowRight, Bed, Car, Info, HelpCircle, ChevronRight
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function PackageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Customization State
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // default 2 weeks ahead
    return d.toISOString().split('T')[0];
  });
  const [numTravellers, setNumTravellers] = useState(2);
  const [selectedAccId, setSelectedAccId] = useState(null);
  const [selectedTransId, setSelectedTransId] = useState(null);
  const [extraNights, setExtraNights] = useState(0);

  useEffect(() => {
    async function fetchPackage() {
      setLoading(true);
      try {
        const res = await api.get(`/packages/${slug}`);
        if (res.data.success) {
          const data = res.data.data;
          setPkg(data);
          setActiveImage(data.cover_image_url);

          // Find default accommodation
          const defaultAcc = data.accommodations?.find((a) => a.is_default);
          if (defaultAcc) setSelectedAccId(defaultAcc.accommodation_id);
          else if (data.accommodations?.length > 0) setSelectedAccId(data.accommodations[0].accommodation_id);

          // Find default transport
          const defaultTrans = data.transports?.find((t) => t.is_default);
          if (defaultTrans) setSelectedTransId(defaultTrans.transportation_id);
          else if (data.transports?.length > 0) setSelectedTransId(data.transports[0].transportation_id);
        }
      } catch (err) {
        console.error('Error fetching package details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackage();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold font-display text-slate-900">Tour Package Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">The itinerary you are looking for might have been moved or unpublished.</p>
        <Link to="/packages" className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-xs">
          Return to Packages
        </Link>
      </div>
    );
  }

  // Parse gallery images
  let galleryImages = [];
  try {
    galleryImages = typeof pkg.gallery === 'string' ? JSON.parse(pkg.gallery) : (pkg.gallery || []);
  } catch (e) {
    galleryImages = [];
  }
  const allImages = [pkg.cover_image_url, ...galleryImages];

  // Parse day-by-day itinerary
  const itineraryDays = pkg.itinerary_summary
    ? pkg.itinerary_summary.split('|').map((dayStr) => dayStr.trim()).filter(Boolean)
    : [];

  // Selected entities for price calculation
  const currentAcc = pkg.accommodations?.find((a) => a.accommodation_id === selectedAccId)?.accommodation;
  const currentTrans = pkg.transports?.find((t) => t.transportation_id === selectedTransId)?.transportation;

  // Live Price Calculation
  const baseCost = pkg.base_price_lkr * numTravellers;
  const extraNightsCost = (currentAcc ? currentAcc.price_per_night_lkr : 0) * extraNights;
  const transportCost = currentTrans ? currentTrans.price_lkr : 0;
  const totalCalculatedLkr = baseCost + extraNightsCost + transportCost;

  const handleProceedToBooking = () => {
    // Store customization parameters in sessionStorage or URL params
    const customizationData = {
      package_id: pkg.id,
      package_slug: pkg.slug,
      package_title: pkg.title,
      travel_date: travelDate,
      num_travellers: numTravellers,
      selected_accommodation_id: selectedAccId,
      selected_transport_id: selectedTransId,
      extra_nights: extraNights,
      total_price_lkr: totalCalculatedLkr
    };
    sessionStorage.setItem('globetrek_booking_customization', JSON.stringify(customizationData));
    navigate(`/book/${pkg.slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/packages" className="hover:text-teal-600">Tour Packages</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-800 truncate max-w-xs">{pkg.title}</span>
      </nav>

      {/* Package Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
              {pkg.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800">
              {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" /> {pkg.destination}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display">
            {pkg.title}
          </h1>
        </div>

        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-6 shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Base Price</span>
            <div className="text-2xl font-extrabold text-teal-700 font-display">
              {pkg.base_price_lkr.toLocaleString()} <span className="text-xs font-normal text-slate-500">LKR / person</span>
            </div>
          </div>
          <a
            href="#customizer"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            Customize This Trip
          </a>
        </div>
      </div>

      {/* Media Gallery */}
      <div className="space-y-4">
        <div className="h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-md bg-slate-900 relative">
          <img
            src={activeImage}
            alt={pkg.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
        </div>

        {/* Thumbnail Selector */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImage === img ? 'border-teal-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Grid: Details vs Sticky Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Itinerary, Accommodations & Inclusions */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
            <h2 className="text-xl font-bold font-display text-slate-900 mb-4">
              Tour Overview
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {pkg.description}
            </p>

            {/* Highlights bullet points */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Private dedicated chauffeur throughout</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Handpicked boutique & eco-resort stays</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Daily breakfast & designated experiences included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>24/7 on-ground assistance from Negombo HQ</span>
              </div>
            </div>
          </div>

          {/* Day-by-Day Itinerary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
            <h2 className="text-xl font-bold font-display text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Detailed Day-by-Day Itinerary
            </h2>

            <div className="space-y-6">
              {itineraryDays.map((dayText, idx) => (
                <div key={idx} className="relative pl-8 pb-6 border-l-2 border-teal-200 last:border-transparent last:pb-0">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    {idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    {dayText.split(':')[0] || `Day ${idx + 1}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {dayText.includes(':') ? dayText.substring(dayText.indexOf(':') + 1).trim() : dayText}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Accommodation Options */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
            <h2 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
              <Bed className="w-5 h-5 text-teal-600" />
              Partner Accommodations Available for This Tour
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              You can swap between our pre-selected boutique and luxury hotel partners in the customizer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pkg.accommodations?.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    selectedAccId === item.accommodation_id
                      ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                        {item.accommodation.type}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 font-display mt-0.5">
                        {item.accommodation.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.accommodation.location}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      ? {item.accommodation.rating}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Nightly Rate:</span>
                    <strong className="text-slate-900 font-extrabold">
                      {item.accommodation.price_per_night_lkr.toLocaleString()} LKR
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: "Customize This Trip" Interactive Pricing Widget */}
        <div id="customizer" className="space-y-6">
          <div className="sticky top-28 bg-white rounded-3xl p-6 shadow-xl border-2 border-teal-600/30 space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                  Interactive Calculator
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Instant Quote</span>
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 mt-2">
                Customize This Trip
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust dates, party size, and upgrades to see your live price.
              </p>
            </div>

            {/* 1. Select Start Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" /> Start Date
              </label>
              <input
                type="date"
                value={travelDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-teal-600 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* 2. Number of Travelers Counter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600" /> Number of Travelers
              </label>
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNumTravellers(Math.max(1, numTravellers - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 text-base"
                >
                  -
                </button>
                <span className="text-base font-extrabold text-slate-900">
                  {numTravellers} {numTravellers === 1 ? 'Traveler' : 'Travelers'}
                </span>
                <button
                  type="button"
                  onClick={() => setNumTravellers(numTravellers + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* 3. Choose Accommodation */}
            {pkg.accommodations && pkg.accommodations.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-teal-600" /> Accommodation Preference
                </label>
                <select
                  value={selectedAccId || ''}
                  onChange={(e) => setSelectedAccId(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-600 focus:outline-hidden cursor-pointer"
                >
                  {pkg.accommodations.map((a) => (
                    <option key={a.accommodation_id} value={a.accommodation_id}>
                      {a.accommodation.name} ({a.accommodation.price_per_night_lkr.toLocaleString()} LKR/nt)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Choose Transportation Mode */}
            {pkg.transports && pkg.transports.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-teal-600" /> Dedicated Transportation
                </label>
                <select
                  value={selectedTransId || ''}
                  onChange={(e) => setSelectedTransId(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-600 focus:outline-hidden cursor-pointer"
                >
                  {pkg.transports.map((t) => (
                    <option key={t.transportation_id} value={t.transportation_id}>
                      {t.transportation.type} (+{t.transportation.price_lkr.toLocaleString()} LKR)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 5. Optional Extra Nights */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Optional Extra Nights
                </label>
                <span className="text-xs font-bold text-teal-700">+{extraNights} Nights</span>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setExtraNights(n)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      extraNights === n
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n === 0 ? 'None' : `+${n}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Pricing Breakdown Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Tour ({numTravellers} travelers):</span>
                <span>{baseCost.toLocaleString()} LKR</span>
              </div>
              {extraNights > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Extra Nights ({extraNights} nt):</span>
                  <span>+{extraNightsCost.toLocaleString()} LKR</span>
                </div>
              )}
              {transportCost > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Transport Allocation:</span>
                  <span>+{transportCost.toLocaleString()} LKR</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">Calculated Total:</span>
                <span className="text-xl font-extrabold text-teal-700 font-display">
                  {totalCalculatedLkr.toLocaleString()} <span className="text-xs font-medium text-slate-500">LKR</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleProceedToBooking}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md shadow-teal-600/30 text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                Proceed to Book This Trip <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to={`/contact?subject=Inquiry about ${encodeURIComponent(pkg.title)}`}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" /> Have questions? Ask our Negombo desk
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
