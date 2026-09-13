import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Award, Users, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

export default function About() {
  const team = [
    {
      name: 'Kavinda Fernando',
      role: 'Managing Director & Founder',
      bio: 'Born in Negombo with over 18 years of Sri Lankan tourism leadership. Committed to authentic, community-supported travel experiences.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Dinesh Silva',
      role: 'Senior Operations & Tour Director',
      bio: 'National Tourist Guide Lecturer certified by SLTDA. Specialist in Cultural Triangle archaeology and wildlife conservation.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Amara Perera',
      role: 'Guest Experience & Coordination Manager',
      bio: 'Oversees customized guest itineraries, boutique hotel partnerships, and 24/7 on-tour traveler support.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-800/40 px-3 py-1 rounded-full border border-blue-700/50">
            About GlobeTrek Adventures
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display mt-4 mb-6">
            Born on the Negombo Coast, Dedicated to Sri Lanka
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            We are an independent, fully-licensed destination management agency headquartered in Negombo, Sri Lanka. We believe every traveler deserves a handcrafted expedition marked by warmth, safety, and deep local insight.
          </p>
        </div>
      </div>

      {/* Story & Heritage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              Our Roots
            </span>
            <h2 className="text-3xl font-bold font-display text-slate-900 mt-2 mb-6">
              Why We Call Negombo Home
            </h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                Known historically as the "Little Rome" of Ceylon, Negombo has been a crossroads of maritime trade, fishing traditions, and coastal charm for centuries. Situated just 20 minutes from Bandaranaike International Airport (BIA), Negombo serves as the premier strategic launchpad for discovering Sri Lanka.
              </p>
              <p>
                GlobeTrek Adventures was founded to bridge the gap between impersonal international tour operators and local Sri Lankan culture. When you book with GlobeTrek, you work directly with passionate residents who have navigated every mountain switchback in Ella, tracked wildlife across Yala's scrub forests, and walked the ancient ramparts of Sigiriya and Galle.
              </p>
              <p>
                Our central operations desk in Porutota Road coordinates our private vehicle fleet, inspects partner villas in person, and handles all reservations directly in Sri Lankan Rupees (LKR) without hidden intermediary markups.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
              alt="Negombo Lagoon and Fishing Catamarans"
              className="rounded-3xl shadow-xl w-full h-[420px] object-cover"
            />
            <div className="absolute -bottom-5 -right-5 bg-blue-700 text-white p-6 rounded-2xl shadow-lg max-w-xs hidden sm:block">
              <p className="text-2xl font-extrabold font-display">100%</p>
              <p className="text-xs text-blue-100 font-medium mt-1">
                Sri Lankan owned and staffed, promoting sustainable local community livelihoods.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-slate-100/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-display text-slate-900">
              Our Guiding Principles
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Every package and customized itinerary is shaped by these core commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                Uncompromising Customization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Travelers are never locked into rigid group schedules. Every tour can be tailored by accommodation tier, vehicle preference, and pace.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                Safety & Government Licensing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Registered under the Sri Lanka Tourism Development Authority (SLTDA). All vehicles carry comprehensive commercial tourist passenger insurance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                Transparent Local Pricing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero surprise fees. All quotations are clearly itemized in Sri Lankan Rupees (LKR), directly benefiting local drivers, naturalists, and hoteliers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership & Operations Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            Our People
          </span>
          <h2 className="text-3xl font-bold font-display text-slate-900 mt-2">
            Meet the GlobeTrek Team
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            The travel architects and on-ground coordinators behind your unforgettable journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((m) => (
            <div key={m.name} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-lg transition-shadow">
              <div className="h-64 overflow-hidden bg-slate-100">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 font-display">{m.name}</h3>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                  {m.role}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visit Negombo Office CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-display">
              Passing Through Negombo? Visit Our Operations Office
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Meet our team in person for a freshly brewed cup of Ceylon tea and let us walk you through custom route options on an oversized relief map of the island.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            Get Office Directions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
