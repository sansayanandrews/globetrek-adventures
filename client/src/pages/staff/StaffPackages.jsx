import React, { useState, useEffect } from 'react';
import {
  Package, Plus, Edit2, Trash2, Search, Check, X,
  Eye, EyeOff, MapPin, DollarSign, Calendar
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function StaffPackages() {
  const { addToast } = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    itinerary_summary: '',
    duration_days: 3,
    base_price_lkr: 100000,
    category: 'Cultural',
    cover_image_url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    is_published: true
  });

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/packages?all=true');
      if (res.data.success) {
        setPackages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openCreateModal = () => {
    setEditingPkg(null);
    setFormData({
      title: '',
      destination: '',
      description: '',
      itinerary_summary: 'Day 1: Arrival & briefing | Day 2: Guided tour | Day 3: Departure',
      duration_days: 3,
      base_price_lkr: 120000,
      category: 'Cultural',
      cover_image_url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
      is_published: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPkg(pkg);
    setFormData({
      title: pkg.title,
      destination: pkg.destination,
      description: pkg.description,
      itinerary_summary: pkg.itinerary_summary,
      duration_days: pkg.duration_days,
      base_price_lkr: pkg.base_price_lkr,
      category: pkg.category,
      cover_image_url: pkg.cover_image_url,
      is_published: pkg.is_published
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPkg) {
        // Update
        const res = await api.put(`/packages/${editingPkg.id}`, formData);
        if (res.data.success) {
          addToast('Tour package updated successfully!', 'success');
        }
      } else {
        // Create
        const res = await api.post('/packages', formData);
        if (res.data.success) {
          addToast('New tour package created and published!', 'success');
        }
      }
      setIsModalOpen(false);
      loadPackages();
    } catch (err) {
      console.error('Failed to save package:', err);
      addToast(err.response?.data?.error?.message || 'Error saving package.', 'error');
    }
  };

  const handleTogglePublish = async (pkg) => {
    try {
      const res = await api.put(`/packages/${pkg.id}`, {
        is_published: !pkg.is_published
      });
      if (res.data.success) {
        addToast(`Package marked as ${!pkg.is_published ? 'Published' : 'Unpublished'}.`, 'info');
        loadPackages();
      }
    } catch (err) {
      addToast('Failed to toggle publication status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await api.delete(`/packages/${id}`);
      if (res.data.success) {
        addToast('Package deleted.', 'info');
        loadPackages();
      }
    } catch (err) {
      addToast('Cannot delete package with active bookings.', 'error');
    }
  };

  const filtered = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
            Catalog Management
          </span>
          <h1 className="text-3xl font-bold font-display text-slate-900 mt-2">
            Tour Package Administration
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Create, update itineraries, set base LKR pricing, and control catalog visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Tour Package
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search packages by title or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-teal-500 shadow-2xs"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total Packages: <strong>{filtered.length}</strong>
        </span>
      </div>

      {/* Packages Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Base Rate (LKR)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={pkg.cover_image_url}
                        alt={pkg.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <strong className="text-slate-900 font-bold block">{pkg.title}</strong>
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600" /> {pkg.destination}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {pkg.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-semibold">
                    {pkg.duration_days} Days
                  </td>
                  <td className="px-6 py-4 font-extrabold text-teal-700">
                    {pkg.base_price_lkr.toLocaleString()} LKR
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePublish(pkg)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        pkg.is_published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pkg.is_published ? (
                        <>
                          <Eye className="w-3 h-3" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(pkg)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-teal-700 transition-colors"
                        title="Edit Package"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-slate-100 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold font-display text-slate-900 mb-4">
              {editingPkg ? 'Edit Tour Package' : 'Create New Sri Lanka Tour Package'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ella Scenic Highlands & Nine Arches Trek"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Ella, Badulla"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="Cultural">Cultural Heritage</option>
                    <option value="Wildlife">Wildlife Safari</option>
                    <option value="Scenic">Scenic Highlands</option>
                    <option value="Beach">Coastal & Beach</option>
                    <option value="Adventure">Active Adventure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Duration (Days) *</label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    required
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value, 10) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Base Price Per Person (LKR) *</label>
                  <input
                    type="number"
                    min={10000}
                    step={1000}
                    required
                    value={formData.base_price_lkr}
                    onChange={(e) => setFormData({ ...formData, base_price_lkr: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:bg-white focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of the tour experience..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Itinerary Breakdown (Separated by |) *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.itinerary_summary}
                  onChange={(e) => setFormData({ ...formData, itinerary_summary: e.target.value })}
                  placeholder="Day 1: Negombo to Sigiriya | Day 2: Lion Rock climb | Day 3: Return"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published_check"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 accent-teal-600"
                />
                <label htmlFor="published_check" className="font-bold text-slate-800 cursor-pointer">
                  Publish to Public Catalog Immediately
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingPkg ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
