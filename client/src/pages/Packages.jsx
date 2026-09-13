import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, ArrowUpDown, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import api from '../api/client';

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [duration, setDuration] = useState(searchParams.get('duration') || 'All');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || 200000);
  const [sortBy, setSortBy] = useState('recommended');

  const categories = ['All', 'Cultural', 'Wildlife', 'Scenic', 'Beach', 'Adventure'];
  const durations = ['All', '2', '3', '4'];

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (category !== 'All') queryParams.set('category', category);
        if (duration !== 'All') queryParams.set('duration', duration);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);

        const res = await api.get(`/packages?${queryParams.toString()}`);
        if (res.data.success) {
          let list = res.data.data;

          // Client-side sorting
          if (sortBy === 'price_asc') {
            list.sort((a, b) => a.base_price_lkr - b.base_price_lkr);
          } else if (sortBy === 'price_desc') {
            list.sort((a, b) => b.base_price_lkr - a.base_price_lkr);
          } else if (sortBy === 'duration') {
            list.sort((a, b) => a.duration_days - b.duration_days);
          }

          setPackages(list);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, [search, category, duration, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setDuration('All');
    setMaxPrice(200000);
    setSortBy('recommended');
    setSearchParams({});
  };

  const hasActiveFilters = search || category !== 'All' || duration !== 'All' || maxPrice < 200000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Island Expeditions
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-2">
            Sri Lanka Tour Packages & Itineraries
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Choose a signature route or customize any package to match your group, hotel tier, and dates.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="duration">Duration (Days)</option>
          </select>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-6">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by destination or keyword (e.g. Sigiriya, Tea, Safari, Galle)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <X className="w-4 h-4" /> Clear All Filters
            </button>
          )}
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Duration
            </label>
            <div className="flex flex-wrap gap-1.5">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    duration === d
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d === 'All' ? 'Any Duration' : `${d} Days`}
                </button>
              ))}
            </div>
          </div>

          {/* Price Slider Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Max Price Per Person (LKR)
              </label>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Up to {Number(maxPrice).toLocaleString()} LKR
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="200000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>50,000 LKR</span>
              <span>200,000 LKR</span>
            </div>
          </div>

        </div>
      </div>

      {/* Package Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Showing <strong className="text-slate-800">{packages.length}</strong> tour packages</span>
        {category !== 'All' && <span>Filtered by category: <strong className="text-blue-700">{category}</strong></span>}
      </div>

      {/* Package Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-2xs">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 font-display">No Packages Match Your Criteria</h3>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Try adjusting your search terms, price slider, or category filter to discover more Sri Lankan routes.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-slate-100 flex flex-col transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Cover Image & Metadata Badges */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={pkg.cover_image_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 shadow-2xs backdrop-blur-xs">
                    {pkg.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-2xs">
                    {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-white text-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{pkg.destination}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display line-clamp-1 mb-2">
                    {pkg.title}
                  </h2>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Base Rate
                    </span>
                    <span className="text-lg font-extrabold text-blue-700">
                      {pkg.base_price_lkr.toLocaleString()} <span className="text-xs font-normal text-slate-500">LKR</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/packages/${pkg.slug}`}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                    >
                      Details & Customizer <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
