import React, { useState, useEffect } from 'react';
import { Bed, Star, MapPin, Search, Check, ShieldCheck } from 'lucide-react';
import api from '../api/client';

export default function Accommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['All', 'Resort', 'Eco-Resort', 'Heritage Hotel', 'Luxury Chalet', 'Safari Lodge', 'Boutique Resort', 'Beachside Villa', 'Hillside Hotel'];

  useEffect(() => {
    async function fetchAccommodations() {
      setLoading(true);
      try {
        const res = await api.get('/catalog/accommodations');
        if (res.data.success) {
          setAccommodations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load accommodations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAccommodations();
  }, []);

  const filtered = accommodations.filter((acc) => {
    const matchesType = selectedType === 'All' || acc.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || acc.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Partner Hospitality
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-2">
          Partner Accommodations Across Sri Lanka
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Every villa, eco-lodge, and heritage hotel in our catalog is hand-vetted by our Negombo coordination team for comfort, authentic cuisine, and environmental responsibility.
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['All', 'Resort', 'Eco-Resort', 'Safari Lodge', 'Boutique Resort'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === t
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by hotel or town..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Accommodations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {acc.type}
                  </span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {acc.rating}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display mb-1">
                  {acc.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {acc.location}
                </p>

                <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Private en-suite bathroom
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> Complimentary Ceylon breakfast
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" /> High-speed Wi-Fi included
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Nightly Rate</span>
                  <span className="text-sm font-extrabold text-blue-700">
                    {acc.price_per_night_lkr.toLocaleString()} LKR
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                  Catalog Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
