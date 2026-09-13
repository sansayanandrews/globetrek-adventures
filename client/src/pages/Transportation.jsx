import React, { useState, useEffect } from 'react';
import { Car, ShieldCheck, Users, Luggage, Wifi, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Transportation() {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransports() {
      setLoading(true);
      try {
        const res = await api.get('/catalog/transportation');
        if (res.data.success) {
          setTransports(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load transportation:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransports();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          Fleet & Logistics
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-2">
          Transportation Services & Scenic Railway Passes
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          Comfortable, air-conditioned private fleet and guaranteed 1st-class scenic train reservations managed directly by our Negombo dispatch desk.
        </p>
      </div>

      {/* Fleet Overview Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transports.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {t.price_lkr.toLocaleString()} LKR
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
                  {t.type}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mb-3">
                  Operator: {t.provider_name}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {t.route_description}
                </p>

                {/* Amenities Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Commercial Insurance
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-blue-600" /> On-Board Wi-Fi
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> English Chauffeur
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-blue-600" /> Luggage Space
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Included in customized tours</span>
                <Link
                  to="/packages"
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                >
                  Book with Tour <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety & Standards Callout */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Certified Drivers
          </span>
          <h2 className="text-2xl font-bold font-display">
            Government Licensed Chauffeur Guides
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Every vehicle in our fleet is maintained under strict roadworthiness protocols. Our chauffeurs hold National Tourist Guide Lecturer licenses issued by the Sri Lanka Tourism Development Authority (SLTDA).
          </p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0"
        >
          Inquire About Airport Transfers
        </Link>
      </div>

    </div>
  );
}
