import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company Identity */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover:opacity-95 transition-opacity">
              <Logo size="md" variant="dark" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your premier gateway to authentic Sri Lankan wonders. Headquartered along the historic Negombo coast, offering bespoke cultural journeys, wildlife expeditions, and scenic hill-country escapes.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-950/60 p-2.5 rounded-lg border border-blue-800/50">
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
              <span>SLTDA Registered Agency &bull; Negombo HQ</span>
            </div>
          </div>

          {/* Negombo Head Office & Contact */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white font-display uppercase tracking-wider">
              Negombo Headquarters
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>No. 48 Porutota Road, Negombo Beachside, Western Province, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+94 31 222 4500 (Office) / +94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@globetrekadventures.lk</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM (IST)</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white font-display uppercase tracking-wider">
              Explore Journeys
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/packages" className="hover:text-blue-400 transition-colors">
                  All Sri Lanka Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/accommodations" className="hover:text-blue-400 transition-colors">
                  Partner Luxury Villas & Eco-Lodges
                </Link>
              </li>
              <li>
                <Link to="/transportation" className="hover:text-blue-400 transition-colors">
                  Private Fleet & Scenic Railway Pass
                </Link>
              </li>
              <li>
                <Link to="/travel-guides" className="hover:text-blue-400 transition-colors">
                  Sri Lanka Travel Guides & Seasons
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  Our Negombo Heritage & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Submit a Bespoke Trip Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Currency & Assumptions Note */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white font-display uppercase tracking-wider">
              Currency & Terms
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All package prices, customized add-ons, accommodations, and transport rates are quoted and settled strictly in <strong>Sri Lankan Rupees (LKR)</strong>.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1">
              <span className="font-semibold text-slate-200 block">Simulated Demo Notice:</span>
              <p className="text-slate-400">
                Payment transactions on this demonstration portal are simulated for testing and educational purposes. No live card details are stored.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>©© 2026 GlobeTrek Adventures Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Negombo, Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
