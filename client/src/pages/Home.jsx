import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowRight, Shield, Award, Clock, Star, Compass, Sparkles } from 'lucide-react';
import api from '../api/client';

export default function Home() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDestination, setSearchDestination] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await api.get('/packages');
        if (res.data.success) {
          // Take top 6 as featured
          setPackages(res.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load packages:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDestination) params.set('search', searchDestination);
    if (searchCategory !== 'All') params.set('category', searchCategory);
    navigate(`/packages?${params.toString()}`);
  };

  const destinations = [
    {
      name: 'Sigiriya',
      title: 'Lion Rock & Ancient Citadel',
      tag: 'UNESCO Cultural',
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Ella',
      title: 'Nine Arches & Misty Peaks',
      tag: 'Highland Scenic',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Yala',
      title: 'Leopard & Wilderness Safari',
      tag: 'Wildlife Adventure',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Galle',
      title: 'Colonial Ramparts & Coast',
      tag: 'Heritage & Beach',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2000&q=85"
            alt="Sri Lanka Highlands & Coastline"
            className="w-full h-full object-cover object-center scale-105 animate-pulse duration-10000 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-blue-950/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Bespoke Sri Lankan Journeys &bull; Based in Negombo
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-tight sm:leading-none mb-6">
            Discover Sri Lanka's Wonders, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-100 to-white">
              Tailored Exactly for You
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
            From the tranquil shores of Negombo to the mystical ruins of Sigiriya and the emerald tea gardens of Ella. Experience private chauffeur tours, authentic boutique hotels, and seamless local coordination.
          </p>

          {/* Interactive Search Bar Widget */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/20 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sigiriya, Ella, Yala..."
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
              <Compass className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Travel Category
                </label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Cultural">Cultural Heritage</option>
                  <option value="Wildlife">Wildlife Safari</option>
                  <option value="Scenic">Scenic Highlands</option>
                  <option value="Beach">Coastal & Beach</option>
                  <option value="Adventure">Active Adventure</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-600/30 hover:shadow-lg transition-all text-sm sm:text-base cursor-pointer"
            >
              <Search className="w-5 h-5" />
              Find Packages
            </button>
          </form>

          {/* Quick stats / guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-400" /> SLTDA Licensed Guides
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 Traveler Satisfaction
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" /> Live Price Calculation in LKR
            </span>
          </div>

        </div>
      </section>

      {/* Featured Tour Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Signature Itineraries
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
              Curated Sri Lankan Tour Packages
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Handcrafted tours departing from our Negombo hub, complete with private chauffeur, hand-picked accommodations, and flexible customization.
            </p>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800 group"
          >
            View All Packages <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-slate-100 flex flex-col transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={pkg.cover_image_url}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                      {pkg.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white shadow-xs backdrop-blur-xs">
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
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display line-clamp-1 mb-2">
                      {pkg.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">
                        Starting From
                      </span>
                      <span className="text-lg font-extrabold text-blue-700">
                        {pkg.base_price_lkr.toLocaleString()} <span className="text-xs font-normal text-slate-500">LKR</span>
                      </span>
                    </div>
                    <Link
                      to={`/packages/${pkg.slug}`}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      View & Customize
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Destination Showcase */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Iconic Sri Lanka
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
              Destinations on Every Traveler's Dream List
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              From rocky citadel heights to golden coastlines and wildlife reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                onClick={() => navigate(`/packages?search=${dest.name}`)}
                className="relative rounded-2xl overflow-hidden h-80 group cursor-pointer shadow-sm hover:shadow-xl transition-all"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/90 mb-2 inline-block">
                    {dest.tag}
                  </span>
                  <h3 className="text-xl font-bold font-display">{dest.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{dest.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Travel with GlobeTrek Adventures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Why GlobeTrek
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-6 font-display leading-tight">
              A Homegrown Negombo Agency with International Standards
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Located just 20 minutes from Bandaranaike International Airport (BIA), GlobeTrek Adventures offers travelers immediate, stress-free entry into Sri Lanka. We eliminate intermediaries, offering direct coordination with our licensed chauffeur-guides and hand-vetted partner hotels.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    100% Tailored Customization
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Swap hotels, upgrade vehicles, or add extra nights with real-time price recalculation in Sri Lankan Rupees.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    Private Dedicated Chauffeur Fleet
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Air-conditioned luxury vans and sedans equipped with Wi-Fi, driven by English-fluent government-licensed guides.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    24/7 Operations Desk in Negombo
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Our on-ground operations desk monitors your itinerary daily, providing live flight tracking and hotel coordination.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80"
                alt="Negombo Outrigger Catamaran and Beach"
                className="w-full h-[460px] object-cover"
              />
            </div>
            {/* Overlay badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden sm:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">4.9 / 5.0</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                "Our driver was exceptional. From Negombo to Ella and Yala, every accommodation and excursion was flawlessly planned."
              </p>
              <span className="text-[11px] font-bold text-blue-600 mt-2 block">
                &bull; Sarah & Mark, UK
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 p-8 sm:p-14 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-700/30">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-300">
              Start Your Journey Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display mt-2 mb-4 leading-tight">
              Ready to Explore Sri Lanka With Our Local Experts?
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Have a custom request or specific dates in mind? Browse our catalog or submit an inquiry to speak directly with our Negombo travel specialists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/packages"
              className="px-6 py-3.5 bg-white hover:bg-blue-50 text-blue-900 font-bold rounded-xl shadow-md text-sm text-center transition-all"
            >
              Browse All Packages
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl text-sm text-center backdrop-blur-xs transition-all"
            >
              Contact Negombo Office
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
